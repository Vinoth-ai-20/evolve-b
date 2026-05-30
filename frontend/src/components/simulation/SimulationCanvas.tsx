import { useEffect, useRef } from "react";

import { useSimulationStore } from "../../store/simulationStore";

import type { SimulationState } from "../../types/simulation";
import type { Organism } from "../../types/organism";

const VIEWPORT_PADDING = 40;
const CLICK_THRESHOLD = 20;

interface RenderedOrganism {
  organism: Organism;
  screenX: number;
  screenY: number;
  radius: number;
}

interface TransformData {
  scale: number;
  centerX: number;
  centerY: number;
}

function calculateTransform(
  state: SimulationState,
  width: number,
  height: number,
): TransformData {

  if (
    state.organisms.length === 0
  ) {
    return {
      scale: 1,
      centerX: 0,
      centerY: 0,
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (
    const organism
    of state.organisms
  ) {
    minX = Math.min(
      minX,
      organism.x,
    );

    maxX = Math.max(
      maxX,
      organism.x,
    );

    minY = Math.min(
      minY,
      organism.y,
    );

    maxY = Math.max(
      maxY,
      organism.y,
    );
  }

  const worldWidth =
    Math.max(
      1,
      maxX - minX,
    );

  const worldHeight =
    Math.max(
      1,
      maxY - minY,
    );

  const scaleX =
    (width -
      VIEWPORT_PADDING * 2) /
    worldWidth;

  const scaleY =
    (height -
      VIEWPORT_PADDING * 2) /
    worldHeight;

  return {
    scale: Math.min(
      scaleX,
      scaleY,
    ),

    centerX:
      (minX + maxX) / 2,

    centerY:
      (minY + maxY) / 2,
  };
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: SimulationState | null,
  selectedId: string | null,
): RenderedOrganism[] {

  ctx.fillStyle =
    "#020617";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  if (!state) {
    return [];
  }

  const {
    scale: fitScale,
    centerX,
    centerY,
  } = calculateTransform(
    state,
    canvas.width,
    canvas.height,
  );

  const store =
    useSimulationStore.getState();

  const camera =
    store.camera;

  if (
    store.followSelected &&
    selectedId
  ) {
    const selected =
      state.organisms.find(
        (o) =>
          o.id === selectedId
      );

    if (selected) {
      store.setCameraPosition(
        selected.x,
        selected.y
      );
    }
  }

  if (
    camera.x === 0 &&
    camera.y === 0
  ) {
    store.setCameraPosition(
      centerX,
      centerY,
    );
  }

  const scale =
    fitScale *
    camera.zoom;

  const rendered: RenderedOrganism[] =
    [];

  for (
    const organism
    of state.organisms
  ) {

    const x =
      (
        organism.x -
        camera.x
      ) *
      scale +
      canvas.width / 2;

    const y =
      (
        organism.y -
        camera.y
      ) *
      scale +
      canvas.height / 2;

    const radius =
      Math.max(
        3,
        organism.radius *
        scale,
      );

    rendered.push({
      organism,
      screenX: x,
      screenY: y,
      radius,
    });

    const alpha =
      Math.min(
        1,
        Math.max(
          0.25,
          organism.energy /
          200,
        ),
      );

    ctx.beginPath();

    ctx.fillStyle = `rgba(
${organism.color[0]},
${organism.color[1]},
${organism.color[2]},
${alpha}
)`;

    ctx.shadowBlur = 4;

    ctx.shadowColor = `rgb(
${organism.color[0]},
${organism.color[1]},
${organism.color[2]}
)`;

    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    if (
      organism.id ===
      selectedId
    ) {
      ctx.beginPath();

      const pulse =
        5 +
        Math.sin(
          Date.now() / 150
        ) *
        2;

      ctx.strokeStyle =
        "#22d3ee";

      ctx.lineWidth = 3;

      ctx.arc(
        x,
        y,
        radius + pulse,
        0,
        Math.PI * 2,
      );

      ctx.stroke();
    }
  }

  ctx.fillStyle =
    "#e2e8f0";

  ctx.font =
    "12px monospace";

  ctx.fillText(
    `Population: ${state.organisms.length}`,
    20,
    25,
  );

  ctx.fillText(
    `Zoom: ${(camera.zoom * 100).toFixed(0)}%`,
    20,
    45,
  );

  return rendered;
}

export default function SimulationCanvas() {

  const canvasRef =
    useRef<HTMLCanvasElement>(
      null,
    );

  const stateRef =
    useRef<SimulationState | null>(
      null,
    );

  const renderedRef =
    useRef<
      RenderedOrganism[]
    >([]);

  const draggingRef =
    useRef(false);

  const lastMouseRef =
    useRef({
      x: 0,
      y: 0,
    });

  useEffect(() => {

    const unsubscribe =
      useSimulationStore.subscribe(
        (store) => {
          stateRef.current =
            store.state;
        },
      );

    return unsubscribe;

  }, []);

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const resize =
      () => {

        const rect =
          canvas.getBoundingClientRect();

        canvas.width =
          rect.width;

        canvas.height =
          rect.height;
      };

    resize();

    window.addEventListener(
      "resize",
      resize,
    );

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const handleWheel = (
      event: WheelEvent,
    ) => {

      event.preventDefault();

      const store =
        useSimulationStore.getState();

      const factor =
        event.deltaY > 0
          ? 0.9
          : 1.1;

      store.setZoom(
        Math.min(
          10,
          Math.max(
            0.25,
            store.camera.zoom *
            factor,
          ),
        ),
      );
    };

    const handleMouseDown = (
      event: MouseEvent,
    ) => {

      draggingRef.current =
        true;

      lastMouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp =
      () => {
        draggingRef.current =
          false;
      };

    const handleMouseMove = (
      event: MouseEvent,
    ) => {

      if (
        !draggingRef.current
      ) {
        return;
      }

      const dx =
        event.clientX -
        lastMouseRef.current.x;

      const dy =
        event.clientY -
        lastMouseRef.current.y;

      lastMouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      const store =
        useSimulationStore.getState();

      const zoom =
        store.camera.zoom;

      store.setCameraPosition(
        store.camera.x -
        dx / zoom,
        store.camera.y -
        dy / zoom,
      );
    };

    const handleClick = (
      event: MouseEvent,
    ) => {

      const rect =
        canvas.getBoundingClientRect();

      const mouseX =
        event.clientX -
        rect.left;

      const mouseY =
        event.clientY -
        rect.top;

      let nearest:
        | string
        | null = null;

      let nearestDistance =
        Infinity;

      for (
        const rendered
        of renderedRef.current
      ) {

        const dx =
          mouseX -
          rendered.screenX;

        const dy =
          mouseY -
          rendered.screenY;

        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy,
          );

        if (
          distance <
          CLICK_THRESHOLD &&
          distance <
          nearestDistance
        ) {

          nearestDistance =
            distance;

          nearest =
            rendered.organism.id;
        }
      }

      useSimulationStore
        .getState()
        .setSelectedOrganism(
          nearest,
        );
    };

    canvas.addEventListener(
      "wheel",
      handleWheel,
      { passive: false },
    );

    canvas.addEventListener(
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

    canvas.addEventListener(
      "click",
      handleClick,
    );

    let animationId = 0;

    const animate =
      () => {

        renderedRef.current =
          drawFrame(
            ctx,
            canvas,
            stateRef.current,
            useSimulationStore.getState()
              .selectedOrganismId,
          );

        animationId =
          requestAnimationFrame(
            animate,
          );
      };

    animate();

    return () => {

      canvas.removeEventListener(
        "wheel",
        handleWheel,
      );

      canvas.removeEventListener(
        "mousedown",
        handleMouseDown,
      );

      canvas.removeEventListener(
        "click",
        handleClick,
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp,
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      window.removeEventListener(
        "resize",
        resize,
      );

      cancelAnimationFrame(
        animationId,
      );
    };

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
      h-200
      w-full
      rounded-xl
      border
      border-slate-800
      bg-slate-950
      cursor-grab
      "
    />
  );
}