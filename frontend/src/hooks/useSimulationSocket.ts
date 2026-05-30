import { useEffect } from "react";

import { connectSimulation } from "../websocket/simulationSocket";

export function useSimulationSocket() {
  useEffect(() => {
    connectSimulation();
  }, []);
}