from dataclasses import dataclass, field
from uuid import uuid4
import random

from app.genetics.genome import Genome
from app.genetics.phenotype import Phenotype


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
    children_count: int = 0
    fitness: float = 0.0
    food_consumed: float = 0.0

    vx: float = 0.0
    vy: float = 0.0

    phenotype: Phenotype = field(init=False)

    def __post_init__(self):

        self.phenotype = Phenotype.from_genome(self.genome)

        self.visible_organisms = []
        self.visible_food = None
        self.local_density = 0

        self.children_count = 0
        self.fitness = 0.0

    def update(self):
        if not self.alive:
            return

        self.age += 1

        self.vx += random.uniform(-1, 1) * 0.2
        self.vy += random.uniform(-1, 1) * 0.2

        self.x += self.vx * self.genome.speed
        self.y += self.vy * self.genome.speed

        self.energy -= 0.02 * self.genome.metabolism / self.genome.energy_efficiency

        if self.energy <= 0:
            self.alive = False

        if self.age > self.genome.lifespan:
            self.alive = False

    def apply_environmental_pressure(
        self,
        biome,
    ):
        stress = abs(self.genome.temperature_tolerance - biome.temperature_modifier)

        self.energy -= stress * 0.15
