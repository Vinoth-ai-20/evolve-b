export interface Organism {
  id: string;
  x: number;
  y: number;
  energy: number;
  age: number;
  generation: number;
  alive: boolean;
  radius: number;
  color: [number, number, number];
  speed: number;
  density: number;
  food_visible: boolean;
  fitness: number;
  children: number;
  diet_type: "herbivore" | "carnivore" | "omnivore";
  kills: number;
}