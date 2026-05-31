import statistics


def genetic_diversity(
    organisms,
):
    if not organisms:
        return 0.0

    speed_var = statistics.pvariance([o.genome.speed for o in organisms])

    size_var = statistics.pvariance([o.genome.size for o in organisms])

    metabolism_var = statistics.pvariance([o.genome.metabolism for o in organisms])

    return speed_var + size_var + metabolism_var
