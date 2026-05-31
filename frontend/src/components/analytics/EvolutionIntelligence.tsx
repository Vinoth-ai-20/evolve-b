import { useEffect, useState } from "react";
import axios from "axios";

interface Intelligence {
  selected_traits: string[];
  declining_traits: string[];
  dominant_strategy: string;
}

export default function EvolutionIntelligence() {

  const [data, setData] =
    useState<Intelligence | null>(
      null
    );

  useEffect(() => {

    const load =
      async () => {

        try {

          const response =
            await axios.get<Intelligence>(
              "http://localhost:8000/api/evolution-intelligence/"
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );

        }
      };

    load();

    const interval =
      setInterval(
        load,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  if (!data) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
      space-y-4
      text-sm
      "
    >

      <div>

        <div className="mb-2 font-semibold text-cyan-400">
          Dominant Strategy
        </div>

        <div className="rounded-lg bg-slate-900 p-3">
          {data.dominant_strategy}
        </div>

      </div>

      <div>

        <div className="mb-2 font-semibold text-emerald-400">
          Selected Traits
        </div>

        <div className="flex flex-wrap gap-2">

          {data.selected_traits.map(
            (trait) => (
              <span
                key={trait}
                className="
                rounded-full
                bg-emerald-950
                px-3
                py-1
                text-xs
                "
              >
                + {trait}
              </span>
            )
          )}

        </div>

      </div>

      <div>

        <div className="mb-2 font-semibold text-red-400">
          Declining Traits
        </div>

        <div className="flex flex-wrap gap-2">

          {data.declining_traits.map(
            (trait) => (
              <span
                key={trait}
                className="
                rounded-full
                bg-red-950
                px-3
                py-1
                text-xs
                "
              >
                - {trait}
              </span>
            )
          )}

        </div>

      </div>

    </div>
  );
}