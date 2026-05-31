import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.simulation import router as simulation_router

from app.api.websocket.simulation_socket import (
    router as websocket_router,
)

from app.api.routes.analytics import (
    router as analytics_router,
)

from app.api.routes.species import router as species_router

from app.api.routes.export import router as export_router

from contextlib import asynccontextmanager

from app.simulation.simulation_manager import simulation_manager

from app.api.routes.events import (
    router as events_router,
)

from app.api.routes.intelligence import (
    router as intelligence_router,
)

from app.api.routes.milestones import router as milestones_router

from app.api.routes.cemetery import router as cemetery_router

from app.api.routes.evolution_intelligence import (
    router as evolution_intelligence_router,
)

from app.api.routes.reports import (
    router as reports_router,
)

from app.api.routes.lineage import (
    router as lineage_router,
)

from app.api.routes.predators import (
    router as predators_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting simulation...")

    await simulation_manager.start()

    yield


app = FastAPI(
    title="Evolve-B",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    simulation_router,
    prefix="/api/simulation",
    tags=["simulation"],
)

app.include_router(
    websocket_router,
    prefix="/ws",
    tags=["websocket"],
)

app.include_router(
    analytics_router,
    prefix="/api/analytics",
    tags=["analytics"],
)

app.include_router(
    species_router,
    prefix="/api/species",
    tags=["species"],
)

app.include_router(
    export_router,
    prefix="/api/export",
    tags=["export"],
)

app.include_router(
    events_router,
    prefix="/api/events",
    tags=["events"],
)

app.include_router(
    intelligence_router,
    prefix="/api/intelligence",
    tags=["intelligence"],
)

app.include_router(
    milestones_router,
    prefix="/api/milestones",
    tags=["Milestones"],
)

app.include_router(
    cemetery_router,
    prefix="/api/cemetery",
    tags=["Cemetery"],
)

app.include_router(
    evolution_intelligence_router,
    prefix="/api/evolution-intelligence",
    tags=["Evolution Intelligence"],
)

app.include_router(
    reports_router,
    prefix="/api/reports",
    tags=["Reports"],
)

app.include_router(
    lineage_router,
    prefix="/api/lineage",
    tags=["Lineage"],
)

app.include_router(
    predators_router,
    prefix="/api/predators",
    tags=["Predators"],
)


@app.get("/")
async def root():
    return {"message": "Evolve-B API"}
