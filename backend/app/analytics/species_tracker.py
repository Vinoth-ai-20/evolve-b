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

            self.species_map[species].append(organism)

    def species_count(self):
        return len(self.species_map)

    def largest_species(self):
        if not self.species_map:
            return None

        return max(self.species_map.items(), key=lambda x: len(x[1]))

    def dominant_diet(
        self,
        organisms,
    ):
        counts = {
            0: 0,
            1: 0,
            2: 0,
        }

        for organism in organisms:
            counts[organism.genome.diet_type] += 1

        dominant = max(
            counts,
            key=counts.get,
        )

        mapping = {
            0: "Herbivore",
            1: "Carnivore",
            2: "Omnivore",
        }

        return mapping[dominant]

    def dominant_traits(
        self,
        organisms,
    ):
        traits = []

        avg_speed = sum(o.genome.speed for o in organisms) / len(organisms)

        avg_size = sum(o.genome.size for o in organisms) / len(organisms)

        avg_metabolism = sum(o.genome.metabolism for o in organisms) / len(organisms)

        if avg_speed > 2.2:
            traits.append("Fast")
        elif avg_speed < 1.0:
            traits.append("Slow")

        if avg_size > 1.5:
            traits.append("Large")
        elif avg_size < 0.8:
            traits.append("Small")

        if avg_metabolism < 0.8:
            traits.append("Efficient")
        elif avg_metabolism > 1.5:
            traits.append("Hungry")

        return traits


species_tracker = SpeciesTracker()
