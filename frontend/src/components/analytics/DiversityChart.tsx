import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Point {
  tick: number;
  diversity: number;
}

export default function DiversityChart(
  {
    data,
  }: {
    data: Point[];
  }
) {
  return (
    <LineChart
      width={500}
      height={250}
      data={data}
    >
      <XAxis dataKey="tick" />
      <YAxis />
      <Tooltip />

      <Line
        dataKey="diversity"
      />
    </LineChart>
  );
}