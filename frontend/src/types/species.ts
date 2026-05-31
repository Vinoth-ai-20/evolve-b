export interface Species {
  species_id: string;

  count: number;

  avg_speed: number;
  avg_size: number;
  avg_metabolism: number;

  dominant_diet: string;
  color: string;

  dominant_traits: string[];

  avg_energy: number;
  avg_age: number;
  max_generation: number;
  population_share: number;
}