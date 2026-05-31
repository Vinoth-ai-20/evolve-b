from app.analytics.event_tracker import (
    event_tracker,
)


class DominanceDetector:

    def __init__(self):

        self.previous_dominant = None

    def update(
        self,
        tick,
        species_tracker,
    ):

        largest = species_tracker.largest_species()

        if not largest:
            return

        species_key, members = largest

        if self.previous_dominant is None:

            self.previous_dominant = species_key

            return

        if species_key != self.previous_dominant:

            event_tracker.add(
                tick,
                "dominance_shift",
                "A new dominant species emerged",
            )

            self.previous_dominant = species_key


dominance_detector = DominanceDetector()
