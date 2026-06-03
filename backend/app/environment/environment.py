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

        self.resource_regeneration_rate = settings.RESOURCE_REGEN_RATE

        self.resource_grid = np.random.rand(
            self.width // 20,
            self.height // 20,
        )

        self.resources = ResourceField(
            self.width // 20,
            self.height // 20,
        )

    def regenerate_resources(self):

        effective_regen = (
            self.resource_regeneration_rate
            * (0.5 + self.sunlight)
            * (0.5 + self.humidity)
        )

        self.resource_grid += effective_regen

        np.clip(
            self.resource_grid,
            0.0,
            1.0,
            out=self.resource_grid,
        )

        self.resources.regenerate(effective_regen)

    def update_conditions(
        self,
        temperature: float,
        humidity: float,
        sunlight: float,
        resource_regeneration_rate: float,
    ):
        self.temperature = max(0.0, min(1.0, temperature))

        self.humidity = max(0.0, min(1.0, humidity))

        self.sunlight = max(0.0, min(1.0, sunlight))

        self.resource_regeneration_rate = max(
            0.001,
            min(
                1.0,
                resource_regeneration_rate,
            ),
        )

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

        return biomes[
            max(
                0,
                min(section, 3),
            )
        ]

    def update_season(
        self,
        tick_count: int,
    ):

        season_cycle = 4000

        phase = (tick_count % season_cycle) / season_cycle

        import math

        self.temperature = 0.5 + 0.3 * math.sin(phase * 2 * math.pi)

        self.sunlight = 0.5 + 0.3 * math.sin(phase * 2 * math.pi)

        self.humidity = 0.5 + 0.2 * math.cos(phase * 2 * math.pi)

        self.temperature = max(
            0.0,
            min(
                1.0,
                self.temperature,
            ),
        )

        self.sunlight = max(
            0.0,
            min(
                1.0,
                self.sunlight,
            ),
        )

        self.humidity = max(
            0.0,
            min(
                1.0,
                self.humidity,
            ),
        )
