import { useEffect, useState } from "react";
import axios from "axios";

import SpeciesCard from "./SpeciesCard";
import type { Species } from "../../types/species";

export default function SpeciesPanel() {
  const [species, setSpecies] =
    useState<Species[]>([]);

  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const response =
          await axios.get<Species[]>(
            "http://localhost:8000/api/species/"
          );

        setSpecies(
          response.data
            .sort(
              (a, b) =>
                b.count - a.count
            )
            .slice(0, 3)
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadSpecies();

    const interval =
      setInterval(loadSpecies, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
      rounded-xl
      bg-slate-900
      p-4
      border
      border-slate-700
      "
    >
      <h2
        className="
        text-lg
        font-bold
        mb-6
        mr-6
        "
      >
        Species
      </h2>

      <div
        className="max-h-[700] overflow-y-auto space-y-3 pr-1"
      >
        {Array.isArray(species) &&
          species.map((item) => (
            <SpeciesCard
              key={item.species_id}
              species={item}
            />
          ))}
      </div>
    </div>
  );
}