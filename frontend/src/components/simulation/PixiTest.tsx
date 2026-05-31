import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export default function PixiTest() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!containerRef.current) {
      return;
    }

    let app: Application;

    const init = async () => {

      app = new Application();

      await app.init({
        width: 800,
        height: 600,
        background: "#020617",
      });

      containerRef.current?.appendChild(
        app.canvas
      );

      const circle =
        new Graphics()
          .circle(
            400,
            300,
            50
          )
          .fill(
            0x22d3ee
          );

      app.stage.addChild(
        circle
      );
    };

    init();

    return () => {

      if (app) {
        app.destroy();
      }

    };

  }, []);

  return (
    <div
      ref={containerRef}
      className="border border-slate-800"
    />
  );
}