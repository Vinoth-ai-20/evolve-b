from fastapi import APIRouter

from app.genetics.lineage import (
    lineage_tracker,
)

router = APIRouter()


@router.get("/")
async def lineage():

    return lineage_tracker.top_lineages()
