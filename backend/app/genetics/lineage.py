from collections import defaultdict


class LineageTracker:
    def __init__(self):
        self.parent_map = {}
        self.children = defaultdict(list)

    def register_birth(
        self,
        parent_id: str,
        child_id: str,
    ):
        self.parent_map[child_id] = parent_id
        self.children[parent_id].append(child_id)


lineage_tracker = LineageTracker()
