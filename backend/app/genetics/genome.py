from dataclasses import dataclass
import random


@dataclass
class Genome:
    size: float
    speed: float
    metabolism: float
    lifespan: float
    fertility: float
    vision_range: float
    camouflage: float
    mutation_resistance: float
    energy_efficiency: float
    temperature_tolerance: float
    diet_type: int

    @staticmethod
    def random() -> "Genome":
        return Genome(
            size=random.uniform(0.5, 2.0),
            speed=random.uniform(0.5, 3.0),
            metabolism=random.uniform(0.5, 2.0),
            lifespan=random.uniform(200, 1000),
            fertility=random.uniform(0.1, 1.0),
            vision_range=random.uniform(10, 100),
            camouflage=random.uniform(0.0, 1.0),
            mutation_resistance=random.uniform(0.0, 1.0),
            energy_efficiency=random.uniform(0.5, 2.0),
            temperature_tolerance=random.uniform(-1.0, 1.0),
            diet_type=random.randint(0, 2),
        )
