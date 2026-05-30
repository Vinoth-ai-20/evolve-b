import { useSimulationStore } from "../../store/simulationStore";

export default function StatsDashboard() {
  const state = useSimulationStore((s) => s.state);

  const population = state?.population ?? 0;
  const temperature = state?.environment.temperature ?? 0;
  const humidity = state?.environment.humidity ?? 0;
  const sunlight = state?.environment.sunlight ?? 0;
  const speed = state?.simulation_speed ?? 1.0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {/* Population */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="text-sm font-medium text-slate-400">Population</div>
        <div className="mt-2 text-2xl font-bold text-emerald-400">{population}</div>
      </div>

      {/* Temperature */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="text-sm font-medium text-slate-400">Temperature</div>
        <div className="mt-2 text-2xl font-bold text-red-400">{temperature.toFixed(1)}°C</div>
      </div>

      {/* Humidity */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="text-sm font-medium text-slate-400">Humidity</div>
        <div className="mt-2 text-2xl font-bold text-blue-400">{humidity.toFixed(1)}%</div>
      </div>

      {/* Sunlight */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="text-sm font-medium text-slate-400">Sunlight</div>
        <div className="mt-2 text-2xl font-bold text-yellow-400">{sunlight.toFixed(1)}</div>
      </div>

      {/* Speed */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <div className="text-sm font-medium text-slate-400">Simulation Speed</div>
        <div className="mt-2 text-2xl font-bold text-purple-400">{speed.toFixed(2)}x</div>
      </div>
    </div>
  );
}