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

import EvolutionTrendsChart from "../components/analytics/EvolutionTrendsChart";

import EventFeed from "../components/analytics/EventFeed";

import DiversityChart from "../components/analytics/DiversityChart";

import EvolutionSummary from "../components/analytics/EvolutionSummary";

import MilestonesPanel from "../components/analytics/MilestonesPanel";

import SpeciesCemetery from "../components/analytics/SpeciesCemetery";

import EvolutionIntelligence from "../components/analytics/EvolutionIntelligence";

import EvolutionReport from "../components/analytics/EvolutionReport";

import LineagePanel from "../components/analytics/LineagePanel";

import { useSimulationSocket } from "../hooks/useSimulationSocket";

import PredatorLeaderboard from "../components/analytics/PredatorLeaderboard";

import PhylogeneticTree from "../components/analytics/PhylogeneticTree";

import PixiSimulationCanvas from "../components/simulation/PixiSimulationCanvas";

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
            className="h-full"
          >
            <div className="relative h-full min-h-0">
              <SimulationHUD />
              <WorldLegend />
              <CameraControls />
              <PixiSimulationCanvas />
            </div>
          </DashboardCard>

        </section>

        <aside className="col-span-12 xl:col-span-3 flex flex-col h-full">
          <div className="flex-1">
            <SpeciesPanel />
          </div>
        </aside>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <SpeciesInspector />

        <SimulationControls />

      </div>

      <section className="mt-8">

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            Ecosystem Analytics
          </h2>

          <p className="text-sm text-slate-400">
            Population dynamics, trophic structure and fitness trends
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <DashboardCard
            title="Evolution Summary"
            subtitle="High-level ecosystem intelligence"
          >
            <EvolutionSummary />
          </DashboardCard>

          <DashboardCard
            title="Apex Predators"
            subtitle="Top hunting species in the ecosystem"
          >
            <PredatorLeaderboard />
          </DashboardCard>

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
            title="Evolution Trends"
            subtitle="Natural selection across generations"
          >
            <EvolutionTrendsChart />
          </DashboardCard>

          <DashboardCard
            title="Trophic Structure"
          >
            <TrophicChart />
          </DashboardCard>

          <DashboardCard
            title="Evolution Intelligence"
            subtitle="Trait selection and adaptation analysis"
          >
            <EvolutionIntelligence />
          </DashboardCard>

          <DashboardCard
            title="Evolutionary Lineages"
            subtitle="Most successful family trees"
          >
            <LineagePanel />
          </DashboardCard>

          <DashboardCard
            title="Evolution Report"
            subtitle="Automated ecosystem analysis"
          >
            <EvolutionReport />
          </DashboardCard>

          <DashboardCard
            title="Phylogenetic Tree"
            subtitle="Evolutionary branching history"
          >
            <PhylogeneticTree />
          </DashboardCard>

          <DashboardCard
            title="Recent Ecosystem Events"
            subtitle="Evolutionary milestones and ecosystem changes"
          >
            <EventFeed />
          </DashboardCard>

          <DashboardCard
            title="Evolution Milestones"
            subtitle="Major evolutionary achievements"
          >
            <MilestonesPanel />
          </DashboardCard>

          <DashboardCard
            title="Species Cemetery"
            subtitle="Extinct evolutionary lineages"
          >
            <SpeciesCemetery />
          </DashboardCard>

          <DashboardCard
            title="Genetic Diversity"
            subtitle="Population variance over time"
          >
            <DiversityChart />
          </DashboardCard>

        </div>

      </section>

    </main>

  </div>
  );
}
