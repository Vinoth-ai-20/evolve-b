import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

import { useSimulationStore } from "../../store/simulationStore";

export default function PixiSimulationCanvas() {

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!containerRef.current) {
      return;
    }

    const app =
      new Application();

    let destroyed = false;

    app.init({
      resizeTo: containerRef.current,
      background: "#020617",
      antialias: true,
    }).then(() => {

      if (destroyed) {
        app.destroy();
        return;
      }

      containerRef.current?.appendChild(
        app.canvas
      );

      const tick = () => {

        app.stage.removeChildren();

        const state =
          useSimulationStore.getState()
            .state;

        if (!state) {
          return;
        }

        for (const organism of state.organisms) {

          const circle =
            new Graphics();

          circle.circle(
            organism.x,
            organism.y,
            Math.max(
              2,
              organism.radius
            ),
          );

          const color =
            (organism.color[0] << 16) |
            (organism.color[1] << 8) |
            organism.color[2];

          circle.fill(color);

          app.stage.addChild(
            circle
          );
        }
      };

      app.ticker.add(tick);

    });

    return () => {
      destroyed = true;
      app.ticker.stop();
      app.destroy();
    };

  }, []);

  return (
    <div
      ref={containerRef}
      className="
h-[800px]
w-full
rounded-xl
border
border-slate-800
"
    />
  );
}