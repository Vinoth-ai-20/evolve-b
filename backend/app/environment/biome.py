from dataclasses import dataclass


@dataclass
class Biome:
    name: str
    temperature_modifier: float
    humidity_modifier: float
    resource_modifier: float
    radiation_modifier: float


DESERT = Biome(
    name="desert",
    temperature_modifier=0.8,
    humidity_modifier=-0.7,
    resource_modifier=-0.5,
    radiation_modifier=0.3,
)

TUNDRA = Biome(
    name="tundra",
    temperature_modifier=-0.8,
    humidity_modifier=0.2,
    resource_modifier=-0.4,
    radiation_modifier=0.1,
)

RAINFOREST = Biome(
    name="rainforest",
    temperature_modifier=0.4,
    humidity_modifier=0.9,
    resource_modifier=0.9,
    radiation_modifier=0.0,
)

VOLCANIC = Biome(
    name="volcanic",
    temperature_modifier=1.0,
    humidity_modifier=-0.4,
    resource_modifier=0.2,
    radiation_modifier=0.9,
)
