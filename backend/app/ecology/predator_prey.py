import math

from app.analytics.event_tracker import event_tracker

PREDATOR_RANGE = 25

ENERGY_GAIN_FROM_PREY = 120


def attempt_predation(
    predator,
    nearby,
    tick,
):

    if predator.genome.diet_type == 0:
        return

    for prey in nearby:

        if prey.id == predator.id:
            continue

        if not prey.alive:
            continue

        if prey.genome.diet_type == 1:
            continue

        dx = predator.x - prey.x
        dy = predator.y - prey.y

        distance = math.sqrt(dx * dx + dy * dy)

        if distance <= PREDATOR_RANGE:

            prey.alive = False

            energy_gain = ENERGY_GAIN_FROM_PREY

            if predator.genome.diet_type == 2:
                energy_gain *= 0.6

            predator.energy += energy_gain

            predator.kills += 1

            event_tracker.add(
                tick,
                "predation",
                f"Predator {predator.id[:6]} killed prey {prey.id[:6]}",
            )

            return
