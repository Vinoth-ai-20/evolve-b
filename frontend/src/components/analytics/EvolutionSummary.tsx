import { useEffect, useState } from "react";

import axios from "axios";

interface Summary {

  population: number;

  species_count: number;

  average_generation: number;

  dominant_diet: string;

  dominant_species_share: number;

  evolution_score: number;

  ecosystem_health: string;
}

export default function EvolutionSummary() {

  const [summary, setSummary] =
    useState<Summary | null>(
      null
    );

  useEffect(() => {

    const loadSummary =
      async () => {

        try {

          const response =
            await axios.get<Summary>(
              "http://localhost:8000/api/intelligence/summary"
            );

          setSummary(
            response.data
          );

        } catch (
        error
        ) {

          console.error(
            error
          );

        }
      };

    loadSummary();

    const interval =
      setInterval(
        loadSummary,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  if (!summary) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
      space-y-3
      text-sm
      "
    >

      <div className="flex justify-between">
        <span>
          Population Trend
        </span>

        <span className="font-semibold">
          {summary.population}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Species Count
        </span>

        <span className="font-semibold">
          {summary.species_count}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Average Generation
        </span>

        <span className="font-semibold">
          {summary.average_generation}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Dominant Diet
        </span>

        <span className="font-semibold">
          {summary.dominant_diet}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Dominant Share
        </span>

        <span className="font-semibold">
          {summary.dominant_species_share}%
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Evolution Score
        </span>

        <span className="font-semibold text-cyan-400">
          {summary.evolution_score}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Ecosystem Health
        </span>

        <span
          className="
          font-semibold
          text-emerald-400
          "
        >
          {summary.ecosystem_health}
        </span>
      </div>

    </div>
  );
}