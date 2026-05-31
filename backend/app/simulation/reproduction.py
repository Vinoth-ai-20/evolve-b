import random

from app.genetics.inheritance import inherit_genome
from app.genetics.lineage import lineage_tracker
from app.genetics.mutation import mutate_genome

from app.simulation.organism import Organism
from app.schemas import environment

REPRODUCTION_ENERGY_THRESHOLD = 105
REPRODUCTION_COST = 20


def attempt_reproduction(
    organism,
    environment=None,
):
    if organism.energy < REPRODUCTION_ENERGY_THRESHOLD:
        return None

    reproduction_probability = 0.05 * organism.genome.fertility

    if environment:

        reproduction_probability *= 0.5 + environment.humidity

        reproduction_probability *= 0.5 + environment.sunlight

    if random.random() > reproduction_probability:
        return None

    child_genome = inherit_genome(organism.genome)
    child_genome = mutate_genome(child_genome)

    child = Organism(
        x=organism.x + random.uniform(-10, 10),
        y=organism.y + random.uniform(-10, 10),
        genome=child_genome,
    )

    child.generation = organism.generation + 1

    organism.energy -= REPRODUCTION_COST
    organism.children_count += 1

    lineage_tracker.register_birth(
        organism.id,
        child.id,
        environment.tick_count if environment else 0,
    )

    return child
