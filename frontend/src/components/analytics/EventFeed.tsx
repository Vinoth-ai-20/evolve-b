import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
  tick: number;
  type: string;
  message: string;
}

export default function EventFeed() {

  const [events, setEvents] =
    useState<Event[]>([]);

  useEffect(() => {

    const loadEvents =
      async () => {

        try {

          const response =
            await axios.get<Event[]>(
              "http://localhost:8000/api/events/"
            );

          setEvents(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );

        }
      };

    loadEvents();

    const interval =
      setInterval(
        loadEvents,
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
    h-72
    overflow-y-auto
    space-y-2
    pr-2
    "
    >

      {events.length === 0 && (
        <div className="text-sm text-slate-500">
          No ecosystem events yet.
        </div>
      )}

      {events.map(
        (
          event,
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

            <div className="text-xs text-slate-500">
              Tick {event.tick}
            </div>

            <div className="mt-1 text-sm">
              {event.message}
            </div>

          </div>

        )
      )}

    </div>
  );
}