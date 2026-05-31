import { useEffect, useState } from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface EvolutionPoint {
  tick: number;
  avg_speed: number;
  avg_size: number;
  avg_metabolism: number;
  avg_lifespan: number;
  avg_generation: number;
}

export default function EvolutionTrendsChart() {

  const [data, setData] =
    useState<EvolutionPoint[]>([]);

  useEffect(() => {

    const fetchEvolution =
      async () => {

        try {

          const response =
            await axios.get<
              EvolutionPoint[]
            >(
              "http://localhost:8000/api/analytics/evolution"
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(
            "Evolution fetch failed",
            error
          );

        }
      };

    fetchEvolution();

    const interval =
      setInterval(
        fetchEvolution,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  return (
    <div
      className="
      h-80
      w-full
      "
    >
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

          <Legend />

          <Line
            type="monotone"
            dataKey="avg_speed"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Speed"
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="avg_size"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            name="Size"
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="avg_metabolism"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Metabolism"
            isAnimationActive={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}