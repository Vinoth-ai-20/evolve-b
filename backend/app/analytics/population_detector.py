from app.analytics.event_tracker import (
    event_tracker,
)


class PopulationDetector:

    def __init__(self):

        self.previous_population = None

    def update(
        self,
        tick,
        population,
    ):

        if self.previous_population is None:

            self.previous_population = population
            return

        if self.previous_population == 0:

            self.previous_population = population
            return

        change = (population - self.previous_population) / self.previous_population

        if change > 0.25:

            event_tracker.add(
                tick,
                "boom",
                f"Population boom (+{int(change*100)}%)",
            )

        elif change < -0.25:

            event_tracker.add(
                tick,
                "collapse",
                f"Population collapse ({int(change*100)}%)",
            )

        self.previous_population = population


population_detector = PopulationDetector()
