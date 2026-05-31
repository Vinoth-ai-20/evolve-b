from app.analytics.event_tracker import (
    event_tracker,
)


class ExtinctionDetector:

    def __init__(self):

        self.previous_species = set()

    def update(
        self,
        tick,
        current_species,
    ):

        extinct_species = self.previous_species - current_species

        for species in extinct_species:

            event_tracker.add(
                tick,
                "extinction",
                f"Species {species} went extinct",
            )

        self.previous_species = set(current_species)


extinction_detector = ExtinctionDetector()
