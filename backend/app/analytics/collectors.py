from app.analytics.diversity import (
    genetic_diversity,
)

from app.analytics.species_tracker import (
    species_tracker,
)

from app.analytics.history_store import (
    history_store,
)


def collect_metrics(
    organisms,
):
    diversity = genetic_diversity(organisms)

    species_tracker.update(organisms)

    history_store.add(
        len(organisms),
        diversity,
        species_tracker.species_count(),
    )
