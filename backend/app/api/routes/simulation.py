from fastapi import APIRouter
from pydantic import BaseModel

from app.simulation.simulation_manager import simulation_manager


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
