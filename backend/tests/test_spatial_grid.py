from app.simulation.spatial_grid import (
    SpatialGrid,
)

from app.genetics.genome import Genome
from app.simulation.organism import Organism


def test_spatial_insert():
    grid = SpatialGrid()

    organism = Organism(
        x=100,
        y=100,
        genome=Genome.random(),
    )

    grid.insert(organism)

    nearby = grid.nearby(100, 100)

    assert len(nearby) == 1
