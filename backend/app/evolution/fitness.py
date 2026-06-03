def calculate_fitness(organism) -> float:

    age_score = (
        min(
            organism.age / 500,
            1.0,
        )
        * 10
    )

    energy_score = (
        min(
            organism.energy / 200,
            1.0,
        )
        * 10
    )

    reproduction_score = (
        min(
            organism.children_count / 10,
            1.0,
        )
        * 10
    )

    food_score = (
        min(
            organism.food_consumed / 50,
            1.0,
        )
        * 5
    )

    predation_score = (
        min(
            organism.kills / 10,
            1.0,
        )
        * 5
    )

    total = (
        age_score * 0.25
        + energy_score * 0.25
        + reproduction_score * 0.30
        + food_score * 0.10
        + predation_score * 0.10
    )

    return max(
        0,
        total,
    )
