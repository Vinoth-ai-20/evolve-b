import Card from "./Card";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
}

export default function MetricCard({
  label,
  value,
  subtext,
}: MetricCardProps) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-2 text-3xl font-bold text-white">
        {value}
      </div>

      {subtext && (
        <div className="mt-2 text-sm text-slate-500">
          {subtext}
        </div>
      )}
    </Card>
  );
}