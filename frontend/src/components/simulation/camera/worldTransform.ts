import type { Camera } from "./Camera";

export function createCamera(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth: number,
  worldHeight: number,
): Camera {

  const zoom =
    Math.min(
      viewportWidth / worldWidth,
      viewportHeight / worldHeight,
    ) * 0.95;

  return {
    x: worldWidth / 2,
    y: worldHeight / 2,
    zoom,

    viewportWidth,
    viewportHeight,

    worldWidth,
    worldHeight,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera,
) {

  return {
    x:
      (worldX - camera.x) *
      camera.zoom +
      camera.viewportWidth / 2,

    y:
      (worldY - camera.y) *
      camera.zoom +
      camera.viewportHeight / 2,
  };
}