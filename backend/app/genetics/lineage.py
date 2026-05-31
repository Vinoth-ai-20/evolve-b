from collections import defaultdict


class LineageTracker:

    def __init__(self):

        self.parent_map = {}

        self.children = defaultdict(list)

        self.birth_tick = {}

    def register_birth(
        self,
        parent_id: str,
        child_id: str,
        tick: int,
    ):

        self.parent_map[child_id] = parent_id

        self.children[parent_id].append(child_id)

        self.birth_tick[child_id] = tick

    def descendants(
        self,
        organism_id: str,
    ):

        result = []

        stack = [organism_id]

        while stack:

            current = stack.pop()

            children = self.children.get(
                current,
                [],
            )

            result.extend(children)

            stack.extend(children)

        return result

    def top_lineages(
        self,
        limit: int = 20,
    ):

        lineages = []

        for parent_id, children in self.children.items():

            lineages.append(
                {
                    "organism_id": parent_id,
                    "children": len(children),
                    "descendants": len(self.descendants(parent_id)),
                }
            )

        lineages.sort(
            key=lambda x: x["descendants"],
            reverse=True,
        )

        return lineages[:limit]


lineage_tracker = LineageTracker()
