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
            .slice(0, 12)
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

  const herbivores = species.filter(
    (s) =>
      s.dominant_diet?.toLowerCase() ===
      "herbivore"
  ).length;

  const carnivores = species.filter(
    (s) =>
      s.dominant_diet?.toLowerCase() ===
      "carnivore"
  ).length;

  const omnivores = species.filter(
    (s) =>
      s.dominant_diet?.toLowerCase() ===
      "omnivore"
  ).length;

  const averagePopulation =
    species.length > 0
      ? (
        species.reduce(
          (sum, s) =>
            sum + s.count,
          0
        ) / species.length
      ).toFixed(1)
      : "0";

  const totalPopulation =
    species.reduce(
      (sum, s) => sum + s.count,
      0
    );

  const largestSpecies =
    species.length > 0
      ? species[0]
      : null;

  const averageEnergy =
    species.length > 0
      ? (
        species.reduce(
          (sum, s) =>
            sum + s.avg_energy,
          0
        ) / species.length
      ).toFixed(1)
      : "0";

  return (
    <div className="rounded-xl  bg-slate-900  p-4 border border-slate-700 ">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold">
          Species
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Dominant species in the ecosystem
        </p>
      </div>
      <div className="max-h-[650px] overflow-y-auto  space-y-3  pr-1">
        {Array.isArray(species) &&
          species.map((item) => (
            <SpeciesCard
              key={item.species_id}
              species={item}
            />
          ))}
      </div>
      <div className="mt-6 border-t border-slate-800 pt-5">
        <h3 className="mb-4 text-sm font-semibold text-cyan-400" >
          Ecosystem Summary
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm" >
          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-slate-400 text-xs">
              Total Species
            </div>
            <div className="text-lg font-bold">
              {species.length}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-slate-400 text-xs">
              Avg Population
            </div>
            <div className="text-lg font-bold">
              {averagePopulation}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-slate-400 text-xs">
              Herbivores
            </div>
            <div className="text-lg font-bold text-green-400">
              {herbivores}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-slate-400 text-xs">
              Carnivores
            </div>
            <div className="text-lg font-bold text-red-400">
              {carnivores}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-slate-400 text-xs">
              Omnivores
            </div>
            <div className="text-lg font-bold text-purple-400">
              {omnivores}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-xs text-slate-400">
              Avg Energy
            </div>
            <div className="text-lg font-bold">
              {averageEnergy}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-xs text-slate-400">
              Largest Species
            </div>
            <div className="text-lg font-bold">
              {largestSpecies?.species_id ?? "-"}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-3">
            <div className="text-xs text-slate-400">
              Total Population
            </div>
            <div className="text-lg font-bold">
              {totalPopulation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}