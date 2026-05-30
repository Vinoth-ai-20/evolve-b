from collections import defaultdict
from typing import Callable

from app.simulation.events import (
    SimulationEvent,
)


class EventBus:
    def __init__(self):
        self.subscribers = defaultdict(list)

    def subscribe(
        self,
        event_type: str,
        callback: Callable,
    ):
        self.subscribers[event_type].append(callback)

    async def emit(
        self,
        event: SimulationEvent,
    ):
        callbacks = self.subscribers.get(
            event.event_type,
            [],
        )

        for callback in callbacks:
            await callback(event)


event_bus = EventBus()
