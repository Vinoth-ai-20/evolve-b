import type { Organism } from "./organism";
import type { Environment } from "./environment";

export interface DominantSpecies {
  population: number;
  share: number;
  diet: string;
  traits: string[];
  average_energy: number;
  average_age: number;
  max_generation: number;
}

export interface SimulationState {
  type: string;
  population: number;
  environment: Environment;
  organisms: Organism[];
  simulation_speed: number;
  world_width: number;
  world_height: number;
  species_count: number;
  trophic_levels: TrophicLevels;
  evolution_score: number;
  dominant_species: DominantSpecies | null;
  resource_grid: number[][];
  diversity: number;
  average_generation: number;
  ecosystem_health: string;
}

export interface TrophicLevels {
  herbivore: number;
  carnivore: number;
  omnivore: number;
}
