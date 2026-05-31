from fastapi import APIRouter

from app.analytics.evolution_pressure import (
    evolution_pressure,
)

router = APIRouter()


@router.get("/")
async def intelligence():

    return evolution_pressure.analyze()