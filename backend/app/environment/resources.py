import numpy as np


class ResourceField:
    def __init__(self, width, height):
        self.grid = np.random.rand(
            width,
            height,
        )

    def consume(
        self,
        x: int,
        y: int,
        amount: float,
    ) -> float:
        available = self.grid[x][y]

        consumed = min(available, amount)

        self.grid[x][y] -= consumed

        return consumed

    def regenerate(self, amount: float):
        self.grid += amount
        np.clip(self.grid, 0.0, 1.0, out=self.grid)

    def consume_resource(
        self,
        x: float,
        y: float,
        amount: float = 0.15,
    ):
        grid_x = int(x / 20)
        grid_y = int(y / 20)

        grid_x = max(0, min(grid_x, self.grid.shape[0] - 1))

        grid_y = max(0, min(grid_y, self.grid.shape[1] - 1))

        available = self.grid[grid_x, grid_y]

        consumed = min(available, amount)

        self.grid[grid_x, grid_y] -= consumed

        return consumed
