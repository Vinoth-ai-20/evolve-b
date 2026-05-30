from collections import deque


class HistoryStore:
    def __init__(self):
        self.population = deque(maxlen=50000)

        self.diversity = deque(maxlen=50000)

        self.species_count = deque(maxlen=50000)

    def add(
        self,
        population,
        diversity,
        species_count,
    ):
        self.population.append(population)

        self.diversity.append(diversity)

        self.species_count.append(species_count)


history_store = HistoryStore()
