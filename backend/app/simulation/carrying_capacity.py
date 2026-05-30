MAX_POPULATION = 5000


def carrying_capacity_pressure(
    population_size: int,
) -> float:
    ratio = population_size / MAX_POPULATION

    return min(1.0, ratio)
