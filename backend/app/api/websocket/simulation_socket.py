import asyncio

from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from app.services.websocket_manager import (
    websocket_manager,
)

router = APIRouter()


@router.websocket("/stream")
async def simulation_stream(
    websocket: WebSocket,
):
    await websocket_manager.connect(websocket)

    try:
        while True:
            await asyncio.sleep(30)

    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
