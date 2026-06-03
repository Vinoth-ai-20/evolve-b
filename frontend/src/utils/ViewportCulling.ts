/**
 * Viewport culling - determines which organisms are visible based on camera
 * Enables efficient rendering at scale (1K, 5K, 10K+ organisms)
 */

export interface CameraBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface CullConfig {
  /** Canvas width in pixels */
  canvasWidth: number;
  /** Canvas height in pixels */
  canvasHeight: number;
  /** Camera position X in world space */
  cameraX: number;
  /** Camera position Y in world space */
  cameraY: number;
  /** Camera zoom level */
  zoom: number;
  /** Padding in world units (objects partially visible) */
  cullingPadding: number;
}

/**
 * Calculate visible world bounds based on camera position and zoom
 */
export function calculateVisibleBounds(config: CullConfig): CameraBounds {
  const { canvasWidth, canvasHeight, cameraX, cameraY, zoom, cullingPadding } =
    config;

  // Convert screen space to world space
  const viewportWidth = canvasWidth / zoom;
  const viewportHeight = canvasHeight / zoom;

  const minX = cameraX - viewportWidth / 2 - cullingPadding;
  const maxX = cameraX + viewportWidth / 2 + cullingPadding;
  const minY = cameraY - viewportHeight / 2 - cullingPadding;
  const maxY = cameraY + viewportHeight / 2 + cullingPadding;

  return { minX, maxX, minY, maxY };
}

/**
 * Check if a point is within visible bounds
 */
export function isVisible(
  x: number,
  y: number,
  radius: number,
  bounds: CameraBounds
): boolean {
  // Circle is visible if any part intersects with viewport
  return (
    x + radius > bounds.minX &&
    x - radius < bounds.maxX &&
    y + radius > bounds.minY &&
    y - radius < bounds.maxY
  );
}

/**
 * Filter organisms by visibility
 */
export function filterVisibleOrganisms<T extends { x: number; y: number; radius?: number }>(
  organisms: T[],
  bounds: CameraBounds
): T[] {
  return organisms.filter((org) => {
    const radius = org.radius ?? 20;
    return isVisible(org.x, org.y, radius, bounds);
  });
}
