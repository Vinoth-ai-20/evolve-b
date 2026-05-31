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
      bg-slate-800/40
      p-4
      "
    >
      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                species.color,
            }}
          />

          <span className="font-semibold">
            {species.species_id}
          </span>

        </div>

        <span
          className="
          rounded-full
          bg-slate-700
          px-2
          py-1
          text-xs
          "
        >
          {species.population_share.toFixed(1)}%
        </span>

      </div>

      <div className="mb-3 text-sm">

        <div>
          Diet:
          <span className="ml-2">
            {species.dominant_diet}
          </span>
        </div>

        <div>
          Population:
          <span className="ml-2 font-semibold">
            {species.count}
          </span>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">

        <div>
          Energy:
          {" "}
          {species.avg_energy.toFixed(1)}
        </div>

        <div>
          Age:
          {" "}
          {species.avg_age.toFixed(0)}
        </div>

        <div>
          Speed:
          {" "}
          {species.avg_speed.toFixed(2)}
        </div>

        <div>
          Size:
          {" "}
          {species.avg_size.toFixed(2)}
        </div>

        <div>
          Metabolism:
          {" "}
          {species.avg_metabolism.toFixed(2)}
        </div>

        <div>
          Gen:
          {" "}
          {species.max_generation}
        </div>

      </div>

      <div className="mt-3 flex flex-wrap gap-2">

        {species.dominant_traits.map(
          (trait) => (
            <span
              key={trait}
              className="
              rounded-full
              bg-slate-700
              px-2
              py-1
              text-xs
              "
            >
              {trait}
            </span>
          )
        )}

      </div>

    </div>
  );
}