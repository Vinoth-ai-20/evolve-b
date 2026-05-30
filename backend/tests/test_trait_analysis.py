from app.analytics.trait_analysis import (
    average_traits,
)

from app.genetics.genome import Genome
from app.simulation.organism import Organism


def test_trait_analysis():

    organisms = [
        Organism(
            x=0,
            y=0,
            genome=Genome.random(),
        )
        for _ in range(10)
    ]

    values = average_traits(organisms)

    assert "speed" in values
