// frontend/src/components/simulation/camera/cameraStore.ts

import { create } from "zustand";

interface CameraState {
  x: number;
  y: number;
  zoom: number;

  setPosition: (
    x: number,
    y: number,
  ) => void;

  pan: (
    dx: number,
    dy: number,
  ) => void;

  setZoom: (
    zoom: number,
  ) => void;
}

export const useCameraStore =
  create<CameraState>(
    (set) => ({
      x: 0,
      y: 0,
      zoom: 1,

      setPosition: (
        x,
        y,
      ) =>
        set({
          x,
          y,
        }),

      pan: (
        dx,
        dy,
      ) =>
        set(
          (state) => ({
            x:
              state.x + dx,
            y:
              state.y + dy,
          }),
        ),

      setZoom: (
        zoom,
      ) =>
        set({
          zoom:
            Math.max(
              0.1,
              Math.min(
                zoom,
                20,
              ),
            ),
        }),
    }),
  );


  