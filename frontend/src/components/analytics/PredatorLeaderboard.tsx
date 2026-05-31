import { useEffect, useState } from "react";

import axios from "axios";

interface PredatorSpecies {
  species_id: string;
  kills: number;
  population: number;
  avg_energy: number;
}

export default function PredatorLeaderboard() {

  const [predators, setPredators] =
    useState<PredatorSpecies[]>([]);

  useEffect(() => {

    const loadPredators =
      async () => {

        try {

          const response =
            await axios.get<
              PredatorSpecies[]
            >(
              "http://localhost:8000/api/predators/"
            );

          setPredators(
            response.data
          );

        } catch (error) {

          console.error(
            "Failed to load predator leaderboard",
            error
          );

        }
      };

    loadPredators();

    const interval =
      setInterval(
        loadPredators,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  return (
    <div
      className="
      h-80
      overflow-y-auto
      space-y-3
      pr-2
      "
    >

      {predators.length === 0 && (

        <div className="text-sm text-slate-500">
          No successful predators yet.
        </div>

      )}

      {predators.map(
        (
          predator,
          index
        ) => (

          <div
            key={predator.species_id}
            className="
            rounded-lg
            border
            border-slate-800
            bg-slate-900
            p-3
            "
          >

            <div
              className="
              mb-3
              flex
              items-center
              justify-between
              "
            >

              <div
                className="
                flex
                items-center
                gap-2
                "
              >

                <span
                  className="
                  text-lg
                  font-bold
                  text-amber-400
                  "
                >
                  #{index + 1}
                </span>

                <span
                  className="
                  font-semibold
                  text-slate-100
                  "
                >
                  {predator.species_id}
                </span>

              </div>

              <span
                className="
                rounded-full
                bg-red-950
                px-2
                py-1
                text-xs
                text-red-300
                "
              >
                {predator.kills} kills
              </span>

            </div>

            <div
              className="
              grid
              grid-cols-2
              gap-3
              text-sm
              "
            >

              <div>

                <div className="text-slate-500">
                  Population
                </div>

                <div className="font-semibold">
                  {predator.population}
                </div>

              </div>

              <div>

                <div className="text-slate-500">
                  Avg Energy
                </div>

                <div className="font-semibold text-emerald-400">
                  {predator.avg_energy}
                </div>

              </div>

            </div>

          </div>

        )
      )}

    </div>
  );
}