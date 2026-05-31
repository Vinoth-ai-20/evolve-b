from fastapi import APIRouter

from app.simulation.simulation_manager import (
    simulation_manager,
)

from app.analytics.species_tracker import (
    species_tracker,
)

router = APIRouter()


@router.get("/summary")
async def evolution_summary():

    organisms = simulation_manager.engine.organisms

    population = len(organisms)

    species_count = species_tracker.species_count()

    avg_generation = sum(organism.generation for organism in organisms) / max(
        1,
        population,
    )

    dominant_diet = "Unknown"

    dominant_share = 0

    largest = species_tracker.largest_species()

    if largest:

        _species_key, members = largest

        dominant_diet = species_tracker.dominant_diet(members)

        dominant_share = round(
            species_tracker.population_share(
                members,
                population,
            ),
            1,
        )

    evolution_score = round(
        (avg_generation * 10) + (species_count * 5) + (population / 10)
    )

    if population < 50:

        ecosystem_health = "Critical"

    elif species_count < 3:

        ecosystem_health = "Stressed"

    else:

        ecosystem_health = "Healthy"

    return {
        "population": population,
        "species_count": species_count,
        "average_generation": round(
            avg_generation,
            1,
        ),
        "dominant_diet": dominant_diet,
        "dominant_species_share": dominant_share,
        "evolution_score": evolution_score,
        "ecosystem_health": ecosystem_health,
    }
