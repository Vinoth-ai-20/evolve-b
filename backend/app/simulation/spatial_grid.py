from collections import defaultdict


class SpatialGrid:
    def __init__(
        self,
        cell_size: int = 50,
    ):
        self.cell_size = cell_size
        self.grid = defaultdict(list)

    def clear(self):
        self.grid.clear()

    def _cell(self, x, y):
        return (
            int(x // self.cell_size),
            int(y // self.cell_size),
        )

    def insert(self, organism):
        cell = self._cell(
            organism.x,
            organism.y,
        )

        self.grid[cell].append(organism)

    def nearby(
        self,
        x,
        y,
    ):
        cx, cy = self._cell(x, y)

        nearby_organisms = []

        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                nearby_organisms.extend(
                    self.grid.get(
                        (cx + dx, cy + dy),
                        [],
                    )
                )

        return nearby_organisms