from app.analytics.history_store import (
    history_store,
)

from app.analytics.evolution_pressure import (
    evolution_pressure,
)

from app.analytics.milestone_tracker import (
    milestone_tracker,
)

from app.analytics.species_tracker import (
    species_tracker,
)


def trend_label(values):

    if len(values) < 2:
        return "Unknown"

    start = values[0]["value"]
    end = values[-1]["value"]

    if end > start * 1.10:
        return "Increasing"

    if end < start * 0.90:
        return "Declining"

    return "Stable"


def generate_report():

    population_trend = trend_label(list(history_store.population))

    diversity_trend = trend_label(list(history_store.diversity))

    species_trend = trend_label(list(history_store.species_count))

    intelligence = evolution_pressure.analyze()

    findings = []

    findings.append(f"Population trend is {population_trend.lower()}.")

    findings.append(f"Species diversity is {diversity_trend.lower()}.")

    findings.append(f"Species count is {species_trend.lower()}.")

    if intelligence["selected_traits"]:

        findings.append(
            "Traits under positive selection: "
            + ", ".join(intelligence["selected_traits"])
        )

    if intelligence["declining_traits"]:

        findings.append(
            "Declining traits: " + ", ".join(intelligence["declining_traits"])
        )

    findings.append(f"Dominant strategy: {intelligence['dominant_strategy']}.")

    return {
        "population_trend": population_trend,
        "diversity_trend": diversity_trend,
        "species_trend": species_trend,
        "dominant_strategy": intelligence["dominant_strategy"],
        "findings": findings,
        "recent_milestones": milestone_tracker.recent(5),
    }
