def calculate_fitness(organism) -> float:
    """
    Calculate fitness based on:
    1. Survival time (age)
    2. Energy reserves (health/resources)
    3. Reproductive success (offspring)
    4. Environmental adaptation
    """
    # Age: accumulated time surviving
    age_score = min(organism.age / 500, 1.0) * 10

    # Energy: health and resources
    energy_score = min(organism.energy / 200, 1.0) * 10

    # Reproduction: fitness passing capability
    reproduction_score = min(organism.children_count / 10, 1.0) * 10

    # Environmental tolerance: genetic adaptation to current conditions
    # Higher score if organism's traits are suited to environment
    adaptation_score = max(0, (1.0 - abs(organism.local_density - 0.5)) * 5)

    # Weighted total fitness
    total = (
        age_score * 0.25
        + energy_score * 0.25
        + reproduction_score * 0.35
        + adaptation_score * 0.15
    )

    return max(0, total)
