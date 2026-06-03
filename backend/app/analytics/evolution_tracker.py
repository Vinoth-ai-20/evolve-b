from collections import deque


class EvolutionTracker:

    def __init__(self):

        self.history = deque(maxlen=5000)

    def add(
        self,
        tick: int,
        organisms,
    ):

        if not organisms:
            return

        self.history.append(
            {
                "tick": tick,
                "avg_speed": sum(o.genome.speed for o in organisms) / len(organisms),
                "avg_size": sum(o.genome.size for o in organisms) / len(organisms),
                "avg_metabolism": sum(o.genome.metabolism for o in organisms)
                / len(organisms),
                "avg_lifespan": sum(o.genome.lifespan for o in organisms)
                / len(organisms),
                "avg_generation": sum(o.generation for o in organisms) / len(organisms),
                "avg_vision": sum(o.genome.vision_range for o in organisms)
                / len(organisms),
                "avg_efficiency": sum(o.genome.energy_efficiency for o in organisms)
                / len(organisms),
                "avg_camouflage": sum(o.genome.camouflage for o in organisms)
                / len(organisms),
                "avg_temperature_tolerance": sum(
                    o.genome.temperature_tolerance for o in organisms
                )
                / len(organisms),
            }
        )


evolution_tracker = EvolutionTracker()
