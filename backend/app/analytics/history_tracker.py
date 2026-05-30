from collections import deque


class HistoryTracker:

    def __init__(self):

        self.population = deque(maxlen=10000)

        self.diversity = deque(maxlen=10000)

    def add_population(
        self,
        tick: int,
        value: int,
    ):
        self.population.append(
            {
                "tick": tick,
                "value": value,
            }
        )

    def add_diversity(
        self,
        tick: int,
        value: float,
    ):
        self.diversity.append(
            {
                "tick": tick,
                "value": value,
            }
        )

    def get_population(self):
        return list(self.population)

    def get_diversity(self):
        return list(self.diversity)


history_tracker = HistoryTracker()
