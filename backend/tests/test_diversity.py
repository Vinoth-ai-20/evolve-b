from app.analytics.diversity import (
    genetic_diversity,
)

from app.genetics.genome import Genome
from app.simulation.organism import Organism


def test_diversity():
    organisms = [
        Organism(
            x=0,
            y=0,
            genome=Genome.random(),
        )
        for _ in range(10)
    ]

    value = genetic_diversity(organisms)

    assert value >= 0
