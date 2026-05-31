from collections import deque


class EventTracker:

    def __init__(self):

        self.events = deque(maxlen=200)

    def add(
        self,
        tick: int,
        event_type: str,
        message: str,
    ):
        self.events.appendleft(
            {
                "tick": tick,
                "type": event_type,
                "message": message,
            }
        )

    def recent(
        self,
        limit: int = 25,
    ):
        return list(self.events)[:limit]


event_tracker = EventTracker()
