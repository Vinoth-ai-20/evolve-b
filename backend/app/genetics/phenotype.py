from dataclasses import dataclass

from app.genetics.genome import Genome


@dataclass
class Phenotype:
    radius: float
    movement_speed: float
    color: tuple[int, int, int]

    @staticmethod
    def from_genome(genome: Genome) -> "Phenotype":

        speed_factor = min(
            1.0,
            genome.speed / 3.0,
        )

        size_factor = min(
            1.0,
            genome.size / 2.0,
        )

        efficiency_factor = min(
            1.0,
            genome.energy_efficiency / 2.0,
        )

        camouflage_factor = max(
            0.0,
            min(
                1.0,
                genome.camouflage,
            ),
        )

        if genome.diet_type == 0:
            # Herbivore
            r = int(30 + speed_factor * 60)

            g = int(180 + efficiency_factor * 75)

            b = int(60 + camouflage_factor * 120)

        elif genome.diet_type == 1:
            # Carnivore
            r = int(180 + speed_factor * 75)

            g = int(40 + camouflage_factor * 60)

            b = int(40 + size_factor * 60)

        else:
            # Omnivore
            r = int(120 + size_factor * 80)

            g = int(80 + efficiency_factor * 80)

            b = int(180 + camouflage_factor * 75)

        return Phenotype(
            radius=genome.size * 4,
            movement_speed=genome.speed,
            color=(
                min(255, r),
                min(255, g),
                min(255, b),
            ),
        )
