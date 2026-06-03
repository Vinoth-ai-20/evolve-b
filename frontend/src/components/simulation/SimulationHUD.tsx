import { memo } from "react";
import { useSimulationStore } from "../../store/simulationStore";

function SimulationHUDComponent() {
  // Use individual selectors to prevent infinite loops
  const state = useSimulationStore((s) => s.state);
  const camera = useSimulationStore((s) => s.camera);

  if (!state) {
    return null;
  }

  const population =
    state.population;

  const species =
    state.species_count ?? 0;

  let status =
    "Healthy";

  if (
    population < 50
  ) {
    status =
      "Critical";
  } else if (
    species < 3
  ) {
    status =
      "Stressed";
  }

  const dominant =
    state.dominant_species;

  const evolutionScore =
    state.evolution_score ?? 0;

  return (
    <div
      className="
    absolute
    left-4
    top-4
    z-20
    w-72
    rounded-xl
    border
    border-slate-700
    bg-slate-950/85
    p-4
    text-xs
    backdrop-blur
    "
    >

      <div className="mb-3 font-semibold text-cyan-400">
        Ecosystem Diagnostics
      </div>

      <div className="grid grid-cols-2 gap-y-1">

        <div>Population</div>
        <div>{population}</div>

        <div>Species</div>
        <div>{species}</div>

        <div>
          Evolution Score
        </div>

        <div className="text-cyan-400 font-semibold">
          {evolutionScore}
        </div>

        <div>Zoom</div>
        <div>
          {(camera.zoom * 100).toFixed(0)}%
        </div>

      </div>

      {dominant && (

  <div className="mt-4">

    <div className="mb-2 font-semibold text-yellow-400">
      Dominant Species
    </div>

    <div className="space-y-1">

      <div>
        Population:
        {" "}
        {dominant.population}
      </div>

      <div>
        Share:
        {" "}
        {dominant.share}%
      </div>

      <div>
        Diet:
        {" "}
        {dominant.diet}
      </div>

      <div>
        Generation:
        {" "}
        {dominant.max_generation}
      </div>

      <div>
        Avg Energy:
        {" "}
        {dominant.average_energy}
      </div>

      <div>
        Avg Age:
        {" "}
        {dominant.average_age}
      </div>

    </div>

    <div className="mt-2 flex flex-wrap gap-1">

      {dominant.traits.map(
        (trait: string) => (
          <span
            key={trait}
            className="
            rounded
            bg-slate-800
            px-2
            py-1
            "
          >
            {trait}
          </span>
        )
      )}

    </div>

  </div>

)}

      <div
        className="
      mt-4
      font-semibold
      text-emerald-400
      "
      >
        Status: {status}
      </div>

    </div>
  );
}

export default memo(SimulationHUDComponent);