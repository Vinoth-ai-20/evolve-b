from collections import deque


class EvolutionPressure:

    def __init__(self):

        self.snapshots = deque(maxlen=100)

    def update(
        self,
        organisms,
    ):

        if not organisms:
            return

        self.snapshots.append(
            {
                "speed": sum(o.genome.speed for o in organisms) / len(organisms),
                "size": sum(o.genome.size for o in organisms) / len(organisms),
                "metabolism": sum(o.genome.metabolism for o in organisms)
                / len(organisms),
                "efficiency": sum(o.genome.energy_efficiency for o in organisms)
                / len(organisms),
                "camouflage": sum(o.genome.camouflage for o in organisms)
                / len(organisms),
                "vision": sum(o.genome.vision_range for o in organisms)
                / len(organisms),
                "temperature": sum(o.genome.temperature_tolerance for o in organisms)
                / len(organisms),
            }
        )

    def analyze(self):

        if len(self.snapshots) < 20:
            return {
                "selected_traits": [],
                "declining_traits": [],
                "dominant_strategy": "Insufficient data",
            }

        old = self.snapshots[0]
        new = self.snapshots[-1]

        selected = []
        declining = []

        trait_names = {
            "speed": "Speed",
            "size": "Body Size",
            "metabolism": "Metabolism",
            "efficiency": "Energy Efficiency",
            "camouflage": "Camouflage",
            "vision": "Vision Range",
            "temperature": "Temperature Tolerance",
        }

        for key in trait_names:

            delta = new[key] - old[key]

            if delta > 0.10:
                selected.append(trait_names[key])

            elif delta < -0.10:
                declining.append(trait_names[key])

        strategy = self.detect_strategy(new)

        return {
            "selected_traits": selected,
            "declining_traits": declining,
            "dominant_strategy": strategy,
        }

    def detect_strategy(
        self,
        traits,
    ):

        if traits["speed"] > 2 and traits["efficiency"] > 1.2:
            return "Fast Efficient Foragers"

        if traits["size"] > 1.5 and traits["metabolism"] > 1.5:
            return "Large Competitive Species"

        if traits["camouflage"] > 0.7:
            return "Stealth Survivors"

        if traits["vision"] > 70:
            return "Long Range Explorers"

        return "Generalist Population"


evolution_pressure = EvolutionPressure()
