import statistics


def genetic_diversity(
    organisms,
):
    if not organisms:
        return 0.0

    speeds = [o.genome.speed for o in organisms]

    return statistics.pvariance(speeds)
