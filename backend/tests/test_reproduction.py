from app.genetics.genome import Genome
from app.simulation.organism import Organism
from app.simulation.reproduction import (
    attempt_reproduction,
)


def test_reproduction():
    organism = Organism(
        x=0,
        y=0,
        genome=Genome.random(),
    )

    organism.energy = 500

    child = attempt_reproduction(organism)

    assert child is None or child.generation == 2
