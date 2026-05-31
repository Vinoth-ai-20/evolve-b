from app.analytics.diversity import (
    genetic_diversity,
)

from app.analytics.species_tracker import (
    species_tracker,
)

from app.analytics.history_store import (
    history_store,
)

from app.analytics.evolution_tracker import (
    evolution_tracker,
)

from app.analytics.extinction_detector import (
    extinction_detector,
)

from app.analytics.population_detector import (
    population_detector,
)

from app.analytics.dominance_detector import (
    dominance_detector,
)

from app.analytics.apex_predator_detector import (
    apex_predator_detector,
)

from app.analytics.diet_dominance_detector import (
    diet_dominance_detector,
)

from app.analytics.species_history import (
    species_history,
)

from app.analytics.milestone_detector import (
    milestone_detector,
)

from app.analytics.evolution_pressure import (
    evolution_pressure,
)


def collect_metrics(
    organisms,
    tick_count,
):
    diversity = genetic_diversity(organisms)

    species_tracker.update(organisms)

    evolution_pressure.update(
        organisms,
    )

    species_history.update(
        tick_count,
        species_tracker.species_map,
    )

    species_history.mark_extinct(
        tick_count,
        set(species_tracker.species_map.keys()),
    )

    apex_predator_detector.update(
        tick_count,
        organisms,
    )

    diet_dominance_detector.update(
        tick_count,
        organisms,
    )

    dominance_detector.update(
        tick_count,
        species_tracker,
    )

    population_detector.update(
        tick_count,
        len(organisms),
    )

    extinction_detector.update(
        tick_count,
        species_tracker.species_map.keys(),
    )

    history_store.add(
        tick_count,
        len(organisms),
        diversity,
        species_tracker.species_count(),
    )

    if tick_count % 10 == 0:

        evolution_tracker.add(
            tick_count,
            organisms,
        )

    average_generation = 0

    if organisms:

        average_generation = sum(o.generation for o in organisms) / len(organisms)

    evolution_score = (
        species_tracker.species_count()
        * diversity
        * max(
            average_generation,
            1,
        )
    )

    milestone_detector.update(
        tick_count,
        len(organisms),
        species_tracker.species_count(),
        average_generation,
        evolution_score,
    )
