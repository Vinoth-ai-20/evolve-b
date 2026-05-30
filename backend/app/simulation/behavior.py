import math
import random


def move_toward_target(
    organism,
    target_x,
    target_y,
):

    dx = target_x - organism.x
    dy = target_y - organism.y

    distance = math.sqrt(dx * dx + dy * dy)

    if distance < 1:
        return

    speed = organism.genome.speed * 2

    organism.x += (dx / distance) * speed

    organism.y += (dy / distance) * speed


def random_exploration(
    organism,
):

    organism.x += (
        random.uniform(
            -1,
            1,
        )
        * organism.genome.speed
    )

    organism.y += (
        random.uniform(
            -1,
            1,
        )
        * organism.genome.speed
    )
