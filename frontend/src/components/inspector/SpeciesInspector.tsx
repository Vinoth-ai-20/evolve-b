import { useSimulationStore } from "../../store/simulationStore";

export default function SpeciesInspector() {
  const simulationState =
    useSimulationStore(
      (s) => s.state
    );

  const selectedOrganismId =
    useSimulationStore(
      (s) => s.selectedOrganismId
    );

  if (
    !simulationState ||
    simulationState.organisms.length === 0
  ) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-lg font-semibold">
          Organism Inspector
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          No organisms available
        </p>
      </div>
    );
  }

  const organism =
    simulationState.organisms.find(
      (o) =>
        o.id ===
        selectedOrganismId
    ) ??
    simulationState.organisms[0];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-4 text-lg font-semibold">
        Organism Inspector
      </h3>

      <div
        className="
  mb-4
  rounded-lg
  border
  border-cyan-900
  bg-cyan-950/40
  p-3
  "
      >
        <div className="text-xs text-cyan-400">
          Tracking Organism
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-5 w-5 rounded-full"
            style={{
              backgroundColor: `rgb(
          ${organism.color[0]},
          ${organism.color[1]},
          ${organism.color[2]}
        )`,
            }}
          />

          <div className="font-mono text-sm">
            {organism.id.slice(0, 12)}
          </div>
        </div>
      </div>

      <div className="space-y-3">

        <div>
          <div className="text-xs text-slate-500">
            ID
          </div>

          <div className="font-mono text-cyan-400 break-all">
            {organism.id}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <div className="text-xs text-slate-500">
              Age
            </div>
            <div>{organism.age}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Generation
            </div>
            <div>
              {organism.generation}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Energy
            </div>
            <div>
              {organism.energy.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Fitness
            </div>
            <div>
              {organism.fitness.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Speed
            </div>
            <div>
              {organism.speed.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Radius
            </div>
            <div>
              {organism.radius.toFixed(2)}
            </div>
          </div>

        </div>

        <div>
          <div className="text-xs text-slate-500">
            Diet
          </div>

          <div className="capitalize">
            {organism.diet_type}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">
            Children
          </div>

          <div>
            {organism.children}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">
            Position
          </div>

          <div>
            (
            {organism.x.toFixed(0)},
            {organism.y.toFixed(0)}
            )
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">
            Status
          </div>

          <div
            className={
              organism.alive
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {organism.alive
              ? "Alive"
              : "Dead"}
          </div>
        </div>

      </div>
    </div>
  );
}