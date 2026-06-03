from fastapi import APIRouter
from pydantic import BaseModel

from app.simulation.simulation_manager import simulation_manager

from app.schemas.environment import (
    EnvironmentUpdateRequest,
)

from app.services.simulation_persistence import (
    save_engine,
    load_engine,
)

from pathlib import Path


class SaveRequest(BaseModel):
    filename: str


class SpeedRequest(BaseModel):
    speed: float


class StatusResponse(BaseModel):
    status: str


class StateResponse(BaseModel):
    population: int
    running: bool
    tick_count: int
    simulation_speed: float
    environment: dict


router = APIRouter()


@router.post("/start", response_model=StatusResponse)
async def start_simulation() -> StatusResponse:
    """Start the simulation"""
    await simulation_manager.start()
    return StatusResponse(status="started")


@router.post("/pause", response_model=StatusResponse)
async def pause_simulation() -> StatusResponse:
    """Pause the simulation"""
    await simulation_manager.pause()
    return StatusResponse(status="paused")


@router.post("/resume", response_model=StatusResponse)
async def resume_simulation() -> StatusResponse:
    """Resume the simulation"""
    await simulation_manager.resume()
    return StatusResponse(status="resumed")


@router.post("/reset", response_model=StatusResponse)
async def reset_simulation() -> StatusResponse:
    """Reset the simulation"""
    simulation_manager.reset()
    await simulation_manager.start()
    return StatusResponse(status="reset")


@router.get("/state", response_model=StateResponse)
async def get_state() -> StateResponse:
    """Get current simulation state"""
    state = simulation_manager.get_state()
    return StateResponse(**state)


@router.post("/speed")
async def set_speed(request: SpeedRequest) -> StatusResponse:
    """Set simulation speed"""
    simulation_manager.engine.simulation_speed = max(0.1, min(request.speed, 20.0))
    return StatusResponse(
        status=f"speed set to {simulation_manager.engine.simulation_speed}x"
    )


@router.post("/environment")
async def update_environment(request: EnvironmentUpdateRequest) -> StatusResponse:

    simulation_manager.engine.environment.update_conditions(
        temperature=request.temperature,
        humidity=request.humidity,
        sunlight=request.sunlight,
        resource_regeneration_rate=request.resource_regeneration_rate,
    )

    return StatusResponse(status="environment updated")


@router.post("/save")
async def save_simulation(
    request: SaveRequest,
):

    save_engine(
        simulation_manager.engine,
        request.filename,
    )

    return {"status": "saved"}


@router.post("/load")
async def load_simulation(
    request: SaveRequest,
):

    load_engine(
        simulation_manager.engine,
        request.filename,
    )

    return {"status": "loaded"}


@router.get("/saves")
async def saves():

    save_dir = Path("saves")

    return [file.stem for file in save_dir.glob("*.json")]
