from collections import deque


class HistoryStore:

    def __init__(self):

        self.population = deque(maxlen=50000)

        self.diversity = deque(maxlen=50000)

        self.species_count = deque(maxlen=50000)

    def add(
        self,
        tick,
        population,
        diversity,
        species_count,
    ):

        self.population.append(
            {
                "tick": tick,
                "value": population,
            }
        )

        self.diversity.append(
            {
                "tick": tick,
                "value": diversity,
            }
        )

        self.species_count.append(
            {
                "tick": tick,
                "value": species_count,
            }
        )


history_store = HistoryStore()
