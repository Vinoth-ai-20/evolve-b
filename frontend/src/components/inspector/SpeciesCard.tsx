import type { Species } from "../../types/species";

interface Props {
  species: Species;
}

export default function SpeciesCard({
  species,
}: Props) {
  return (
    <div className="mt-3 space-y-3">

      <div className="flex items-center gap-2">

        <div
          className="h-4 w-4 rounded-full"
          style={{
            backgroundColor:
              species.color,
          }}
        />

        <span className="font-medium">
          {species.dominant_diet}
        </span>

      </div>

      <div>
        Population:
        <span className="ml-2 font-semibold">
          {species.count}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">

        {species.dominant_traits.map(
          (trait) => (
            <span
              key={trait}
              className="
          rounded-full
          bg-slate-800
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