from fastapi import APIRouter

from app.analytics.evolution_pressure import (
    evolution_pressure,
)

from app.analytics.trait_selection import (
    analyze_trait_selection,
)

router = APIRouter()


@router.get("/")
async def intelligence():

    return {
        **evolution_pressure.analyze(),
        **analyze_trait_selection(),
    }
