import axios from "axios";
import { useState } from "react";

export default function SimulationControls() {
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (fn: () => Promise<void>) => {
    try {
      setLoading(true);
      setError(null);
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Control error:", err);
    } finally {
      setLoading(false);
    }
  };

  const start = () =>
    handleRequest(async () => {
      await axios.post("http://localhost:8000/api/simulation/start");
    });

  const pause = () =>
    handleRequest(async () => {
      await axios.post("http://localhost:8000/api/simulation/pause");
    });

  const resume = () =>
    handleRequest(async () => {
      await axios.post("http://localhost:8000/api/simulation/resume");
    });

  const reset = () =>
    handleRequest(async () => {
      await axios.post("http://localhost:8000/api/simulation/reset");
    });

  const updateSpeed = (value: number) => {
    setSpeed(value);
    handleRequest(async () => {
      await axios.post("http://localhost:8000/api/simulation/speed", {
        speed: value,
      });
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-4 text-lg font-semibold">Simulation Controls</h3>

      {error && (
        <div className="mb-4 rounded bg-red-900/30 p-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Control Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={start}
          disabled={loading}
          className="flex-1 rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={pause}
          disabled={loading}
          className="flex-1 rounded bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
        >
          Pause
        </button>
        <button
          onClick={resume}
          disabled={loading}
          className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Resume
        </button>
        <button
          onClick={reset}
          disabled={loading}
          className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Simulation Speed</label>
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={speed}
          aria-label="Simulation Speed"
          onChange={(e) => updateSpeed(Number(e.target.value))}
          className="w-full"
          disabled={loading}
        />
        <div className="text-xs text-slate-400">{speed.toFixed(2)}x</div>
      </div>

      {/* Preset Speed Buttons */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {[0.5, 1, 2, 5, 10].map((value) => (
          <button
            key={value}
            onClick={() => updateSpeed(value)}
            disabled={loading}
            className={`rounded px-2 py-1 text-xs font-medium ${
              Math.abs(speed - value) < 0.01
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            } disabled:opacity-50`}
          >
            {value}x
          </button>
        ))}
      </div>
    </div>
  );
}