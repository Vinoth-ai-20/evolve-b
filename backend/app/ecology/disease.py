import random

from app.analytics.event_tracker import (
    event_tracker,
)


class DiseaseManager:

    def __init__(self):

        self.active_outbreak = False

        self.peak_infected = 0

        self.total_outbreaks = 0

    def spread(
        self,
        organism,
        tick,
    ):

        if not organism.infected:
            return

        for other in organism.visible_organisms:

            if other.id == organism.id:
                continue

            if other.infected:
                continue

            infection_chance = 0.03

            if organism.local_density > 20:
                infection_chance *= 3

            if random.random() < infection_chance:

                other.infected = True

                other.infection_timer = 300

    def update(
        self,
        organisms,
        tick,
    ):

        infected = sum(1 for o in organisms if o.infected)

        self.peak_infected = max(
            self.peak_infected,
            infected,
        )

        if infected > 50 and not self.active_outbreak:

            self.active_outbreak = True

            self.total_outbreaks += 1

            event_tracker.add(
                tick,
                "epidemic",
                "Disease outbreak detected",
            )

        elif infected < 10 and self.active_outbreak:

            self.active_outbreak = False

            event_tracker.add(
                tick,
                "epidemic",
                "Disease outbreak ended",
            )

    def seed_random_infections(
        self,
        organisms,
        tick,
        count=5,
    ):

        if len(organisms) < count:
            return

        candidates = random.sample(
            organisms,
            count,
        )

        for organism in candidates:

            organism.infected = True

            organism.infection_timer = 300

        event_tracker.add(
            tick,
            "epidemic",
            f"{count} organisms infected",
        )


disease_manager = DiseaseManager()
