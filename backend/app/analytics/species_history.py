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

                record["survival_duration"] = tick - record["first_seen"]

    def survival_duration(
        self,
        species_id,
        current_tick,
    ):

        record = self.history.get(species_id)

        if not record:
            return 0

        if record["extinct"]:

            return record.get(
                "survival_duration",
                0,
            )

        return current_tick - record["first_seen"]

    def longest_survivors(
        self,
        current_tick,
        limit=10,
    ):

        species = []

        for species_id in self.history:

            species.append(
                {
                    "species": species_id,
                    "duration": self.survival_duration(
                        species_id,
                        current_tick,
                    ),
                }
            )

        species.sort(
            key=lambda x: x["duration"],
            reverse=True,
        )

        return species[:limit]

    def most_successful(
        self,
        limit=10,
    ):

        species = []

        for species_id, record in self.history.items():

            species.append(
                {
                    "species": species_id,
                    "peak_population": record["peak_population"],
                }
            )

        species.sort(
            key=lambda x: x["peak_population"],
            reverse=True,
        )

        return species[:limit]

    def extinct_species(
        self,
        limit=50,
    ):

        extinct = []

        for species_id, record in self.history.items():

            if record["extinct"]:

                extinct.append(
                    {
                        "species": species_id,
                        "first_seen": record["first_seen"],
                        "extinction_tick": record.get(
                            "extinction_tick",
                            0,
                        ),
                        "peak_population": record["peak_population"],
                        "survival_duration": record.get(
                            "survival_duration",
                            0,
                        ),
                    }
                )

        extinct.sort(
            key=lambda x: x["extinction_tick"],
            reverse=True,
        )

        return extinct[:limit]


species_history = SpeciesHistory()
