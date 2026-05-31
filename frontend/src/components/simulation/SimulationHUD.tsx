import { useSimulationStore } from "../../store/simulationStore";

export default function SimulationHUD() {

  const state =
    useSimulationStore(
      (s) => s.state
    );

  const camera =
    useSimulationStore(
      (s) => s.camera
    );

  if (!state) {
    return null;
  }

  const population =
    state.population;

  const species =
    state.species_count ?? 0;

  const trophic =
    state.trophic_levels;

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

  return (
    <div
      className="
      absolute
      left-4
      top-4
      z-20
      rounded-xl
      border
      border-slate-700
      bg-slate-950/85
      p-4
      text-xs
      backdrop-blur
      "
    >
      <div className="mb-2 font-semibold text-cyan-400">
        Simulation Diagnostics
      </div>

      <div>Population: {population}</div>
      <div>Species: {species}</div>

      <div>
        Zoom:
        {" "}
        {(camera.zoom * 100).toFixed(0)}%
      </div>

      <div>
        Camera:
        {" "}
        {camera.x.toFixed(0)}
        ,
        {" "}
        {camera.y.toFixed(0)}
      </div>

      <div>
        Herbivores:
        {" "}
        {trophic.herbivore}
      </div>

      <div>
        Carnivores:
        {" "}
        {trophic.carnivore}
      </div>

      <div>
        Omnivores:
        {" "}
        {trophic.omnivore}
      </div>

      <div
        className="
        mt-2
        font-semibold
        text-emerald-400
        "
      >
        Status:
        {" "}
        {status}
      </div>
    </div>
  );
}