from app.services.websocket_manager import websocket_manager
from app.services.serializers import (
    serialize_environment,
    serialize_organism,
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

    payload = {
        "type": "simulation_state",
        "population": len(organisms),
        "tick_count": engine.tick_count,
        "environment": serialize_environment(engine.environment),
        "organisms": [serialize_organism(o) for o in visible_organisms],
        "simulation_speed": engine.simulation_speed,
    }

    await websocket_manager.broadcast(payload)
