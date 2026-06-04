export default function WorldLegend() {

  return (
    <div
      className="
      absolute
      bottom-4
      left-4
      z-20
      rounded-xl
      border
      border-slate-700
      bg-slate-950/85
      p-3
      text-xs
      backdrop-blur
      pointer-events-none
      "
    >
      <div className="mb-2 font-semibold">
        World Legend
      </div>

      <div className="text-green-400">
        ● Herbivore
      </div>

      <div className="text-red-400">
        ● Carnivore
      </div>

      <div className="text-purple-400">
        ● Omnivore
      </div>

      <div className="text-cyan-400">
        ◯ Selected
      </div>
    </div>
  );
}