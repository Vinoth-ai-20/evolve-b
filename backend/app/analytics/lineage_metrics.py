from app.genetics.lineage import (
    lineage_tracker,
)


def lineage_count():
    return len(lineage_tracker.children)
