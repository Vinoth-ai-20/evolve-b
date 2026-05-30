import type { Organism } from "./organism";
import type { Environment } from "./environment";

export interface SimulationState {
  type: string;
  population: number;
  environment: Environment;
  organisms: Organism[];
  simulation_speed: number;
}