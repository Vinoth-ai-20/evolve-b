from app.environment.biome import (
    DESERT,
    RAINFOREST,
    TUNDRA,
    VOLCANIC,
)


def calculate_temperature_stress(
    organism,
    biome,
):
    difference = abs(organism.genome.temperature_tolerance - biome.temperature_modifier)

    return difference * 0.08


BIOME_ZONES = [
    DESERT,
    TUNDRA,
    RAINFOREST,
    VOLCANIC,
]
