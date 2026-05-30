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


@app.get("/")
async def root():
    return {"message": "Evolve-B API"}
