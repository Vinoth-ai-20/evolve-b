BASE_MAX_POPULATION = 5000


def carrying_capacity_pressure(
    population_size: int,
    multiplier: float = 1.0,
) -> float:

    effective_capacity = BASE_MAX_POPULATION * multiplier

    ratio = population_size / effective_capacity

    return min(
        1.0,
        ratio,
    )
