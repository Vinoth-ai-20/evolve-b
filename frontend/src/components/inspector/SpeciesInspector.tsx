import { useState } from "react";

import { useSimulationStore } from "../../store/simulationStore";

export default function SpeciesInspector() {

  const simulationState =
    useSimulationStore(
      (s) => s.state
    );

  const [selectedIndex] =
    useState(0);

  if (
    !simulationState ||
    !simulationState.organisms ||
    simulationState.organisms.length === 0
  ) {
    return (
      <div
        className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-4
        "
      >
        <h3 className="text-lg font-semibold">
          Organism Inspector
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          No organism selected
        </p>
      </div>
    );
  }

  const organism =
    simulationState.organisms[
    Math.min(
      selectedIndex,
      simulationState.organisms.length - 1
    )
    ];

  return (
    <div
      className="
      rounded-xl
      border
      border-slate-800
      bg-slate-900
      p-4
      "
    >
      <h3
        className="
        mb-4
        text-lg
        font-semibold
        "
      >
        Organism Inspector
      </h3>

      <div className="space-y-3">

        <div>
          <div className="text-xs text-slate-500">
            ID
          </div>

          <div className="font-mono text-cyan-400">
            {organism.id.slice(0, 8)}
          </div>
        </div>

        <div
          className="
          grid
          grid-cols-2
          gap-3
          "
        >
          <div>
            <div className="text-xs text-slate-500">
              Age
            </div>

            <div>
              {organism.age}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">
              Energy
            </div>

            <div>
              {organism.energy.toFixed(1)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">
            Position
          </div>

          <div>
            (
            {organism.x.toFixed(0)}
            ,
            {organism.y.toFixed(0)}
            )
          </div>
        </div>

      </div>
    </div>
  );
}