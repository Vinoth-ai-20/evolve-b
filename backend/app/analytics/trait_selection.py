from app.analytics.evolution_tracker import (
    evolution_tracker,
)


def analyze_trait_selection():

    history = list(evolution_tracker.history)

    if len(history) < 20:
        return {
            "selected": [],
            "declining": [],
        }

    first = history[0]
    last = history[-1]

    changes = {
        "Speed": last["avg_speed"] - first["avg_speed"],
        "Size": last["avg_size"] - first["avg_size"],
        "Metabolism": last["avg_metabolism"] - first["avg_metabolism"],
        "Vision": last["avg_vision"] - first["avg_vision"],
        "Efficiency": last["avg_efficiency"] - first["avg_efficiency"],
        "Camouflage": last["avg_camouflage"] - first["avg_camouflage"],
    }

    selected = sorted(
        changes.items(),
        key=lambda x: x[1],
        reverse=True,
    )[:3]

    declining = sorted(
        changes.items(),
        key=lambda x: x[1],
    )[:3]

    return {
        "selected": selected,
        "declining": declining,
    }
