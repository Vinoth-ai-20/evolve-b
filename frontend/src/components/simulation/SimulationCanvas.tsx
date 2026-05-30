import { useEffect, useRef } from "react";

import { useSimulationStore } from "../../store/simulationStore";

import type { SimulationState } from "../../types/simulation";
import type { Organism } from "../../types/organism";

const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 800;

const scaleX =
  CANVAS_WIDTH / 2000;

const scaleY =
  CANVAS_HEIGHT / 2000;

function drawOrganism(
  ctx: CanvasRenderingContext2D,
  organism: Organism,
) {

  const x =
    organism.x * scaleX;

  const y =
    organism.y * scaleY;

  const radius =
    Math.max(
      2,
      organism.radius * Math.min(scaleX, scaleY),
    );

  const alpha =
    Math.min(
      1,
      Math.max(
        0.25,
        organism.energy / 200,
      ),
    );

  ctx.beginPath();

  ctx.fillStyle =
    `rgba(
      ${organism.color[0]},
      ${organism.color[1]},
      ${organism.color[2]},
      ${alpha}
    )`;

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  if (organism.food_visible) {

    ctx.beginPath();

    ctx.strokeStyle =
      "#22c55e";

    ctx.lineWidth = 1;

    ctx.arc(
      x,
      y,
      radius + 2,
      0,
      Math.PI * 2,
    );

    ctx.stroke();
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: SimulationState | null,
) {

  ctx.fillStyle =
    "#020617";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  if (!state) {
    return;
  }

  for (
    const organism
    of state.organisms
  ) {
    drawOrganism(
      ctx,
      organism,
    );
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
    `Speed: ${state.simulation_speed.toFixed(1)}x`,
    20,
    45,
  );
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

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let animationId = 0;

    const animate = () => {

      drawFrame(
        ctx,
        canvas,
        stateRef.current,
      );

      animationId =
        requestAnimationFrame(
          animate,
        );
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationId,
      );
    };

  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="
      w-full
      rounded-xl
      border
      border-slate-800
      bg-slate-950
      "
    />
  );
}