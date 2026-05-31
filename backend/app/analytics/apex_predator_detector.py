from app.analytics.event_tracker import (
    event_tracker,
)


class ApexPredatorDetector:

    def __init__(self):

        self.apex_detected = False

    def update(
        self,
        tick,
        organisms,
    ):

        carnivores = [
            o
            for o in organisms
            if o.genome.diet_type == 1
        ]

        if len(carnivores) >= 25:

            if not self.apex_detected:

                event_tracker.add(
                    tick,
                    "apex_predator",
                    "Apex predator lineage emerged",
                )

                self.apex_detected = True

        else:

            self.apex_detected = False


apex_predator_detector = (
    ApexPredatorDetector()
)