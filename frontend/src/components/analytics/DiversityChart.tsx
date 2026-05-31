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

interface DiversityPoint {
  tick: number;
  value: number;
}

export default function DiversityChart() {

  const [data, setData] =
    useState<DiversityPoint[]>([]);

  useEffect(() => {

    const fetchDiversity =
      async () => {

        try {

          const response =
            await axios.get<
              DiversityPoint[]
            >(
              "http://localhost:8000/api/analytics/diversity"
            );

          setData(
            response.data
          );

        } catch (error) {

          console.error(
            "Diversity fetch failed",
            error
          );

        }
      };

    fetchDiversity();

    const interval =
      setInterval(
        fetchDiversity,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  return (
    <div className="h-80 w-full">

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
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name="Genetic Diversity"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}