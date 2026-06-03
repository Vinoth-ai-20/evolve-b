import random
from copy import deepcopy

from app.genetics.genome import Genome

MUTATION_RATE = 0.03
MUTATION_MAGNITUDE = 0.08
DIET_MUTATION_RATE = 0.02  # Lower rate for diet changes


def mutate_value(value: float) -> float:
    """Mutate a numeric trait by a small random amount"""
    mutation = random.uniform(
        -MUTATION_MAGNITUDE,
        MUTATION_MAGNITUDE,
    )
    # Clamp to reasonable bounds
    return max(0.01, value + mutation)


def mutate_genome(genome: Genome) -> Genome:
    """Apply mutations to a genome based on mutation rates"""
    mutated = deepcopy(genome)

    for field_name in mutated.__dataclass_fields__:
        # Skip diet_type - handle separately
        if field_name == "diet_type":
            continue

        effective_rate = MUTATION_RATE * (1 - genome.mutation_resistance)

        if random.random() < effective_rate:
            current = getattr(mutated, field_name)

            if isinstance(current, float):
                setattr(
                    mutated,
                    field_name,
                    mutate_value(current),
                )

    # Mutate diet_type with much lower probability
    if random.random() < DIET_MUTATION_RATE:
        mutated.diet_type = random.randint(0, 2)

    return mutated
