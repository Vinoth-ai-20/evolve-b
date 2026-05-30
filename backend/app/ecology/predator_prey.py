import math

PREDATOR_RANGE = 25

ENERGY_GAIN_FROM_PREY = 80


def attempt_predation(
    predator,
    nearby,
):

    if predator.genome.diet_type != 2:
        return

    for prey in nearby:

        if prey.id == predator.id:
            continue

        if not prey.alive:
            continue

        if prey.genome.diet_type == 2:
            continue

        dx = predator.x - prey.x
        dy = predator.y - prey.y

        distance = math.sqrt(dx * dx + dy * dy)

        if distance <= PREDATOR_RANGE:

            prey.alive = False

            predator.energy += ENERGY_GAIN_FROM_PREY

            return
