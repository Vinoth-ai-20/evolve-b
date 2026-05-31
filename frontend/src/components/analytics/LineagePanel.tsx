import { useEffect, useState } from "react";

import axios from "axios";

interface Lineage {

  organism_id: string;

  children: number;

  descendants: number;
}

export default function LineagePanel() {

  const [lineages, setLineages] =
    useState<Lineage[]>([]);

  useEffect(() => {

    const loadLineages =
      async () => {

        try {

          const response =
            await axios.get<
              Lineage[]
            >(
              "http://localhost:8000/api/lineage/"
            );

          setLineages(
            response.data
          );

        } catch (error) {

          console.error(
            "Failed to load lineage data",
            error
          );

        }
      };

    loadLineages();

    const interval =
      setInterval(
        loadLineages,
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
      overflow-y-auto
      space-y-3
      pr-2
      "
    >

      {lineages.length === 0 && (

        <div className="text-sm text-slate-500">
          No lineage data available yet.
        </div>

      )}

      {lineages.map(
        (
          lineage,
          index
        ) => (

          <div
            key={lineage.organism_id}
            className="
            rounded-lg
            border
            border-slate-800
            bg-slate-900
            p-3
            "
          >

            <div
              className="
              mb-2
              flex
              items-center
              justify-between
              "
            >

              <span
                className="
                text-xs
                text-cyan-400
                "
              >
                #{index + 1}
              </span>

              <span
                className="
                text-xs
                text-slate-500
                "
              >
                Family
              </span>

            </div>

            <div
              className="
              mb-3
              break-all
              font-mono
              text-xs
              text-slate-300
              "
            >
              {lineage.organism_id}
            </div>

            <div
              className="
              grid
              grid-cols-2
              gap-3
              text-sm
              "
            >

              <div>

                <div className="text-slate-500">
                  Children
                </div>

                <div className="font-semibold text-emerald-400">
                  {lineage.children}
                </div>

              </div>

              <div>

                <div className="text-slate-500">
                  Descendants
                </div>

                <div className="font-semibold text-amber-400">
                  {lineage.descendants}
                </div>

              </div>

            </div>

          </div>

        )
      )}

    </div>
  );
}