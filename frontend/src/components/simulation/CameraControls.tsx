import { useSimulationStore } from "../../store/simulationStore";

export default function CameraControls() {
  const zoom =
    useSimulationStore(
      (s) => s.camera.zoom
    );

  const zoomIn =
    useSimulationStore(
      (s) => s.zoomIn
    );

  const zoomOut =
    useSimulationStore(
      (s) => s.zoomOut
    );

  const setCameraPosition =
    useSimulationStore(
      (s) => s.setCameraPosition
    );

  const resetZoom =
    useSimulationStore(
      (s) => s.resetZoom
    );

  const handleHome = () => {
    setCameraPosition(0, 0);
    resetZoom();
  };

  const heatmapMode =
    useSimulationStore(
      (s) => s.heatmapMode
    );

  const setHeatmapMode =
    useSimulationStore(
      (s) => s.setHeatmapMode
    );

  const followSelected =
    useSimulationStore(
      (s) => s.followSelected
    );

  const toggleFollowSelected =
    useSimulationStore(
      (s) => s.toggleFollowSelected
    );

  return (
    <div
      className="
      absolute
      right-4
      top-4
      z-20
      flex
      flex-col
      gap-2
      "
    >
      <button
        onClick={zoomIn}
        className="
        rounded
        bg-slate-800
        px-3
        py-2
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
        px-3
        py-2
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
    px-3
    py-2
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
        px-3
        py-2
        hover:bg-slate-700
        "
      >
        Home
      </button>

      <div className="flex flex-col gap-2">

        <button
          onClick={() =>
            setHeatmapMode(
              "population"
            )
          }
          className={
            heatmapMode === "population"
              ? "rounded bg-cyan-600 px-3 py-2"
              : "rounded bg-slate-800 px-3 py-2"
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
              ? "rounded bg-cyan-600 px-3 py-2"
              : "rounded bg-slate-800 px-3 py-2"
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
              ? "rounded bg-cyan-600 px-3 py-2"
              : "rounded bg-slate-800 px-3 py-2"
          }
        >
          Off
        </button>

      </div>

      <div
        className="
        rounded
        bg-slate-900
        px-3
        py-2
        text-center
        text-xs
        "
      >
        {(zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}