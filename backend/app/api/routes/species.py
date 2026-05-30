from fastapi import APIRouter
from pydantic import BaseModel

from app.analytics.species_tracker import species_tracker


class SpeciesInfo(BaseModel):
    species_id: str
    count: int
    avg_speed: float
    avg_size: float
    avg_metabolism: float


router = APIRouter()


@router.get("/", response_model=list[SpeciesInfo])
async def get_species() -> list[SpeciesInfo]:
    """Get list of all current species with their statistics"""
    result = []

    for index, (species_key, members) in enumerate(
        species_tracker.species_map.items(),
        start=1,
    ):
        try:
            traits = species_key.replace("(", "").replace(")", "").split(",")
            avg_size = float(traits[0]) if len(traits) > 0 else 0.0
            avg_speed = float(traits[1]) if len(traits) > 1 else 0.0
            avg_metabolism = float(traits[2]) if len(traits) > 2 else 0.0
        except (ValueError, IndexError):
            avg_size = 0.0
            avg_speed = 0.0
            avg_metabolism = 0.0

        result.append(
            SpeciesInfo(
                species_id=f"SP-{index:03d}",
                count=len(members),
                avg_speed=avg_speed,
                avg_size=avg_size,
                avg_metabolism=avg_metabolism,
            )
        )

    return result
