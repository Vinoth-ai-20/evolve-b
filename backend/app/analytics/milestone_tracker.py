from collections import deque


class MilestoneTracker:

    def __init__(self):

        self.milestones = deque(maxlen=200)

        self.achieved = set()

    def add(
        self,
        tick: int,
        key: str,
        message: str,
    ):

        if key in self.achieved:
            return

        self.achieved.add(key)

        self.milestones.appendleft(
            {
                "tick": tick,
                "message": message,
            }
        )

    def recent(
        self,
        limit: int = 50,
    ):
        return list(self.milestones)[:limit]


milestone_tracker = MilestoneTracker()
