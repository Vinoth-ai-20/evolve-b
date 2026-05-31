import type { Organism } from "./organism";
import type { Environment } from "./environment";

export interface SimulationState {
  type: string;
  population: number;
  environment: Environment;
  organisms: Organism[];
  simulation_speed: number;
  world_width: number;
  world_height: number;
  trophic_levels: TrophicLevels;
}

export interface TrophicLevels {
  herbivore: number;
  carnivore: number;
  omnivore: number;
}