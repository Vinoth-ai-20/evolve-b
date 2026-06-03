import { Graphics } from "pixi.js";

/**
 * Graphics object pool to reduce garbage collection pressure
 * Reuses Graphics objects instead of creating/destroying on every frame
 */
export class GraphicsPool {
  private availableGraphics: Graphics[] = [];
  private activeGraphics: Set<Graphics> = new Set();

  constructor(private initialSize: number = 100) {
    // Pre-allocate graphics
    for (let i = 0; i < initialSize; i++) {
      this.availableGraphics.push(new Graphics());
    }
  }

  /**
   * Acquire a Graphics object from the pool
   */
  acquire(): Graphics {
    let graphic: Graphics;

    if (this.availableGraphics.length > 0) {
      // Reuse from pool
      graphic = this.availableGraphics.pop()!;
      graphic.clear();
    } else {
      // Pool exhausted, create new (will grow)
      graphic = new Graphics();
    }

    this.activeGraphics.add(graphic);
    return graphic;
  }

  /**
   * Release a Graphics object back to the pool
   */
  release(graphic: Graphics): void {
    if (this.activeGraphics.has(graphic)) {
      this.activeGraphics.delete(graphic);
      graphic.clear();
      this.availableGraphics.push(graphic);
    }
  }

  /**
   * Release all active graphics
   */
  releaseAll(): void {
    for (const graphic of this.activeGraphics) {
      graphic.clear();
      this.availableGraphics.push(graphic);
    }
    this.activeGraphics.clear();
  }

  /**
   * Destroy all graphics in the pool
   */
  destroy(): void {
    for (const graphic of this.availableGraphics) {
      graphic.destroy();
    }
    for (const graphic of this.activeGraphics) {
      graphic.destroy();
    }
    this.availableGraphics = [];
    this.activeGraphics.clear();
  }

  /**
   * Get statistics about pool usage
   */
  getStats() {
    return {
      available: this.availableGraphics.length,
      active: this.activeGraphics.size,
      total: this.availableGraphics.length + this.activeGraphics.size,
    };
  }
}
