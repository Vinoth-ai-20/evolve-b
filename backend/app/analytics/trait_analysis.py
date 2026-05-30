import statistics


def average_traits(
    organisms,
):
    if not organisms:
        return {}

    return {
        "size": statistics.mean(o.genome.size for o in organisms),
        "speed": statistics.mean(o.genome.speed for o in organisms),
        "metabolism": statistics.mean(o.genome.metabolism for o in organisms),
        "lifespan": statistics.mean(o.genome.lifespan for o in organisms),
    }
