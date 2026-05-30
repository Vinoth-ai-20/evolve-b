from app.analytics.species_tracker import (
    species_tracker,
)

from app.genetics.genome import Genome
from app.simulation.organism import Organism


def test_species_tracking():

    organisms = [
        Organism(
            x=0,
            y=0,
            genome=Genome.random(),
        )
        for _ in range(20)
    ]

    species_tracker.update(organisms)

    assert species_tracker.species_count() > 0
