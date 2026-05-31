import { useEffect, useState } from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface FitnessPoint {
  tick: number;
  fitness: number;
}

export default function FitnessChart() {

  const [data, setData] =
    useState<FitnessPoint[]>([]);

  useEffect(() => {

    const fetchFitness =
      async () => {

        try {

          const response =
            await axios.get<
              FitnessPoint[]
            >(
              "http://localhost:8000/api/analytics/fitness"
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(
            "Fitness fetch failed",
            error
          );

        }
      };

    fetchFitness();

    const interval =
      setInterval(
        fetchFitness,
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
      h-[300px]
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

          <Line
            type="monotone"
            dataKey="fitness"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Average Fitness"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}