import { useEffect, useState } from "react";
import axios from "axios";

interface ExtinctSpecies {
  species_id: string;
  first_seen: number;
  extinction_tick: number;
  peak_population: number;
  lifespan: number;
}

export default function SpeciesCemetery() {

  const [species, setSpecies] =
    useState<ExtinctSpecies[]>([]);

  useEffect(() => {

    const load =
      async () => {

        try {

          const response =
            await axios.get<
              ExtinctSpecies[]
            >(
              "http://localhost:8000/api/cemetery/"
            );

          setSpecies(
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

  return (
    <div
      className="
      h-80
      overflow-y-auto
      space-y-3
      pr-2
      "
    >

      {species.length === 0 && (
        <div className="text-slate-500 text-sm">
          No extinct species recorded.
        </div>
      )}

      {species.map(
        (item) => (

          <div
            key={item.species_id}
            className="
            rounded-lg
            border
            border-red-900/30
            bg-slate-900
            p-3
            "
          >

            <div className="font-semibold text-red-400">
              {item.species_id}
            </div>

            <div className="mt-2 text-xs space-y-1">

              <div>
                Peak Population:
                {" "}
                {item.peak_population}
              </div>

              <div>
                First Seen:
                {" "}
                Tick {item.first_seen}
              </div>

              <div>
                Extinct:
                {" "}
                Tick {item.extinction_tick}
              </div>

              <div>
                Survival:
                {" "}
                {item.lifespan}
                {" "}
                ticks
              </div>

            </div>

          </div>

        )
      )}

    </div>
  );
}