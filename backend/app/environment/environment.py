import numpy as np

from app.core.config import settings
from app.environment.biome import (
    DESERT,
    RAINFOREST,
    TUNDRA,
    VOLCANIC,
)

from app.environment.resources import ResourceField


class Environment:
    def __init__(self):
        self.width = settings.WORLD_WIDTH
        self.height = settings.WORLD_HEIGHT

        self.temperature = 0.5
        self.humidity = 0.5
        self.sunlight = 0.5

        self.resource_grid = np.random.rand(
            self.width // 20,
            self.height // 20,
        )

        self.resources = ResourceField(self.width // 20, self.height // 20)

    def regenerate_resources(self):
        self.resource_grid += settings.RESOURCE_REGEN_RATE
        np.clip(self.resource_grid, 0.0, 1.0, out=self.resource_grid)

    def get_biome_at(
        self,
        x: float,
        y: float,
    ):
        section = int((x / self.width) * 4)

        biomes = [
            DESERT,
            TUNDRA,
            RAINFOREST,
            VOLCANIC,
        ]

        return biomes[max(0, min(section, 3))]
