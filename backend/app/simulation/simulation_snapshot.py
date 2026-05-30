from app.services.serializers import (
    serialize_environment,
    serialize_organism,
)


def generate_snapshot(engine):
    return {
        "population": len(engine.organisms),
        "environment": serialize_environment(engine.environment),
        "organisms": [serialize_organism(o) for o in engine.organisms],
    }
