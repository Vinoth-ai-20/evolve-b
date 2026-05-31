from fastapi import APIRouter

from app.analytics.species_history import (
    species_history,
)

router = APIRouter()


@router.get("/")
async def cemetery():

    result = []

    for species_id, record in species_history.history.items():

        if not record.get("extinct"):
            continue

        lifespan = record["extinction_tick"] - record["first_seen"]

        result.append(
            {
                "species_id": species_id,
                "first_seen": record["first_seen"],
                "extinction_tick": record["extinction_tick"],
                "peak_population": record["peak_population"],
                "lifespan": lifespan,
            }
        )

    result.sort(
        key=lambda x: x["lifespan"],
        reverse=True,
    )

    return result
