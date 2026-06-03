import random
import numpy as np


class ResourceField:

    def __init__(
        self,
        width,
        height,
    ):

        self.width = width
        self.height = height

        self.grid = np.random.rand(
            width,
            height,
        )

        self.hotspots = []

        self.hotspot_lifetime = 3000
        self.last_hotspot_shift = 0

        for _ in range(8):

            self.hotspots.append(
                (
                    random.randint(0, width - 1),
                    random.randint(0, height - 1),
                )
            )

    def regenerate(
        self,
        amount: float,
    ):

        self.grid += amount

        for hotspot_x, hotspot_y in self.hotspots:

            radius = 6

            for dx in range(-radius, radius + 1):

                for dy in range(-radius, radius + 1):

                    x = hotspot_x + dx
                    y = hotspot_y + dy

                    if x < 0 or y < 0 or x >= self.width or y >= self.height:
                        continue

                    distance = (dx * dx + dy * dy) ** 0.5

                    bonus = max(
                        0,
                        (radius - distance) / radius,
                    )

                    self.grid[x, y] += amount * 4 * bonus

        np.clip(
            self.grid,
            0.0,
            1.0,
            out=self.grid,
        )

    def consume_resource(
        self,
        x: float,
        y: float,
        amount: float = 0.15,
    ):

        grid_x = int(x / 20)

        grid_y = int(y / 20)

        grid_x = max(
            0,
            min(
                grid_x,
                self.grid.shape[0] - 1,
            ),
        )

        grid_y = max(
            0,
            min(
                grid_y,
                self.grid.shape[1] - 1,
            ),
        )

        available = self.grid[
            grid_x,
            grid_y,
        ]

        consumed = min(
            available,
            amount,
        )

        self.grid[
            grid_x,
            grid_y,
        ] -= consumed

        return consumed

    def update_hotspots(
        self,
        tick_count,
    ):

        if tick_count - self.last_hotspot_shift < self.hotspot_lifetime:
            return

        self.hotspots = []

        for _ in range(8):

            self.hotspots.append(
                (
                    random.randint(0, self.width - 1),
                    random.randint(0, self.height - 1),
                )
            )

        self.last_hotspot_shift = tick_count
