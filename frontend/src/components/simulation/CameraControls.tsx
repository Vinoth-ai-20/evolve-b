import { memo } from "react";
import { useSimulationStore } from "../../store/simulationStore";

function CameraControlsComponent() {
  // Use individual selectors to prevent infinite loops
  const zoom = useSimulationStore((s) => s.camera.zoom);
  const zoomIn = useSimulationStore((s) => s.zoomIn);
  const zoomOut = useSimulationStore((s) => s.zoomOut);
  const setCameraPosition = useSimulationStore((s) => s.setCameraPosition);
  const resetZoom = useSimulationStore((s) => s.resetZoom);

  const state = useSimulationStore.getState().state;

  const handleHome = () => {
    if (!state) return;

    setCameraPosition(
      state.world_width / 2,
      state.world_height / 2
    );

    resetZoom();
  };

  // Use individual selectors to prevent infinite loops
  const heatmapMode = useSimulationStore((s) => s.heatmapMode);
  const setHeatmapMode = useSimulationStore((s) => s.setHeatmapMode);

  // Use individual selectors to prevent infinite loops
  const followSelected = useSimulationStore((s) => s.followSelected);
  const toggleFollowSelected = useSimulationStore((s) => s.toggleFollowSelected);

  return (
    <div
      className="
      absolute
      right-4
      top-4
      z-20
      flex
      flex-col
      gap-1
      pointer-events-auto
      "
    >
      <button
        onClick={zoomIn}
        className="
        rounded
        bg-slate-800
        px-2
        py-1
        text-sm
        hover:bg-slate-700
        "
      >
        +
      </button>

      <button
        onClick={zoomOut}
        className="
        rounded
        bg-slate-800
        px-2
        py-1
        text-sm
        hover:bg-slate-700
        "
      >
        -
      </button>

      <button
        onClick={
          toggleFollowSelected
        }
        className={`
    rounded
    px-2
    py-1
    text-sm
    ${followSelected
            ? "bg-cyan-600"
            : "bg-slate-800"
          }
    hover:bg-cyan-500
  `}
      >
        Track
      </button>

      <button
        onClick={handleHome}
        className="
        rounded
        bg-slate-800
        px-2
        py-1
        text-sm
        hover:bg-slate-700
        "
      >
        Home
      </button>

      <div className="flex flex-col gap-1">

        <button
          onClick={() =>
            setHeatmapMode(
              "population"
            )
          }
          className={
            heatmapMode === "population"
              ? "rounded bg-cyan-600 px-2 py-1 text-sm"
              : "rounded bg-slate-800 px-2 py-1 text-sm"
          }
        >
          Population
        </button>

        <button
          onClick={() =>
            setHeatmapMode(
              "resources"
            )
          }
          className={
            heatmapMode === "resources"
              ? "rounded bg-cyan-600 px-2 py-1 text-sm"
              : "rounded bg-slate-800 px-2 py-1 text-sm"
          }
        >
          Resources
        </button>

        <button
          onClick={() =>
            setHeatmapMode(
              "none"
            )
          }
          className={
            heatmapMode === "none"
              ? "rounded bg-cyan-600 px-2 py-1 text-sm"
              : "rounded bg-slate-800 px-2 py-1 text-sm"
          }
        >
          Off
        </button>

      </div>

      <div
        className="
        rounded
        bg-slate-900
        px-2
        py-1
        text-center
        text-xs
        "
      >
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}

export default memo(CameraControlsComponent);