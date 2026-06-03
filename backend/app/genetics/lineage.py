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

    def lineage_size(
        self,
        organism_id: str,
    ):

        return len(self.descendants(organism_id))

    def top_lineages(
        self,
        limit: int = 20,
    ):

        lineages = []

        for parent_id, children in self.children.items():

            descendants = self.descendants(parent_id)

            lineages.append(
                {
                    "organism_id": parent_id,
                    "children": len(children),
                    "descendants": len(descendants),
                    "lineage_size": (len(descendants) + 1),
                    "birth_tick": self.birth_tick.get(
                        parent_id,
                        0,
                    ),
                }
            )

        lineages.sort(
            key=lambda x: x["descendants"],
            reverse=True,
        )

        return lineages[:limit]

    def legendary_lineages(
        self,
        min_descendants: int = 100,
    ):

        result = []

        for parent_id in self.children:

            descendant_count = len(self.descendants(parent_id))

            if descendant_count >= min_descendants:

                result.append(
                    {
                        "organism_id": parent_id,
                        "descendants": descendant_count,
                    }
                )

        result.sort(
            key=lambda x: x["descendants"],
            reverse=True,
        )

        return result

    def lineage_tree(
        self,
        organism_id: str,
    ):

        return {
            "id": organism_id,
            "children": [
                self.lineage_tree(child)
                for child in self.children.get(
                    organism_id,
                    [],
                )
            ],
        }

    def roots(self):

        all_children = set(self.parent_map.keys())

        all_parents = set(self.children.keys())

        return list(all_parents - all_children)


lineage_tracker = LineageTracker()
