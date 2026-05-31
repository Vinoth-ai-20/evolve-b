# backend/app/api/routes/predators.py

from fastapi import APIRouter

from app.analytics.species_tracker import species_tracker

router = APIRouter()


@router.get("/")
async def predators():

    results = []

    for index, (_, members) in enumerate(
        species_tracker.species_map.items(),
        start=1,
    ):

        kills = sum(organism.kills for organism in members)

        if kills == 0:
            continue

        results.append(
            {
                "species_id": f"SP-{index:03d}",
                "kills": kills,
                "population": len(members),
                "avg_energy": round(
                    species_tracker.average_energy(members),
                    1,
                ),
            }
        )

    results.sort(
        key=lambda x: x["kills"],
        reverse=True,
    )

    return results[:20]
