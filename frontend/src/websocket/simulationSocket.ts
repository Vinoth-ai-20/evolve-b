import { useSimulationStore } from "../store/simulationStore";
import type { SimulationState } from "../types/simulation";

let socket: WebSocket | null = null;

let reconnectAttempts = 0;

let lastChartUpdate = 0;

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
      "✓ WebSocket Connected"
    );

    reconnectAttempts = 0;
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

    const store =
      useSimulationStore.getState();

    store.setState(
      data as SimulationState
    );

    const now =
      Date.now();

    if (
      now -
      lastChartUpdate >
      CHART_UPDATE_INTERVAL
    ) {

      lastChartUpdate =
        now;

      store.addPopulationPoint({
        tick: now,
        value:
          data.population,
      });
    }
  };

  socket.onclose = () => {

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