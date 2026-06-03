import { useMemo, memo } from "react";
import { useSimulationStore } from "../../store/simulationStore";

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}

const StatCard = memo(function StatCard({
  label,
  value,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-800
      bg-slate-900/80
      p-5
      backdrop-blur
      transition-all
      hover:border-slate-700
      hover:bg-slate-900
      "
    >
      <div className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div
        className={`mt-3 text-3xl font-bold ${color}`}
      >
        {value}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
});

function StatsDashboardComponent() {
  // Use individual selectors to prevent infinite loops
  const population = useSimulationStore((s) => s.state?.population ?? 0);
  const speed = useSimulationStore((s) => s.state?.simulation_speed ?? 1);
  const temperature = useSimulationStore((s) => s.state?.environment.temperature ?? 0);
  const humidity = useSimulationStore((s) => s.state?.environment.humidity ?? 0);
  const sunlight = useSimulationStore((s) => s.state?.environment.sunlight ?? 0);
  const trophic = useSimulationStore((s) => s.state?.trophic_levels);
  const speciesCount = useSimulationStore((s) => s.state?.species_count ?? 0);

  const healthScore =
    useMemo(() => {

      const populationFactor =
        Math.min(
          population / 1000,
          1
        );

      const speciesFactor =
        Math.min(
          speciesCount / 20,
          1
        );

      let trophicFactor =
        0.5;

      if (trophic) {

        const total =
          trophic.herbivore +
          trophic.carnivore +
          trophic.omnivore;

        if (total > 0) {

          const herbivoreRatio =
            trophic.herbivore /
            total;

          trophicFactor =
            1 -
            Math.abs(
              herbivoreRatio -
              0.6
            );
        }
      }

      const score =
        (
          (
            populationFactor +
            speciesFactor +
            trophicFactor
          ) /
          3
        ) * 100;

      return Math.round(score);

    }, [
      population,
      speciesCount,
      trophic,
    ]);

  return (
    <div
      className="
      grid
      grid-cols-2
      gap-4
      md:grid-cols-4
      xl:grid-cols-8
      "
    >
      <StatCard
        label="Population"
        value={population.toLocaleString()}
        color="text-emerald-400"
        subtitle="Active Organisms"
      />

      <StatCard
        label="Species"
        value={speciesCount}
        color="text-cyan-400"
        subtitle="Detected Clusters"
      />

      <StatCard
        label="Health Score"
        value={`${healthScore}%`}
        color="text-green-400"
        subtitle="Ecosystem Stability"
      />

      <StatCard
        label="Simulation"
        value={`${speed.toFixed(1)}x`}
        color="text-violet-400"
        subtitle="Execution Speed"
      />

      <StatCard
        label="Temperature"
        value={temperature.toFixed(2)}
        color="text-red-400"
        subtitle="Environmental"
      />

      <StatCard
        label="Humidity"
        value={humidity.toFixed(2)}
        color="text-blue-400"
        subtitle="Environmental"
      />

      <StatCard
        label="Sunlight"
        value={sunlight.toFixed(2)}
        color="text-yellow-400"
        subtitle="Environmental"
      />

      <StatCard
        label="Dominant Diet"
        value={
          trophic
            ? trophic.herbivore >= trophic.carnivore &&
              trophic.herbivore >= trophic.omnivore
              ? "Herbivore"
              : trophic.carnivore >= trophic.omnivore
                ? "Carnivore"
                : "Omnivore"
            : "-"
        }
        color="text-pink-400"
        subtitle="Trophic Leader"
      />
    </div>
  );
}

export default memo(StatsDashboardComponent);