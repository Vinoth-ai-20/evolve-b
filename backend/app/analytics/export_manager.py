import csv
import json


def export_json(
    snapshot,
    filepath,
):
    with open(
        filepath,
        "w",
        encoding="utf8",
    ) as f:
        json.dump(
            snapshot,
            f,
            indent=2,
        )


def export_csv(
    organisms,
    filepath,
):
    with open(
        filepath,
        "w",
        newline="",
        encoding="utf8",
    ) as f:

        writer = csv.writer(f)

        writer.writerow(
            [
                "id",
                "age",
                "energy",
                "generation",
            ]
        )

        for organism in organisms:
            writer.writerow(
                [
                    organism.id,
                    organism.age,
                    organism.energy,
                    organism.generation,
                ]
            )
