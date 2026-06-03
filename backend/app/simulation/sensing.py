from typing import Optional

from app.simulation.organism import Organism


class SensedFood:
    def __init__(
        self,
        x: float,
        y: float,
        amount: float,
    ):
        self.x = x
        self.y = y
        self.amount = amount


def sense_nearby_organisms(
    organism: Organism,
    spatial_grid,
):
    nearby = spatial_grid.nearby(
        organism.x,
        organism.y,
    )

    visible = []

    vision_distance = organism.genome.vision_range * 50

    if organism.genome.diet_type == 1:
        vision_distance *= 1.20

    for other in nearby:

        if other.id == organism.id:
            continue

        dx = other.x - organism.x
        dy = other.y - organism.y

        distance_sq = dx * dx + dy * dy

        if distance_sq <= vision_distance * vision_distance:
            visible.append(other)

    return visible


def sense_population_density(
    organism: Organism,
    spatial_grid,
):
    return len(
        sense_nearby_organisms(
            organism,
            spatial_grid,
        )
    )


def sense_nearest_food(
    organism,
    environment,
) -> Optional[SensedFood]:

    search_radius = int(organism.genome.vision_range * 3)

    resource_grid = environment.resources.grid

    grid_x = int(organism.x / 20)

    grid_y = int(organism.y / 20)

    best_food = None
    best_amount = 0

    width = resource_grid.shape[0]

    height = resource_grid.shape[1]

    for dx in range(
        -search_radius,
        search_radius + 1,
    ):

        for dy in range(
            -search_radius,
            search_radius + 1,
        ):

            x = grid_x + dx
            y = grid_y + dy

            if x < 0 or y < 0 or x >= width or y >= height:
                continue

            amount = resource_grid[x][y]

            if amount > best_amount:

                best_amount = amount

                best_food = SensedFood(
                    x=x * 20,
                    y=y * 20,
                    amount=amount,
                )

    return best_food


def nearest_prey(organism):

    best_prey = None

    best_score = float("inf")

    for other in organism.visible_organisms:

        if other.id == organism.id:
            continue

        if other.genome.diet_type == 1:
            continue

        dx = other.x - organism.x
        dy = other.y - organism.y

        distance = (dx * dx + dy * dy) ** 0.5

        score = distance

        score -= other.age * 0.05

        score -= other.energy * 0.02

        if other.infected:
            score *= 0.5

        if score < best_score:

            best_score = score

            best_prey = other

    return best_prey


def nearest_predator(organism):

    predator = None
    best_distance = float("inf")

    for other in organism.visible_organisms:

        if other.genome.diet_type != 1:
            continue

        dx = other.x - organism.x
        dy = other.y - organism.y

        distance = dx * dx + dy * dy

        if distance < best_distance:
            best_distance = distance
            predator = other

    return predator


def find_mate(organism):

    best_mate = None

    best_energy = -1

    for other in organism.visible_organisms:

        if other.id == organism.id:
            continue

        if not other.alive:
            continue

        if other.energy < 100:
            continue

        if other.genome.diet_type != organism.genome.diet_type:
            continue

        if other.energy > best_energy:

            best_energy = other.energy

            best_mate = other

    return best_mate
