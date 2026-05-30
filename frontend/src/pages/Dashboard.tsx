import SimulationCanvas from "../components/simulation/SimulationCanvas";
import SimulationControls from "../components/controls/SimulationControls";

import StatsDashboard from "../components/analytics/StatsDashboard";
import PopulationChart from "../components/analytics/PopulationChart";
import FitnessChart from "../components/analytics/FitnessChart";
import TrophicChart from "../components/analytics/TrophicChart";

import SpeciesInspector from "../components/inspector/SpeciesInspector";
import SpeciesPanel from "../components/inspector/SpeciesPanel";

import { useSimulationSocket } from "../hooks/useSimulationSocket";

import CameraControls from "../components/simulation/CameraControls";

export default function Dashboard() {
  useSimulationSocket();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold">Evolve-B</h1>
          <p className="text-sm text-slate-400">
            Scientific Evolution Ecosystem Simulator
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Live Stats */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Live Statistics</h2>
          <StatsDashboard />
        </section>

        {/* Simulation + Sidebar */}
        <div className="grid grid-cols-12 gap-6">
          {/* World View */}
          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Simulation World</h2>
                <span className="text-sm text-slate-400">Realtime Ecosystem</span>
              </div>
              <div className="relative">
                <CameraControls />
                <SimulationCanvas />
              </div>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <SpeciesPanel />
            <SpeciesInspector />
            <SimulationControls />
          </aside>
        </div>

        {/* Analytics Charts */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Population Analytics</h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            Population Chart
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 min-w-0">
              <h3 className="mb-4 font-medium text-slate-300">Population Over Time</h3>
              <PopulationChart />
            </div>

            {/* Fitness Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h3 className="mb-4 font-medium text-slate-300">Average Fitness</h3>
              <FitnessChart />
            </div>

            {/* Trophic Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h3 className="mb-4 font-medium text-slate-300">Trophic Levels</h3>
              <TrophicChart />
            </div>

            {/* Diversity Chart */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h3 className="mb-4 font-medium text-slate-300">Genetic Diversity</h3>
              {/* Will be implemented with data loading */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}