import { useSimulationStore } from "../../store/simulationStore";
import { useEffect } from "react";

export default function SpeciesInspector() {
  const simulationState =
    useSimulationStore(
      (s) => s.state
    );

  const selectedOrganismId =
    useSimulationStore(
      (s) => s.selectedOrganismId
    );

  // Log selection changes for debugging
  useEffect(() => {
    if (selectedOrganismId) {
      console.log('[SpeciesInspector] ✓ Displaying organism:', selectedOrganismId.slice(0, 8) + '...');
    } else {
      console.log('[SpeciesInspector] Displaying default organism (no selection)');
    }
  }, [selectedOrganismId]);

  if (
    !simulationState ||
    simulationState.organisms.length === 0
  ) {
    return (
      <div className="h-full min-h-[700px] rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-lg">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-lg font-semibold">
            Organism Inspector
          </h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-400">
            No organisms available
          </p>
        </div>
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
    <div className="h-full min-h-[700px] rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-lg">
      <div className="border-b border-slate-800 px-5 py-4">
        <h3 className="text-lg font-semibold">
          Organism Inspector
        </h3>
      </div>

      <div className="h-[calc(100%-72px)] overflow-y-auto p-5 space-y-5">

        <div
          className="
  rounded-lg
  border
  border-cyan-900
  bg-cyan-950/40
  p-4
  "
        >
          <div className="text-xs text-cyan-400 font-medium">
            Tracking Organism
          </div>

          <div className="mt-3 flex items-center gap-3">
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

        <div className="space-y-4">

          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              ID
            </div>

            <div className="mt-1 font-mono text-sm text-cyan-400 break-all">
              {organism.id}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Age
              </div>
              <div className="mt-1 text-sm">{organism.age}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Generation
              </div>
              <div className="mt-1 text-sm">
                {organism.generation}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Energy
              </div>
              <div className="mt-1 text-sm">
                {organism.energy.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Fitness
              </div>
              <div className="mt-1 text-sm">
                {organism.fitness.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Speed
              </div>
              <div className="mt-1 text-sm">
                {organism.speed.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Radius
              </div>
              <div className="mt-1 text-sm">
                {organism.radius.toFixed(2)}
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-4 space-y-3">

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Diet
              </div>

              <div className="mt-1 text-sm capitalize">
                {organism.diet_type}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Children
              </div>

              <div className="mt-1 text-sm">
                {organism.children}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Position
              </div>

              <div className="mt-1 text-sm">
                (
                {organism.x.toFixed(0)},
                {organism.y.toFixed(0)}
                )
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Status
              </div>

              <div
                className={`mt-1 text-sm font-medium ${organism.alive
                  ? "text-green-400"
                  : "text-red-400"
                  }`}
              >
                {organism.alive
                  ? "Alive"
                  : "Dead"}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}