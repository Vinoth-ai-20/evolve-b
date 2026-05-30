interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;

  onChange: (
    value: number
  ) => void;
}

export default function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: SliderProps) {
  return (
    <div className="space-y-2">

      <div
        className="
        flex
        justify-between
        text-sm
        "
      >
        <span className="text-slate-300">
          {label}
        </span>

        <span className="text-slate-400">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={`${label} slider`}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="
        w-full
        accent-blue-500
        cursor-pointer
        "
      />
    </div>
  );
}