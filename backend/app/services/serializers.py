def serialize_organism(
    organism,
):
    return {
        "id": organism.id,
        "x": organism.x,
        "y": organism.y,
        "energy": organism.energy,
        "age": organism.age,
        "generation": organism.generation,
        "alive": organism.alive,
        "radius": organism.phenotype.radius,
        "color": organism.phenotype.color,
        "speed": organism.phenotype.movement_speed,
        "density": organism.local_density,
        "food_visible": organism.visible_food is not None,
        "fitness": organism.fitness,
        "children": organism.children_count,
        "diet_type": organism.genome.diet_type,
        "kills": organism.kills,
    }


def serialize_environment(
    environment,
):
    return {
        "temperature": environment.temperature,
        "humidity": environment.humidity,
        "sunlight": environment.sunlight,
        "season": getattr(
            environment,
            "season",
            "Spring",
        ),
    }
