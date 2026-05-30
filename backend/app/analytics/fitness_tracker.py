from collections import deque


class FitnessTracker:

    def __init__(self):

        self.history = deque(maxlen=5000)

    def add(
        self,
        tick,
        fitness,
    ):

        self.history.append(
            {
                "tick": tick,
                "fitness": fitness,
            }
        )


fitness_tracker = FitnessTracker()
