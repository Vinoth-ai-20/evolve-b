import type { Species } from "../../types/species";

interface Props {
  species: Species;
}

export default function SpeciesCard({
  species,
}: Props) {
  return (
    <div
      className="
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      p-4
      shadow
      "
    >
      <h3 className="text-lg font-bold text-cyan-400">
        {species.species_id}
      </h3>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          Population:
          <span className="ml-2 font-semibold">
            {species.count}
          </span>
        </p>

        <p>
          Avg Speed:
          <span className="ml-2">
            {species.avg_speed.toFixed(2)}
          </span>
        </p>

        <p>
          Avg Size:
          <span className="ml-2">
            {species.avg_size.toFixed(2)}
          </span>
        </p>

        <p>
          Avg Metabolism:
          <span className="ml-2">
            {species.avg_metabolism.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
}