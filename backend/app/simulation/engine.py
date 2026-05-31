import asyncio
import random

from app.core.config import settings

from app.environment.environment import (
    Environment,
)

from app.genetics.genome import Genome

from app.simulation.organism import (
    Organism,
)

from app.simulation.reproduction import (
    attempt_reproduction,
)

from app.simulation.spatial_grid import (
    SpatialGrid,
)

from app.simulation.carrying_capacity import (
    carrying_capacity_pressure,
)

from app.analytics.diversity import (
    genetic_diversity,
)

from app.services.state_broadcaster import (
    broadcast_simulation_state,
)

from app.simulation.sensing import (
    sense_nearby_organisms,
    sense_population_density,
    sense_nearest_food,
)
from app.simulation.behavior import (
    move_toward_target,
    random_exploration,
)

from app.simulation.organism import Organism

from app.evolution.fitness import (
    calculate_fitness,
)

from app.analytics.fitness_tracker import (
    fitness_tracker,
)

from app.ecology.predator_prey import (
    attempt_predation,
)

from app.analytics.collectors import (
    collect_metrics,
)


class SimulationEngine:

    def __init__(self):

        self.simulation_speed = 1.0

        self.environment = Environment()

        self.organisms: list[Organism] = []

        self.running = False

        self.tick_count = 0

        self.spatial_grid = SpatialGrid()

        self._create_initial_population()

    def _create_initial_population(self):

        for _ in range(settings.INITIAL_POPULATION):

            self.organisms.append(
                Organism(
                    x=random.uniform(
                        0,
                        settings.WORLD_WIDTH,
                    ),
                    y=random.uniform(
                        0,
                        settings.WORLD_HEIGHT,
                    ),
                    genome=Genome.random(),
                )
            )

    async def run(self):

        self.running = True

        base_tick_duration = 1 / settings.SIMULATION_TICK_RATE

        while self.running:

            self.tick()

            await broadcast_simulation_state(self)

            await asyncio.sleep(
                base_tick_duration / self.simulation_speed
            )  # use division to speed up, multiplication to slow down

    def tick(self):

        self.tick_count += 1

        self.spatial_grid.clear()

        offspring = []

        self.environment.regenerate_resources()

        capacity_multiplier = (
            0.5 + self.environment.humidity + self.environment.sunlight
        )

        population_pressure = carrying_capacity_pressure(
            len(self.organisms),
            capacity_multiplier,
        )

        for organism in self.organisms:

            self.spatial_grid.insert(organism)

            organism.visible_organisms = sense_nearby_organisms(
                organism,
                self.spatial_grid,
            )

            organism.local_density = sense_population_density(
                organism,
                self.spatial_grid,
            )

            organism.visible_food = sense_nearest_food(
                organism,
                self.environment,
            )

            if organism.visible_food:

                move_toward_target(
                    organism,
                    organism.visible_food.x,
                    organism.visible_food.y,
                )

            else:

                random_exploration(
                    organism,
                )

            organism.update()

            organism.fitness = calculate_fitness(organism)

            food = self.environment.resources.consume_resource(
                organism.x,
                organism.y,
            )

            organism.energy += food * organism.genome.energy_efficiency

            organism.food_consumed += food

            biome = self.environment.get_biome_at(
                organism.x,
                organism.y,
            )

            organism.apply_environmental_pressure(
                biome,
                self.environment,
            )

            organism.energy -= population_pressure * 0.05

            attempt_predation(
                organism,
                organism.visible_organisms,
            )

            child = attempt_reproduction(
                organism,
                self.environment,
            )

            if child:
                offspring.append(child)

        self.organisms.extend(offspring)

        print(
            f"Tick={self.tick_count} "
            f"Population={len(self.organisms)} "
            f"Offspring={len(offspring)}"
        )

        self.organisms = [organism for organism in self.organisms if organism.alive]

        if self.tick_count % 10 == 0:

            energies = [o.energy for o in self.organisms]

            print(
                f"AvgEnergy={sum(energies)/len(energies):.2f} "
                f"MaxEnergy={max(energies):.2f}"
            )

        average_fitness = sum(organism.fitness for organism in self.organisms) / max(
            1, len(self.organisms)
        )

        fitness_tracker.add(
            self.tick_count,
            average_fitness,
        )

        collect_metrics(
            self.organisms,
            self.tick_count,
        )

    def pause(self):

        self.running = False
