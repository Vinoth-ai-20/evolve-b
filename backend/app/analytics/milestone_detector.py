from app.analytics.milestone_tracker import (
    milestone_tracker,
)


class MilestoneDetector:

    def update(
        self,
        tick,
        population,
        species_count,
        average_generation,
        evolution_score,
    ):

        population_targets = [
            100,
            250,
            500,
            1000,
        ]

        for target in population_targets:

            if population >= target:

                milestone_tracker.add(
                    tick,
                    f"population_{target}",
                    f"Population reached {target}",
                )

        species_targets = [
            5,
            10,
            20,
        ]

        for target in species_targets:

            if species_count >= target:

                milestone_tracker.add(
                    tick,
                    f"species_{target}",
                    f"{target} species discovered",
                )

        generation_targets = [
            10,
            25,
            50,
            100,
        ]

        for target in generation_targets:

            if average_generation >= target:

                milestone_tracker.add(
                    tick,
                    f"generation_{target}",
                    f"Generation {target} reached",
                )

        score_targets = [
            100,
            500,
            1000,
        ]

        for target in score_targets:

            if evolution_score >= target:

                milestone_tracker.add(
                    tick,
                    f"score_{target}",
                    f"Evolution score exceeded {target}",
                )


milestone_detector = MilestoneDetector()
