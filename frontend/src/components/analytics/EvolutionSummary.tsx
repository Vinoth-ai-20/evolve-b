import { useSimulationStore } from "../../store/simulationStore";

export default function EvolutionSummary() {

  const state =
    useSimulationStore(
      (s) => s.state
    );

  if (!state) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const population =
    state.population ?? 0;

  const speciesCount =
    state.species_count ?? 0;

  const averageGeneration =
    state.average_generation ?? 0;

  const evolutionScore =
    state.evolution_score ?? 0;

  const ecosystemHealth =
    state.ecosystem_health ?? "Unknown";

  const dominantSpecies =
    state.dominant_species;

  return (
    <div
      className="
      space-y-3
      text-sm
      "
    >

      <div className="flex justify-between">
        <span>
          Population
        </span>

        <span className="font-semibold">
          {population}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Species Count
        </span>

        <span className="font-semibold">
          {speciesCount}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Average Generation
        </span>

        <span className="font-semibold">
          {averageGeneration.toFixed(1)}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Diversity
        </span>

        <span className="font-semibold">
          {(state.diversity ?? 0).toFixed(3)}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Dominant Diet
        </span>

        <span className="font-semibold">
          {dominantSpecies?.diet ?? "Unknown"}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Dominant Share
        </span>

        <span className="font-semibold">
          {dominantSpecies?.share ?? 0}%
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Evolution Score
        </span>

        <span className="font-semibold text-cyan-400">
          {evolutionScore}
        </span>
      </div>

      <div className="flex justify-between">
        <span>
          Ecosystem Health
        </span>

        <span
          className={`
            font-semibold
            ${ecosystemHealth === "Healthy"
              ? "text-emerald-400"
              : ecosystemHealth === "Stressed"
                ? "text-amber-400"
                : "text-red-400"
            }
          `}
        >
          {ecosystemHealth}
        </span>
      </div>

    </div>
  );
}