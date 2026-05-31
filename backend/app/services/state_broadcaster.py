from app.services.websocket_manager import websocket_manager
from app.services.serializers import (
    serialize_environment,
    serialize_organism,
)
from app.analytics.species_tracker import (
    species_tracker,
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
    }

    await websocket_manager.broadcast(payload)
