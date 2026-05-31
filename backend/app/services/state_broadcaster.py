from app.services.websocket_manager import websocket_manager
from app.services.serializers import (
    serialize_environment,
    serialize_organism,
)
from app.analytics.species_tracker import (
    species_tracker,
)

from app.analytics.diversity import (
    genetic_diversity,
)


async def broadcast_simulation_state(engine):
    """Broadcast simulation state to all connected WebSocket clients"""

    # Only send a subset of organisms to reduce payload
    # Send most active/relevant organisms
    organisms = engine.organisms

    # Prioritize by energy (most healthy first)
    sorted_organisms = sorted(organisms, key=lambda o: o.energy, reverse=True)

    # Take top 300 organisms (this is more reasonable than 500)
    visible_organisms = sorted_organisms[:300]

    # Calculate trophic levels
    herbivores = 0
    carnivores = 0
    omnivores = 0

    for organism in organisms:

        diet = organism.genome.diet_type

        if diet == 0:
            herbivores += 1

        elif diet == 1:
            carnivores += 1

        else:
            omnivores += 1

    # Dominant species
    dominant_species = None

    largest = species_tracker.largest_species()

    if largest:

        species_key, members = largest

        dominant_species = {
            "population": len(members),
            "share": round(
                species_tracker.population_share(
                    members,
                    len(organisms),
                ),
                1,
            ),
            "diet": species_tracker.dominant_diet(
                members,
            ),
            "traits": species_tracker.dominant_traits(
                members,
            ),
            "average_energy": round(
                species_tracker.average_energy(
                    members,
                ),
                1,
            ),
            "average_age": round(
                species_tracker.average_age(
                    members,
                ),
                1,
            ),
            "max_generation": species_tracker.max_generation(
                members,
            ),
        }

    # Evolution score
    diversity = genetic_diversity(organisms)

    average_generation = 0

    if organisms:

        average_generation = round(
            sum(organism.generation for organism in organisms) / len(organisms),
            1,
        )

    if len(organisms) < 50:
        ecosystem_health = "Critical"

    elif species_tracker.species_count() < 3:
        ecosystem_health = "Stressed"

    else:
        ecosystem_health = "Healthy"

    if not organisms:

        evolution_score = 0

    else:

        average_generation = sum(organism.generation for organism in organisms) / len(
            organisms
        )

        evolution_score = int(
            species_tracker.species_count() * diversity * average_generation
        )

    payload = {
        "type": "simulation_state",
        "population": len(organisms),
        "tick_count": engine.tick_count,
        "environment": serialize_environment(engine.environment),
        "organisms": [serialize_organism(o) for o in visible_organisms],
        "simulation_speed": engine.simulation_speed,
        "world_width": engine.environment.width,
        "world_height": engine.environment.height,
        "species_count": species_tracker.species_count(),
        "trophic_levels": {
            "herbivore": herbivores,
            "carnivore": carnivores,
            "omnivore": omnivores,
        },
        "dominant_species": dominant_species,
        "evolution_score": evolution_score,
        "resource_grid": engine.environment.resources.grid[::4, ::4].tolist(),
        "diversity": round(
            diversity,
            4,
        ),
        "average_generation": average_generation,
        "ecosystem_health": ecosystem_health,
    }

    await websocket_manager.broadcast(payload)
