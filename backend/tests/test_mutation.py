from app.genetics.genome import Genome
from app.genetics.mutation import mutate_genome


def test_mutation():
    genome = Genome.random()

    mutated = mutate_genome(genome)

    assert mutated is not None
