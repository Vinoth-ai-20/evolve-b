from dataclasses import dataclass, field
from uuid import uuid4
import random

from app.genetics.genome import Genome
from app.genetics.phenotype import Phenotype

from app.ecology.disease import (
    disease_manager,
)


@dataclass
class Organism:
    x: float
    y: float
    genome: Genome

    id: str = field(default_factory=lambda: str(uuid4()))
    energy: float = 100.0
    age: int = 0
    generation: int = 1
    alive: bool = True
    kills: int = 0
    children_count: int = 0
    fitness: float = 0.0
    food_consumed: float = 0.0

    vx: float = 0.0
    vy: float = 0.0

    phenotype: Phenotype = field(init=False)

    infected: bool = False
    infection_timer: int = 0

    best_food_x: float = 0.0
    best_food_y: float = 0.0
    best_food_amount: float = 0.0

    food_cache_x: float = 0.0
    food_cache_y: float = 0.0
    food_cache_amount: float = 0.0
    food_cache_tick: int = 0

    home_x: float = 0.0
    home_y: float = 0.0
    territory_strength: float = 0.0

    def __post_init__(self):

        self.phenotype = Phenotype.from_genome(self.genome)

        self.visible_organisms = []
        self.visible_food = None
        self.local_density = 0

        self.children_count = 0
        self.fitness = 0.0

        self.home_x = self.x
        self.home_y = self.y

    def update(self):
        if not self.alive:
            return

        self.age += 1

        self.vx += random.uniform(-1, 1) * 0.2
        self.vy += random.uniform(-1, 1) * 0.2

        self.territory_strength *= 0.999

        self.x += self.vx * self.genome.speed
        self.y += self.vy * self.genome.speed

        self.energy -= 0.02 * self.genome.metabolism / self.genome.energy_efficiency

        if self.energy <= 0:
            self.alive = False

        if self.age > self.genome.lifespan:
            self.alive = False

        if self.infected:

            self.energy -= 0.10

            self.infection_timer -= 1

            if self.infection_timer <= 0:

                self.infected = False

        if self.best_food_amount > 0.8:

            self.home_x = self.best_food_x
            self.home_y = self.best_food_y

            self.territory_strength = min(
                1.0,
                self.territory_strength + 0.01,
            )

    def apply_environmental_pressure(
        self,
        biome,
        environment=None,
    ):

        stress = abs(self.genome.temperature_tolerance - biome.temperature_modifier)

        energy_loss = stress * 0.15

        if environment:

            global_temperature_stress = abs(
                self.genome.temperature_tolerance - ((environment.temperature * 2) - 1)
            )

            energy_loss += global_temperature_stress * 0.10

            if environment.humidity < 0.25:
                energy_loss += 0.05

            if environment.sunlight < 0.20:
                energy_loss += 0.03

        self.energy -= energy_loss
