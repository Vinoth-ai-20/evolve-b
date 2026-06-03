from fastapi import APIRouter

from app.genetics.lineage import (
    lineage_tracker,
)

router = APIRouter()


@router.get("/")
async def lineage():

    return {
        "top_lineages": lineage_tracker.top_lineages(),
        "legendary_lineages": lineage_tracker.legendary_lineages(),
    }


@router.get("/tree")
async def tree():

    roots = lineage_tracker.roots()

    return [lineage_tracker.lineage_tree(root) for root in roots[:20]]
