import SimulationCanvas from "../components/simulation/SimulationCanvas";
import SimulationControls from "../components/controls/SimulationControls";

import StatsDashboard from "../components/analytics/StatsDashboard";
import PopulationChart from "../components/analytics/PopulationChart";
import FitnessChart from "../components/analytics/FitnessChart";
import TrophicChart from "../components/analytics/TrophicChart";

import SpeciesInspector from "../components/inspector/SpeciesInspector";
import SpeciesPanel from "../components/inspector/SpeciesPanel";

import CameraControls from "../components/simulation/CameraControls";

import DashboardCard from "../components/layout/DashboardCard";

import SimulationHUD from "../components/simulation/SimulationHUD";
import WorldLegend from "../components/simulation/WorldLegend";

import { useSimulationSocket } from "../hooks/useSimulationSocket";

export default function Dashboard() {

  useSimulationSocket();

  return (<div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="sticky top-0 z-50 flex h-12 items-center border-b border-slate-800 bg-slate-950 px-6"
    >
      <h1
  className="
  text-xs
  font-extrabold
  tracking-[0.25em]
  text-slate-400
  "
>
  EVOLVE-B
</h1>

      <span
        className="ml-3 text-xs text-slate-500"
      >
        Evolution Laboratory
      </span>
    </header>

    <main className="w-full px-6 py-6">
      <StatsDashboard />

      <div className="mt-6 grid grid-cols-12 gap-6">

        <section className="col-span-12 xl:col-span-9">

          <DashboardCard
            title="Simulation World"
            subtitle="Realtime ecosystem visualization"
          >
            <div className="relative">
              <SimulationHUD />
              <WorldLegend />
              <CameraControls />
              <SimulationCanvas />
            </div>
          </DashboardCard>

        </section>

        <aside className="col-span-12 xl:col-span-3">
          <SpeciesPanel />
        </aside>


      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <SpeciesInspector />

        <SimulationControls />

      </div>

      <section className="mt-8">

        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            Ecosystem Analytics
          </h2>

          <p className="text-sm text-slate-400">
            Population dynamics, trophic structure and fitness trends
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <DashboardCard
            title="Population Dynamics"
          >
            <PopulationChart />
          </DashboardCard>

          <DashboardCard
            title="Average Fitness"
          >
            <FitnessChart />
          </DashboardCard>

          <DashboardCard
            title="Trophic Structure"
          >
            <TrophicChart />
          </DashboardCard>

          <DashboardCard
            title="Genetic Diversity"
            subtitle="Coming soon"
          >
            <div className="flex h-64 items-center justify-center text-slate-500">
              Diversity analytics will appear here.
            </div>
          </DashboardCard>

        </div>

      </section>

    </main>

  </div>
  );
}
