from dataclasses import dataclass
from typing import Any
import time
from dataclasses import field


@dataclass
class SimulationEvent:
    event_type: str
    payload: dict[str, Any]
    timestamp: float = field(default_factory=time.time)


EVENT_BIRTH = "birth"
EVENT_DEATH = "death"
EVENT_MUTATION = "mutation"
EVENT_EXTINCTION = "extinction"
EVENT_TICK = "tick"
