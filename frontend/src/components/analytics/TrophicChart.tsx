import { useSimulationStore } from "../../store/simulationStore";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function TrophicChart() {

  const trophic =
    useSimulationStore(
      (s) =>
        s.state?.trophic_levels
    );

  if (!trophic) {
    return null;
  }

  const data = [
    {
      name: "Herbivores",
      value:
        trophic.herbivore,
      color: "#22c55e",
    },
    {
      name: "Carnivores",
      value:
        trophic.carnivore,
      color: "#ef4444",
    },
    {
      name: "Omnivores",
      value:
        trophic.omnivore,
      color: "#a855f7",
    },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map(
              (entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}