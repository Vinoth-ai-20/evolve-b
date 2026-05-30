from app.genetics.genome import Genome


def test_random_genome():
    genome = Genome.random()

    assert genome.size > 0
    assert genome.speed > 0
