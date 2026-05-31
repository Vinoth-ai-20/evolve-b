class SpeciesHistory:

    def __init__(self):

        self.history = {}

    def update(
        self,
        tick,
        species_map,
    ):

        for species_id, members in species_map.items():

            count = len(members)

            if species_id not in self.history:

                self.history[species_id] = {
                    "first_seen": tick,
                    "last_seen": tick,
                    "peak_population": count,
                    "extinct": False,
                }

            record = self.history[species_id]

            record["last_seen"] = tick

            record["peak_population"] = max(
                record["peak_population"],
                count,
            )

    def mark_extinct(
        self,
        tick,
        current_species,
    ):

        for species_id, record in self.history.items():

            if species_id not in current_species and not record["extinct"]:

                record["extinct"] = True

                record["extinction_tick"] = tick


species_history = SpeciesHistory()
