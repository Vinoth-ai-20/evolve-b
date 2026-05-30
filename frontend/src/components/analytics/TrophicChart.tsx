import { useSimulationStore } from "../../store/simulationStore";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function TrophicChart() {

  const state =
    useSimulationStore(
      (s) => s.state
    );

  const organisms =
    state?.organisms;

  let herbivores = 0;
  let omnivores = 0;
  let carnivores = 0;

  if (organisms) {

    for (
      const organism
      of organisms
    ) {

      switch (
      organism.diet_type
      ) {

        case "herbivore":
          herbivores++;
          break;

        case "omnivore":
          omnivores++;
          break;

        case "carnivore":
          carnivores++;
          break;

        default:
          break;
      }
    }
  }

  const data = [
    {
      type: "Herbivores",
      count: herbivores,
    },
    {
      type: "Omnivores",
      count: omnivores,
    },
    {
      type: "Carnivores",
      count: carnivores,
    },
  ];

  return (
    <div
      className="
      h-64
      w-full
      "
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
        >
          <XAxis
            dataKey="type"
          />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="count"
            name="Population"
            fill="#10b981"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}