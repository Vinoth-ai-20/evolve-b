import { useSimulationStore } from "../store/simulationStore";
import type { SimulationState } from "../types/simulation";

let socket: WebSocket | null = null;

let reconnectAttempts = 0;

let lastChartUpdate = 0;

let pendingState: SimulationState | null = null;

let updateInterval: ReturnType<typeof setInterval> | null = null;

// Batch state updates to reduce React rerenders
// Update store at ~20Hz instead of on every message
const STATE_UPDATE_INTERVAL = 50; // ms (20 updates/sec)

const CHART_UPDATE_INTERVAL = 1000;

export function connectSimulation() {

  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    return;
  }

  socket = new WebSocket(
    "ws://localhost:8000/ws/stream"
  );

  socket.onopen = () => {

    console.log(
      "✓ WebSocket Connected (throttled updates: 20 Hz)"
    );

    reconnectAttempts = 0;

    // Start batch update loop
    updateInterval = setInterval(() => {
      if (pendingState) {
        const store = useSimulationStore.getState();
        store.setState(pendingState);
        pendingState = null;
      }
    }, STATE_UPDATE_INTERVAL);
  };

  socket.onmessage = (
    event
  ) => {

    const data =
      JSON.parse(
        event.data
      );

    if (
      data.type !==
      "simulation_state"
    ) {
      return;
    }

    // Store latest state for batch update
    pendingState = data as SimulationState;

    const now =
      Date.now();

    if (
      now -
      lastChartUpdate >
      CHART_UPDATE_INTERVAL
    ) {

      lastChartUpdate =
        now;

      const store =
        useSimulationStore.getState();

      store.addPopulationPoint({
        tick: now,
        value:
          data.population,
      });
    }
  };

  socket.onclose = () => {

    // Clear batch update interval
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }

    socket = null;

    if (
      reconnectAttempts < 5
    ) {

      reconnectAttempts++;

      setTimeout(
        connectSimulation,
        3000
      );
    }
  };
}