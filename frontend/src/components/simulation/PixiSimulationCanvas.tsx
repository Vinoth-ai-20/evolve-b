import { useEffect, useRef } from "react";
import { Application, Graphics, Container } from "pixi.js";
import { useSimulationStore } from "../../store/simulationStore";
import { GraphicsPool } from "../../utils/GraphicsPool";
import { calculateVisibleBounds, isVisible } from "../../utils/ViewportCulling";

export default function PixiSimulationCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphicsMap = useRef<Map<string, Graphics>>(new Map());
  const poolRef = useRef<GraphicsPool | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let destroyed = false;

    const app = new Application();
    const graphics = graphicsMap.current;
    const pool = new GraphicsPool(200); // Start with 200 graphics
    poolRef.current = pool;

    const initialize = async () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      await app.init({
        resizeTo: container,
        background: "#020617",
        antialias: true,
      });

      // Clear container and append canvas
      container.innerHTML = '';
      container.appendChild(app.canvas);

      if (destroyed) {
        app.destroy();
        pool.destroy();
        return;
      }

      const world = new Container();
      app.stage.addChild(world);

      // Create heatmap layer
      const heatmapGraphics = new Graphics();
      world.addChild(heatmapGraphics);

      let dragging = false;
      let lastX = 0;
      let lastY = 0;

      // Debounce camera input: collect changes and batch update
      let pendingCameraX = 0;
      let pendingCameraY = 0;
      let hasPendingUpdate = false;
      let lastCameraUpdate = 0;
      const CAMERA_UPDATE_INTERVAL = 16; // ~60 Hz

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        const store = useSimulationStore.getState();
        const rect = app.canvas.getBoundingClientRect();

        // Get mouse position relative to canvas
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate world position of mouse BEFORE zoom
        const worldMouseX = store.camera.x + (mouseX - centerX) / store.camera.zoom;
        const worldMouseY = store.camera.y + (mouseY - centerY) / store.camera.zoom;

        // Calculate new zoom level
        const nextZoom =
          event.deltaY > 0
            ? store.camera.zoom * 0.9
            : store.camera.zoom * 1.1;

        const clampedZoom = Math.max(
          0.1,
          Math.min(nextZoom, 20),
        );

        // Adjust camera position to keep mouse position constant in world space
        const newCameraX = worldMouseX - (mouseX - centerX) / clampedZoom;
        const newCameraY = worldMouseY - (mouseY - centerY) / clampedZoom;

        // Atomic update: apply zoom and camera together in single state update
        store.setZoomAndCamera(clampedZoom, newCameraX, newCameraY);
      };

      const handleMouseDown = (
        event: MouseEvent,
      ) => {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
      };

      const handleMouseUp = () => {
        dragging = false;
        // Flush pending camera update
        if (hasPendingUpdate) {
          const store = useSimulationStore.getState();
          store.setCameraPosition(pendingCameraX, pendingCameraY);
          hasPendingUpdate = false;
        }
      };

      const handleMouseMove = (
        event: MouseEvent,
      ) => {
        if (!dragging) {
          return;
        }

        const store =
          useSimulationStore.getState();

        const dx =
          event.clientX - lastX;

        const dy =
          event.clientY - lastY;

        // Collect camera delta
        pendingCameraX =
          store.camera.x -
          dx / store.camera.zoom;
        pendingCameraY =
          store.camera.y -
          dy / store.camera.zoom;

        hasPendingUpdate = true;

        lastX = event.clientX;
        lastY = event.clientY;

        // Batch update at fixed interval
        const now = Date.now();
        if (now - lastCameraUpdate >= CAMERA_UPDATE_INTERVAL) {
          store.setCameraPosition(
            pendingCameraX,
            pendingCameraY,
          );
          hasPendingUpdate = false;
          lastCameraUpdate = now;
        }
      };

      app.canvas.addEventListener(
        "wheel",
        handleWheel,
      );

      app.canvas.addEventListener(
        "mousedown",
        handleMouseDown,
      );

      window.addEventListener(
        "mouseup",
        handleMouseUp,
      );

      window.addEventListener(
        "mousemove",
        handleMouseMove,
      );

      let firstFrameLogged = false;
      let viewportInitialized = false;

      // Enable culling for scale (1000+ organisms)
      const CULLING_THRESHOLD = 500;

      const tick = () => {
        const store =
          useSimulationStore.getState();

        const state = store.state;

        if (!state) {
          return;
        }

        world.scale.set(
          store.camera.zoom,
        );

        world.position.set(
          -store.camera.x *
          store.camera.zoom,
          -store.camera.y *
          store.camera.zoom,
        );

        const activeIds =
          new Set<string>();

        // Calculate visible bounds for culling
        const shouldCull =
          state.organisms.length > CULLING_THRESHOLD;
        let visibleBounds = null;

        if (shouldCull) {
          visibleBounds = calculateVisibleBounds({
            canvasWidth: app.canvas.width,
            canvasHeight: app.canvas.height,
            cameraX: store.camera.x,
            cameraY: store.camera.y,
            zoom: store.camera.zoom,
            cullingPadding: 100,
          });
        }

        if (!firstFrameLogged) {
          firstFrameLogged = true;
        }

        // Initialize viewport on first frame with organisms
        if (!viewportInitialized && state.organisms.length > 0) {
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;

          for (const organism of state.organisms) {
            minX = Math.min(minX, organism.x);
            maxX = Math.max(maxX, organism.x);
            minY = Math.min(minY, organism.y);
            maxY = Math.max(maxY, organism.y);
          }

          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;

          store.setCameraPosition(centerX, centerY);
          viewportInitialized = true;
        }

        for (const organism of state.organisms) {
          // Cull organisms outside viewport
          if (shouldCull && visibleBounds) {
            if (
              !isVisible(
                organism.x,
                organism.y,
                organism.radius ?? 20,
                visibleBounds
              )
            ) {
              // Hide but keep in map for state tracking
              const graphic = graphics.get(organism.id);
              if (graphic && graphic.parent) {
                world.removeChild(graphic);
                pool.release(graphic);
                graphics.delete(organism.id);
              }
              continue;
            }
          }

          activeIds.add(
            organism.id,
          );

          const graphic = graphics.get(
            organism.id,
          ) ?? (() => {
            const newGraphic = pool.acquire();

            // Use organism's actual radius and color (RGB array to hex)
            const radius = organism.radius;

            // Convert RGB array [R, G, B] to hex number
            let color = 0x4ade80; // default green
            if (Array.isArray(organism.color) && organism.color.length === 3) {
              const [r, g, b] = organism.color;
              color = (r << 16) | (g << 8) | b;
            }

            newGraphic
              .circle(0, 0, radius)
              .fill(color);

            world.addChild(newGraphic);

            graphics.set(
              organism.id,
              newGraphic,
            );

            return newGraphic;
          })();

          graphic.position.set(
            organism.x,
            organism.y,
          );
        }

        for (const [
          id,
          graphic,
        ] of graphics) {
          if (
            !activeIds.has(id)
          ) {
            world.removeChild(
              graphic,
            );

            // Return to pool instead of destroying
            pool.release(graphic);

            graphics.delete(id);
          }
        }

        // Render heatmap if enabled
        heatmapGraphics.clear();

        if (store.heatmapMode === "population") {
          const cellSize = 40;
          const density = new Map<string, number>();

          for (const organism of state.organisms) {
            const gx = Math.floor(organism.x / cellSize);
            const gy = Math.floor(organism.y / cellSize);
            const key = `${gx}:${gy}`;
            density.set(key, (density.get(key) ?? 0) + 1);
          }

          for (const [key, count] of density) {
            const [gx, gy] = key.split(":").map(Number);
            const x = gx * cellSize;
            const y = gy * cellSize;
            const intensity = Math.min(1, count / 8);
            const red = Math.floor(255 * intensity);
            const green = Math.floor(255 * (1 - intensity));
            const alpha = 0.6;

            heatmapGraphics
              .rect(x, y, cellSize, cellSize)
              .fill({
                color: (red << 16) | (green << 8) | 0,
                alpha,
              });
          }
        } else if (store.heatmapMode === "resources") {
          const grid = state.resource_grid;

          if (grid && grid.length) {
            const cellSize = 80;

            for (let gx = 0; gx < grid.length; gx++) {
              for (let gy = 0; gy < grid[gx].length; gy++) {
                const value = grid[gx][gy];
                const x = gx * cellSize;
                const y = gy * cellSize;

                heatmapGraphics
                  .rect(x, y, cellSize, cellSize)
                  .fill({
                    color: 0x00ff00,
                    alpha: value * 0.35,
                  });
              }
            }
          }
        }
      };

      app.ticker.add(tick);

      return () => {
        app.ticker.remove(tick);

        app.canvas.removeEventListener(
          "wheel",
          handleWheel,
        );

        app.canvas.removeEventListener(
          "mousedown",
          handleMouseDown,
        );

        window.removeEventListener(
          "mouseup",
          handleMouseUp,
        );

        window.removeEventListener(
          "mousemove",
          handleMouseMove,
        );
      };
    };

    let cleanup:
      | (() => void)
      | undefined;

    initialize().then(
      (fn) => {
        cleanup = fn;
      },
    );

    return () => {
      destroyed = true;

      cleanup?.();

      graphics.forEach(
        (graphic) => {
          // Return to pool on cleanup
          pool.release(graphic);
        },
      );

      graphics.clear();

      // Destroy pool
      pool.destroy();

      try {
        app.destroy(
          true,
          true,
        );
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        h-full
        w-full
        rounded-xl
        border
        border-slate-800
        overflow-hidden
      "
    />
  );
}