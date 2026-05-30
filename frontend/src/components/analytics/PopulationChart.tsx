import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useSimulationStore } from "../../store/simulationStore";

export default function PopulationChart() {

  const data =
    useSimulationStore(
      (state) =>
        state.populationHistory
    );

  return (
    <div
      className="
    h-72
    w-full
    min-w-0
    ">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
        >
          <XAxis
            dataKey="tick"
            hide
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}