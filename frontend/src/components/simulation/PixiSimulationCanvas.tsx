import { useEffect, useRef } from "react";
import { Application, Graphics, Container } from "pixi.js";
import { useSimulationStore } from "../../store/simulationStore";
import { GraphicsPool } from "../../utils/GraphicsPool";
import { calculateVisibleBounds, isVisible } from "../../utils/ViewportCulling";

// Declare debug utilities on window
declare global {
  interface Window {
    __lastSelectedId?: string | null;
    __selectionDebug: {
      getState: () => Record<string, unknown>;
      clearSelection: () => void;
      selectOrganism: (id: string) => void;
    };
  }
}

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

      // Force canvas to fill container
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      app.canvas.style.display = 'block';

      // Add ResizeObserver to handle container resizing
      const resizeObserver = new ResizeObserver(() => {
        if (app && container) {
          app.resize();
        }
      });
      resizeObserver.observe(container);

      if (destroyed) {
        app.destroy();
        pool.destroy();
        resizeObserver.disconnect();
        return;
      }

      const world = new Container();
      app.stage.addChild(world);

      // Create containers for proper layering
      // Order matters: organisms rendered first, then overlays on top
      const organismsContainer = new Container();
      world.addChild(organismsContainer);

      const heatmapGraphics = new Graphics();
      world.addChild(heatmapGraphics);

      // Create hover ring layer (visual feedback for mouse-over)
      const hoverRing = new Graphics();
      world.addChild(hoverRing);

      // Create selection ring layer (ALWAYS ON TOP)
      const selectionRing = new Graphics();
      world.addChild(selectionRing);

      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let lastMouseWorldX = 0;
      let lastMouseWorldY = 0;

      // Cache hover detection to avoid checking every frame
      let cachedHoverOrganism: { x: number; y: number; radius?: number; id: string } | null = null;
      let lastHoverCheckFrame = -100;
      let frameCount = 0;
      let fpsFrames = 0;
      let fpsLastTime = performance.now();
      const HOVER_CHECK_FREQUENCY = 6; // Check every 6 frames (~10Hz instead of 60Hz)

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
        const store =
          useSimulationStore.getState();

        const rect = app.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Track world position for hover detection
        lastMouseWorldX = store.camera.x + (canvasX - centerX) / store.camera.zoom;
        lastMouseWorldY = store.camera.y + (canvasY - centerY) / store.camera.zoom;

        if (!dragging) {
          return;
        }

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

      // Get organism at current mouse position (for hover effect)
      const getOrganismAtMouse = () => {
        const store = useSimulationStore.getState();
        const state = store.state;
        if (!state) return null;

        const screenClickTolerance = 15;
        const hoverTolerance = screenClickTolerance / store.camera.zoom;

        let closestOrganism = null;
        let closestDistance = Infinity;

        for (const organism of state.organisms) {
          const radius = organism.radius ?? 20;
          const distance = Math.sqrt(
            (lastMouseWorldX - organism.x) ** 2 +
            (lastMouseWorldY - organism.y) ** 2
          );

          if (distance <= radius + hoverTolerance && distance < closestDistance) {
            closestOrganism = organism;
            closestDistance = distance;
          }
        }

        return closestOrganism;
      };

      // Hit testing and organism selection
      const getOrganismAtPoint = (canvasX: number, canvasY: number) => {
        const store = useSimulationStore.getState();
        const state = store.state;
        if (!state) {
          console.log('[Selection] No state available for hit test');
          return null;
        }

        const centerX = app.canvas.width / 2;
        const centerY = app.canvas.height / 2;

        // Convert screen coordinates to world coordinates
        const worldX = store.camera.x + (canvasX - centerX) / store.camera.zoom;
        const worldY = store.camera.y + (canvasY - centerY) / store.camera.zoom;

        // CRITICAL FIX: Click tolerance should scale with zoom
        // Convert screen-space tolerance to world-space based on current zoom level
        const screenClickTolerance = 15; // pixels on screen
        const clickTolerance = screenClickTolerance / store.camera.zoom; // pixels in world space

        console.log('[Selection] Hit test:', {
          canvasClick: { x: canvasX, y: canvasY },
          worldPos: { x: worldX.toFixed(1), y: worldY.toFixed(1) },
          camera: { x: store.camera.x.toFixed(1), y: store.camera.y.toFixed(1), zoom: store.camera.zoom.toFixed(2) },
          tolerance: clickTolerance.toFixed(1),
          organisms: state.organisms.length,
        });

        let closestOrganism = null;
        let closestDistance = Infinity;

        for (const organism of state.organisms) {
          const radius = organism.radius ?? 20;
          const distance = Math.sqrt(
            (worldX - organism.x) ** 2 +
            (worldY - organism.y) ** 2
          );

          // Hit if within organism radius + tolerance
          if (distance <= radius + clickTolerance) {
            console.log('[Selection] Hit organism:', organism.id.slice(0, 8) + '...', {
              distance: distance.toFixed(1),
              radius: radius.toFixed(1),
              hitRadius: (radius + clickTolerance).toFixed(1),
            });
          }

          if (distance <= radius + clickTolerance && distance < closestDistance) {
            closestOrganism = organism;
            closestDistance = distance;
          }
        }

        console.log('[Selection] Hit result: closest organism:', closestOrganism?.id.slice(0, 8) + '...' || 'none', 'distance:', closestDistance.toFixed(1));
        return closestOrganism;
      };

      const handleCanvasClick = (event: MouseEvent) => {
        console.log('[Selection] ===== CLICK EVENT =====');

        if (dragging) {
          console.log('[Selection] Click ignored: currently dragging');
          return;
        }

        const rect = app.canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        console.log('[Selection] Canvas click position:', {
          x: canvasX.toFixed(1),
          y: canvasY.toFixed(1),
          canvasSize: { width: rect.width, height: rect.height },
          eventTarget: (event.target as HTMLCanvasElement | null)?.constructor?.name || 'unknown',
        });

        const organism = getOrganismAtPoint(canvasX, canvasY);
        const store = useSimulationStore.getState();

        if (organism) {
          console.log('[Selection] ✓ Selected organism:', organism.id.slice(0, 8) + '...', 'at', { x: organism.x.toFixed(1), y: organism.y.toFixed(1) });
          store.setSelectedOrganism(organism.id);
          console.log('[Selection] Store state after selection:', { selectedId: store.selectedOrganismId });
        } else {
          console.log('[Selection] ✓ Click on empty space: clearing selection');
          store.setSelectedOrganism(null);
          console.log('[Selection] Store state after clear:', { selectedId: store.selectedOrganismId });
        }
        console.log('[Selection] ===== END CLICK =====');
      };

      app.canvas.addEventListener(
        "click",
        handleCanvasClick,
      );

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

      // Also add pointer-events-auto to canvas to ensure it receives clicks
      app.canvas.style.pointerEvents = 'auto';

      // Debug utilities exposed on window
      window.__selectionDebug = {
        getState: () => {
          const store = useSimulationStore.getState();
          return {
            selectedId: store.selectedOrganismId,
            followSelected: store.followSelected,
            organisms: store.state?.organisms.length || 0,
            camera: store.camera,
          };
        },
        clearSelection: () => {
          useSimulationStore.getState().setSelectedOrganism(null);
          console.log('[Debug] Selection cleared');
        },
        selectOrganism: (id: string) => {
          useSimulationStore.getState().setSelectedOrganism(id);
          console.log('[Debug] Selected organism:', id);
        },
      };

      let firstFrameLogged = false;
      let viewportInitialized = false;

      // Enable culling for scale (1000+ organisms)
      const CULLING_THRESHOLD = 500;

      const tick = () => {
        frameCount++;

        fpsFrames++;

        const now = performance.now();

        if (now - fpsLastTime >= 1000) {
          useSimulationStore
            .getState()
            .setFps(
              Math.round(
                (fpsFrames * 1000) /
                (now - fpsLastTime)
              )
            );

          fpsFrames = 0;
          fpsLastTime = now;
        }
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
          app.canvas.width / 2 -
          store.camera.x * store.camera.zoom,
          app.canvas.height / 2 -
          store.camera.y * store.camera.zoom,
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
                organismsContainer.removeChild(graphic);
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

            organismsContainer.addChild(newGraphic);

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
            organismsContainer.removeChild(
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

        // Render hover ring for mouse-over feedback (skip frames to reduce lag)
        // Only update hover detection every N frames
        if (frameCount - lastHoverCheckFrame >= HOVER_CHECK_FREQUENCY) {
          cachedHoverOrganism = getOrganismAtMouse();
          lastHoverCheckFrame = frameCount;
        }

        hoverRing.clear();
        if (cachedHoverOrganism && cachedHoverOrganism.id !== store.selectedOrganismId) {
          // Show hover ring for organisms under cursor (but not selected)
          const radius = cachedHoverOrganism.radius ?? 20;
          hoverRing
            .circle(cachedHoverOrganism.x, cachedHoverOrganism.y, radius + 2)
            .stroke({ color: 0xffaa00, width: 1, alpha: 0.6 });
        }

        // Render selection ring and handle follow mode
        selectionRing.clear();

        if (store.selectedOrganismId) {
          const selectedOrg = state.organisms.find(
            (o) => o.id === store.selectedOrganismId
          );

          if (selectedOrg) {
            const radius = selectedOrg.radius ?? 20;

            // Draw triple selection ring for high visibility
            // Outer glow ring
            selectionRing
              .circle(selectedOrg.x, selectedOrg.y, radius + 8)
              .stroke({ color: 0x00ff00, width: 3, alpha: 0.3 });

            // Middle ring (main indicator)
            selectionRing
              .circle(selectedOrg.x, selectedOrg.y, radius + 5)
              .stroke({ color: 0x00ff00, width: 2, alpha: 0.8 });

            // Inner bright ring (sharp focus)
            selectionRing
              .circle(selectedOrg.x, selectedOrg.y, radius + 2)
              .stroke({ color: 0x00ff00, width: 2, alpha: 1.0 });

            // Log rendering for debugging
            if (!window.__lastSelectedId || window.__lastSelectedId !== store.selectedOrganismId) {
              console.log('[Selection] Rendering selection ring for:', store.selectedOrganismId.slice(0, 8) + '...', 'at', { x: selectedOrg.x.toFixed(1), y: selectedOrg.y.toFixed(1), radius: radius.toFixed(1) });
              window.__lastSelectedId = store.selectedOrganismId;
            }

            // Apply camera follow if enabled
            if (store.followSelected) {
              store.setCameraPosition(selectedOrg.x, selectedOrg.y);
            }
          } else {
            // Selected organism not found in state (may have died)
            console.log('[Selection] ⚠ Selected organism not found in state:', store.selectedOrganismId);
          }
        } else if (window.__lastSelectedId) {
          console.log('[Selection] Selection cleared');
          window.__lastSelectedId = null;
        }
      };

      app.ticker.add(tick);

      return () => {
        app.ticker.remove(tick);

        resizeObserver.disconnect();

        app.canvas.removeEventListener(
          "wheel",
          handleWheel,
        );

        app.canvas.removeEventListener(
          "click",
          handleCanvasClick,
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
        relative
      "
    />
  );
}