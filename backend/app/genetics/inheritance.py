import random

from app.genetics.genome import Genome


def inherit_genome(parent: Genome) -> Genome:
    """Inherit genome from parent with exact values (before mutation)"""
    return Genome(
        size=parent.size,
        speed=parent.speed,
        metabolism=parent.metabolism,
        lifespan=parent.lifespan,
        fertility=parent.fertility,
        vision_range=parent.vision_range,
        camouflage=parent.camouflage,
        mutation_resistance=parent.mutation_resistance,
        energy_efficiency=parent.energy_efficiency,
        temperature_tolerance=parent.temperature_tolerance,
        diet_type=parent.diet_type,  # Fixed: include diet_type
    )


def recombine_genomes(a: Genome, b: Genome) -> Genome:
    """Recombine genomes from two parents using random allele selection"""
    return Genome(
        size=random.choice([a.size, b.size]),
        speed=random.choice([a.speed, b.speed]),
        metabolism=random.choice([a.metabolism, b.metabolism]),
        lifespan=random.choice([a.lifespan, b.lifespan]),
        fertility=random.choice([a.fertility, b.fertility]),
        vision_range=random.choice([a.vision_range, b.vision_range]),
        camouflage=random.choice([a.camouflage, b.camouflage]),
        mutation_resistance=random.choice(
            [
                a.mutation_resistance,
                b.mutation_resistance,
            ]
        ),
        energy_efficiency=random.choice(
            [
                a.energy_efficiency,
                b.energy_efficiency,
            ]
        ),
        temperature_tolerance=random.choice(
            [
                a.temperature_tolerance,
                b.temperature_tolerance,
            ]
        ),
        diet_type=random.choice([a.diet_type, b.diet_type]),  # Fixed: include diet_type
    )
