import { create } from "zustand";
import type { SimulationState } from "../types/simulation";

export interface ChartPoint {
  tick: number;
  value: number;
}

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

interface SimulationStore {
  state: SimulationState | null;

  populationHistory: ChartPoint[];

  selectedOrganismId: string | null;
  followSelected: boolean;
  heatmapMode:
  | "none"
  | "population"
  | "resources"
  | "predators";

  tickInterval: number;

  fps: number;

  setFps: (fps: number) => void;

  toggleFollowSelected: () => void;

  setState: (state: SimulationState) => void;
  camera: CameraState;

  addPopulationPoint: (
    point: ChartPoint
  ) => void;

  setSelectedOrganism: (
    id: string | null
  ) => void;

  setZoom: (
    zoom: number
  ) => void;

  zoomIn: () => void;

  zoomOut: () => void;

  resetZoom: () => void;

  setCameraPosition: (
    x: number,
    y: number
  ) => void;

  setZoomAndCamera: (
    zoom: number,
    x: number,
    y: number
  ) => void;
  setHeatmapMode: (
    mode:
      | "none"
      | "population"
      | "resources"
      | "predators"
  ) => void;

  setTickInterval: (ms: number) => void;
}

export const useSimulationStore =
  create<SimulationStore>((set) => ({
    state: null,

    populationHistory: [],

    selectedOrganismId: null,

    camera: {
      x: 0,
      y: 0,
      zoom: 1,
    },

    followSelected: false,
    heatmapMode: "none",
    tickInterval: 50,
    fps: 0,

    setFps: (fps) =>
      set({
        fps,
      }),

    setTickInterval: (ms) =>
      set({
        tickInterval: ms,
      }),

    setHeatmapMode: (
      mode
    ) =>
      set({
        heatmapMode: mode,
      }),

    toggleFollowSelected: () =>
      set((state) => ({
        ...state,
        followSelected:
          !state.followSelected,
      })),

    setCameraPosition: (
      x,
      y
    ) =>
      set((state) => ({
        ...state,
        camera: {
          ...state.camera,
          x,
          y,
        },
      })),

    setZoom: (zoom) =>
      set((state) => ({
        ...state,
        camera: {
          zoom,
          x: state.camera.x,
          y: state.camera.y,
        },
      })),

    zoomIn: () =>
      set((state) => ({
        ...state,
        camera: {
          zoom:
            Math.min(
              state.camera.zoom * 1.2,
              10,
            ),
          x: state.camera.x,
          y: state.camera.y,
        },
      })),

    zoomOut: () =>
      set((state) => ({
        ...state,
        camera: {
          zoom:
            Math.max(
              state.camera.zoom / 1.2,
              0.25,
            ),
          x: state.camera.x,
          y: state.camera.y,
        },
      })),

    resetZoom: () =>
      set((state) => ({
        ...state,
        camera: {
          zoom: 1,
          x: state.camera.x,
          y: state.camera.y,
        },
      })),

    setZoomAndCamera: (zoom, x, y) =>
      set((state) => ({
        ...state,
        camera: {
          zoom,
          x,
          y,
        },
      })),

    setState: (
      state: SimulationState
    ) =>
      set((current) => {
        if (
          current.state === state
        ) {
          return current;
        }

        return {
          ...current,
          state,
        };
      }),

    addPopulationPoint: (
      point: ChartPoint
    ) =>
      set((store) => ({
        populationHistory: [
          ...store.populationHistory,
          point,
        ].slice(-500),
      })),

    setSelectedOrganism: (
      id: string | null
    ) =>
      set({
        selectedOrganismId: id,
      }),
  }));