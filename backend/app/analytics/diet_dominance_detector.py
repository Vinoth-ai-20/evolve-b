from app.analytics.event_tracker import (
    event_tracker,
)


class DietDominanceDetector:

    def __init__(self):

        self.previous = None

    def update(
        self,
        tick,
        organisms,
    ):

        herbivores = 0
        carnivores = 0
        omnivores = 0

        for organism in organisms:

            diet = organism.genome.diet_type

            if diet == 0:
                herbivores += 1

            elif diet == 1:
                carnivores += 1

            else:
                omnivores += 1

        dominant = max(
            {
                "Herbivore": herbivores,
                "Carnivore": carnivores,
                "Omnivore": omnivores,
            },
            key=lambda x: {
                "Herbivore": herbivores,
                "Carnivore": carnivores,
                "Omnivore": omnivores,
            }[x],
        )

        if self.previous is None:

            self.previous = dominant
            return

        if dominant != self.previous:

            event_tracker.add(
                tick,
                "diet_shift",
                f"{dominant}s became dominant",
            )

            self.previous = dominant


diet_dominance_detector = DietDominanceDetector()
