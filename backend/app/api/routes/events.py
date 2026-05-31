from fastapi import APIRouter

from app.analytics.event_tracker import (
    event_tracker,
)

router = APIRouter()


@router.get("/")
async def get_events():

    return event_tracker.recent()