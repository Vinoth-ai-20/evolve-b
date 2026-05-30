import asyncio

from app.simulation.engine import SimulationEngine


class SimulationManager:
    def __init__(self):
        self.engine = SimulationEngine()
        self.task: asyncio.Task | None = None

    async def start(self) -> None:
        if not self.task or self.task.done():
            self.task = asyncio.create_task(self.engine.run())

    async def pause(self) -> None:
        self.engine.pause()
        # Give the engine time to finish current tick
        await asyncio.sleep(0.1)

    async def resume(self) -> None:
        await self.start()

    def reset(self) -> None:
        if self.task:
            self.task.cancel()
        self.engine = SimulationEngine()
        self.task = None

    def get_state(self) -> dict:
        return {
            "population": len(self.engine.organisms),
            "running": self.engine.running,
            "tick_count": self.engine.tick_count,
            "simulation_speed": self.engine.simulation_speed,
            "environment": {
                "temperature": self.engine.environment.temperature,
                "humidity": self.engine.environment.humidity,
            },
        }


simulation_manager = SimulationManager()
