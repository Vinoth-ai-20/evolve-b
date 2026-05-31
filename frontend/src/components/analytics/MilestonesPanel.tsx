import { useEffect, useState } from "react";
import axios from "axios";

interface Milestone {
  tick: number;
  message: string;
}

export default function MilestonesPanel() {

  const [milestones, setMilestones] =
    useState<Milestone[]>([]);

  useEffect(() => {

    const loadMilestones =
      async () => {

        try {

          const response =
            await axios.get<Milestone[]>(
              "http://localhost:8000/api/milestones/"
            );

          setMilestones(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );

        }
      };

    loadMilestones();

    const interval =
      setInterval(
        loadMilestones,
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

      {milestones.length === 0 && (
        <div className="text-sm text-slate-500">
          No milestones reached yet.
        </div>
      )}

      {milestones.map(
        (
          milestone,
          index,
        ) => (

          <div
            key={index}
            className="
            rounded-lg
            border
            border-cyan-900/40
            bg-slate-900
            p-3
            "
          >

            <div className="text-xs text-cyan-400">
              Tick {milestone.tick}
            </div>

            <div className="mt-1 text-sm">
              {milestone.message}
            </div>

          </div>

        )
      )}

    </div>
  );
}