from collections import deque


class PopulationTracker:
    def __init__(self):
        self.population_history = deque(maxlen=10000)

    def record(self, value: int):
        self.population_history.append(value)


population_tracker = PopulationTracker()
