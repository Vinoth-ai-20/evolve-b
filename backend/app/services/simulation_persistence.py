import json
from pathlib import Path
import numpy as np

SAVE_DIR = Path("saves")
SAVE_DIR.mkdir(exist_ok=True)

from app.genetics.genome import Genome

from app.simulation.organism import Organism


def save_engine(engine, filename):

    data = {
        "tick_count": engine.tick_count,
        "simulation_speed": engine.simulation_speed,
        "environment": {
            "temperature": engine.environment.temperature,
            "humidity": engine.environment.humidity,
            "sunlight": engine.environment.sunlight,
            "resource_regeneration_rate": engine.environment.resource_regeneration_rate,
            "resource_grid": engine.environment.resources.grid.tolist(),
            "hotspots": engine.environment.resources.hotspots,
        },
        "organisms": [],
    }

    for organism in engine.organisms:

        data["organisms"].append(
            {
                "id": organism.id,
                "x": organism.x,
                "y": organism.y,
                "energy": organism.energy,
                "age": organism.age,
                "generation": organism.generation,
                "alive": organism.alive,
                "kills": organism.kills,
                "children_count": organism.children_count,
                "infected": organism.infected,
                "infection_timer": organism.infection_timer,
                "genome": organism.genome.__dict__,
                "best_food_x": organism.best_food_x,
                "best_food_y": organism.best_food_y,
                "best_food_amount": organism.best_food_amount,
                "home_x": organism.home_x,
                "home_y": organism.home_y,
                "territory_strength": organism.territory_strength,
            }
        )

    with open(
        SAVE_DIR / f"{filename}.json",
        "w",
    ) as f:
        json.dump(data, f)


def load_engine(engine, filename):

    with open(
        SAVE_DIR / f"{filename}.json",
        "r",
    ) as f:

        data = json.load(f)

    engine.tick_count = data["tick_count"]

    engine.simulation_speed = data["simulation_speed"]

    engine.environment.temperature = data["environment"]["temperature"]

    engine.environment.humidity = data["environment"]["humidity"]

    engine.environment.sunlight = data["environment"]["sunlight"]

    engine.environment.resource_regeneration_rate = data["environment"][
        "resource_regeneration_rate"
    ]

    engine.organisms.clear()

    for saved in data["organisms"]:

        genome = Genome(**saved["genome"])

        organism = Organism(
            x=saved["x"],
            y=saved["y"],
            genome=genome,
        )

        organism.id = saved["id"]
        organism.energy = saved["energy"]
        organism.age = saved["age"]
        organism.generation = saved["generation"]
        organism.alive = saved["alive"]
        organism.kills = saved["kills"]
        organism.children_count = saved["children_count"]
        organism.infected = saved["infected"]
        organism.infection_timer = saved["infection_timer"]
        organism.best_food_x = saved["best_food_x"]
        organism.best_food_y = saved["best_food_y"]
        organism.best_food_amount = saved["best_food_amount"]

        organism.home_x = saved["home_x"]
        organism.home_y = saved["home_y"]
        organism.territory_strength = saved["territory_strength"]
        engine.environment.resources.grid = np.array(
            data["environment"]["resource_grid"]
        )
        engine.environment.resources.hotspots = [
            tuple(h) for h in data["environment"]["hotspots"]
        ]

        engine.organisms.append(organism)
