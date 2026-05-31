from fastapi import APIRouter

from app.analytics.milestone_tracker import (
    milestone_tracker,
)

router = APIRouter()


@router.get("/")
async def milestones():

    return milestone_tracker.recent()
