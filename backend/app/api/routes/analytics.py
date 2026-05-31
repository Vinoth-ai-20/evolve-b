from fastapi import APIRouter
from pydantic import BaseModel

from app.simulation.simulation_manager import simulation_manager
from app.analytics.species_tracker import species_tracker
from app.analytics.trait_analysis import average_traits
from app.analytics.diversity import genetic_diversity
from app.analytics.history_tracker import history_tracker
from app.analytics.fitness_tracker import fitness_tracker

from app.analytics.evolution_tracker import (
    evolution_tracker,
)


class HistoryPoint(BaseModel):
    tick: int
    value: float


class FitnessPoint(BaseModel):
    tick: int
    fitness: float


class AnalyticsStats(BaseModel):
    population: int
    diversity: float


router = APIRouter()


@router.get("/stats", response_model=AnalyticsStats)
async def stats() -> AnalyticsStats:
    """Get current simulation statistics"""
    organisms = simulation_manager.engine.organisms
    return AnalyticsStats(
        population=len(organisms),
        diversity=genetic_diversity(organisms),
    )


@router.get("/history")
async def population_history() -> dict:
    """Get population and diversity history"""
    return {
        "population": history_tracker.get_population(),
        "diversity": history_tracker.get_diversity(),
    }


@router.get("/traits")
async def traits() -> dict:
    """Get average trait values across population"""
    organisms = simulation_manager.engine.organisms
    return average_traits(organisms)


@router.get("/fitness", response_model=list[FitnessPoint])
async def fitness_history() -> list[FitnessPoint]:
    """Get fitness history over time"""
    return [
        FitnessPoint(tick=point["tick"], fitness=point["fitness"])
        for point in fitness_tracker.history
    ]


@router.get("/evolution")
async def evolution_history():
    return list(evolution_tracker.history)


@router.get("/diversity")
async def diversity_history():
    return history_tracker.get_diversity()
