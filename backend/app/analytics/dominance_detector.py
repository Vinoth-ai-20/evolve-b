from app.analytics.event_tracker import (
    event_tracker,
)


class DominanceDetector:

    def __init__(self):

        self.previous_dominant = None

        self.previous_sizes = {}

    def update(
        self,
        tick,
        species_tracker,
    ):

        largest = species_tracker.largest_species()

        if not largest:
            return

        species_key, members = largest

        current_size = len(members)

        old_size = self.previous_sizes.get(
            species_key,
            current_size,
        )

        if old_size > 10 and current_size > old_size * 2:

            event_tracker.add(
                tick,
                "population_boom",
                f"Species {species_key} doubled in size",
            )

        if old_size > 20 and current_size < old_size * 0.5:

            event_tracker.add(
                tick,
                "population_crash",
                f"Species {species_key} collapsed",
            )

        self.previous_sizes[species_key] = current_size

        if self.previous_dominant is None:

            self.previous_dominant = species_key

            return

        if species_key != self.previous_dominant:

            event_tracker.add(
                tick,
                "dominance_shift",
                (f"Species {species_key} " f"overtook " f"{self.previous_dominant}"),
            )

            self.previous_dominant = species_key


dominance_detector = DominanceDetector()
