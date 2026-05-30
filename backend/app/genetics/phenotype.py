from dataclasses import dataclass
from app.genetics.genome import Genome


@dataclass
class Phenotype:
    radius: float
    movement_speed: float
    color: tuple[int, int, int]

    @staticmethod
    def from_genome(genome: Genome) -> "Phenotype":
        brightness = int(255 * genome.camouflage)

        return Phenotype(
            radius=genome.size * 4,
            movement_speed=genome.speed,
            color=(brightness, 255 - brightness, 120),
        )
