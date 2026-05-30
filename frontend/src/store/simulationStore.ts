import { create } from "zustand";
import type { SimulationState } from "../types/simulation";

export interface ChartPoint {
  tick: number;
  value: number;
}

interface SimulationStore {
  state: SimulationState | null;
  populationHistory: ChartPoint[];

  setState: (state: SimulationState) => void;
  addPopulationPoint: (point: ChartPoint) => void;
}

export const useSimulationStore =
  create<SimulationStore>((set) => ({
    state: null,

    populationHistory: [],

    setState: (
      state: SimulationState
    ) =>
      set(
        (current) => {

          if (
            current.state === state
          ) {
            return current;
          }

          return {
            state,
          };
        }
      ),

    addPopulationPoint: (point: ChartPoint) =>
      set((store) => ({
        populationHistory: [
          ...store.populationHistory,
          point,
        ].slice(-500),
      })),
  }));