from collections import defaultdict


class SpeciesTracker:
    def __init__(self):
        self.species_map = defaultdict(list)

    def classify(self, organism):
        key = (
            round(organism.genome.size, 1),
            round(organism.genome.speed, 1),
            round(organism.genome.metabolism, 1),
        )

        return str(key)

    def update(self, organisms):
        self.species_map.clear()

        for organism in organisms:
            species = self.classify(organism)

            self.species_map[species].append(organism.id)

    def species_count(self):
        return len(self.species_map)

    def largest_species(self):
        if not self.species_map:
            return None

        return max(self.species_map.items(), key=lambda x: len(x[1]))


species_tracker = SpeciesTracker()
