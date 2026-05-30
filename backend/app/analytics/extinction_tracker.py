class ExtinctionTracker:
    def __init__(self):
        self.extinct_species = []

    def record(
        self,
        species_id: str,
    ):
        self.extinct_species.append(species_id)


extinction_tracker = ExtinctionTracker()
