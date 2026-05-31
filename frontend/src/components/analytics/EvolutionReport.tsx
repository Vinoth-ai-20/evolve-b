import { useEffect, useState } from "react";

import axios from "axios";

interface Milestone {
  tick: number;
  message: string;
}

interface Report {

  population_trend: string;

  diversity_trend: string;

  species_trend: string;

  dominant_strategy: string;

  findings: string[];

  recent_milestones: Milestone[];
}

export default function EvolutionReport() {

  const [report, setReport] =
    useState<Report | null>(
      null
    );

  useEffect(() => {

    const loadReport =
      async () => {

        try {

          const response =
            await axios.get<Report>(
              "http://localhost:8000/api/reports/"
            );

          setReport(
            response.data
          );

        } catch (error) {

          console.error(
            "Report fetch failed",
            error
          );

        }
      };

    loadReport();

    const interval =
      setInterval(
        loadReport,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  if (!report) {

    return (
      <div className="text-sm text-slate-500">
        Loading evolution report...
      </div>
    );
  }

  return (
    <div
      className="
      space-y-5
      text-sm
      "
    >

      <div>

        <div className="mb-2 font-semibold text-cyan-400">
          Ecosystem Trends
        </div>

        <div className="space-y-1">

          <div className="flex justify-between">
            <span>
              Population
            </span>

            <span className="font-semibold">
              {report.population_trend}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Diversity
            </span>

            <span className="font-semibold">
              {report.diversity_trend}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Species Count
            </span>

            <span className="font-semibold">
              {report.species_trend}
            </span>
          </div>

        </div>

      </div>

      <div>

        <div className="mb-2 font-semibold text-purple-400">
          Dominant Strategy
        </div>

        <div
          className="
          rounded-lg
          border
          border-slate-800
          bg-slate-900
          p-3
          "
        >
          {report.dominant_strategy}
        </div>

      </div>

      <div>

        <div className="mb-2 font-semibold text-emerald-400">
          Key Findings
        </div>

        <div className="space-y-2">

          {report.findings.map(
            (
              finding,
              index
            ) => (

              <div
                key={index}
                className="
                rounded-lg
                border
                border-slate-800
                bg-slate-900
                p-3
                "
              >
                • {finding}
              </div>

            )
          )}

        </div>

      </div>

      <div>

        <div className="mb-2 font-semibold text-amber-400">
          Recent Milestones
        </div>

        <div className="space-y-2">

          {report.recent_milestones.length === 0 && (

            <div className="text-slate-500">
              No milestones recorded.
            </div>

          )}

          {report.recent_milestones.map(
            (
              milestone,
              index
            ) => (

              <div
                key={index}
                className="
      rounded-lg
      border
      border-slate-800
      bg-slate-900
      p-3
      "
              >

                <div className="text-xs text-amber-400">
                  Tick {milestone.tick}
                </div>

                <div className="mt-1">
                  {milestone.message}
                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}