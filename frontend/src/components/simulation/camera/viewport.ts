// frontend/src/components/simulation/camera/viewport.ts

import type { Camera } from "./Camera";

export function visibleBounds(
  camera: Camera,
) {

  const width =
    camera.viewportWidth /
    camera.zoom;

  const height =
    camera.viewportHeight /
    camera.zoom;

  return {

    left:
      camera.x -
      width / 2,

    right:
      camera.x +
      width / 2,

    top:
      camera.y -
      height / 2,

    bottom:
      camera.y +
      height / 2,
  };
}

