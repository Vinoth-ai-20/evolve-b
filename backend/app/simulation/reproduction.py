import random

from app.genetics.lineage import lineage_tracker
from app.genetics.mutation import mutate_genome
from app.genetics.inheritance import recombine_genomes

from app.simulation.organism import Organism

REPRODUCTION_ENERGY_THRESHOLD = 105
REPRODUCTION_COST = 20


def attempt_reproduction(
    organism,
    mate,
    tick: int = 0,
):
    if mate is None:
        return None

    if organism.energy < REPRODUCTION_ENERGY_THRESHOLD:
        return None

    if mate.energy < REPRODUCTION_ENERGY_THRESHOLD:
        return None

    reproduction_probability = 0.08 * organism.genome.fertility

    if random.random() > reproduction_probability:
        return None

    child_genome = recombine_genomes(
        organism.genome,
        mate.genome,
    )

    child_genome = mutate_genome(child_genome)

    child = Organism(
        x=(organism.x + random.uniform(-10, 10)),
        y=(organism.y + random.uniform(-10, 10)),
        genome=child_genome,
    )

    child.home_x = (organism.home_x + mate.home_x) / 2

    child.home_y = (organism.home_y + mate.home_y) / 2

    child.territory_strength = 0.25 

    child.generation = (
        max(
            organism.generation,
            mate.generation,
        )
        + 1
    )

    organism.energy -= REPRODUCTION_COST
    mate.energy -= REPRODUCTION_COST

    organism.children_count += 1
    mate.children_count += 1

    lineage_tracker.register_birth(
        organism.id,
        child.id,
        tick,
    )

    return child
