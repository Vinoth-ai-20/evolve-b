from fastapi import APIRouter
from fastapi.responses import FileResponse, StreamingResponse
import io
import csv

from app.simulation.simulation_manager import simulation_manager

router = APIRouter()


@router.get("/csv")
async def export_population_csv():
    """Export current population data as CSV"""
    organisms = simulation_manager.engine.organisms

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow(
        [
            "id",
            "age",
            "energy",
            "generation",
            "fitness",
            "x",
            "y",
            "speed",
            "size",
            "diet_type",
        ]
    )

    # Write organism data
    for organism in organisms:
        writer.writerow(
            [
                organism.id,
                organism.age,
                f"{organism.energy:.2f}",
                organism.generation,
                f"{organism.fitness:.2f}",
                f"{organism.x:.2f}",
                f"{organism.y:.2f}",
                f"{organism.phenotype.movement_speed:.2f}",
                f"{organism.phenotype.radius:.2f}",
                ["herbivore", "carnivore", "omnivore"][organism.genome.diet_type],
            ]
        )

    # Return as file download
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=population.csv"},
    )


@router.get("/json")
async def export_population_json():
    """Export current simulation state as JSON"""
    import json
    from app.services.serializers import serialize_organism, serialize_environment

    engine = simulation_manager.engine
    data = {
        "tick": engine.tick_count,
        "population": len(engine.organisms),
        "speed": engine.simulation_speed,
        "environment": serialize_environment(engine.environment),
        "organisms": [serialize_organism(o) for o in engine.organisms[:500]],
    }

    output = io.StringIO()
    json.dump(data, output, indent=2)
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=simulation_state.json"},
    )
