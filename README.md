# Evolve-B

> A scientific artificial life laboratory for studying evolution, ecology, emergent intelligence, and adaptive behavior in realtime.

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-v0.2.0--alpha1-blue)
![Frontend](https://img.shields.io/badge/frontend-React%2019-61dafb)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Vision

Evolve-B is an experimental ecosystem simulation platform designed to explore:

* Evolutionary dynamics
* Artificial life
* Ecology and population systems
* Emergent behavior
* Neural evolution
* Multi-agent intelligence
* Reinforcement learning environments
* Computational biology education

The long-term goal is to create a scientific sandbox where thousands of organisms evolve, compete, cooperate, learn, and adapt inside a living ecosystem.

---

## Current State (v0.2.0-alpha1)

### Simulation Core

* Real-time ecosystem simulation
* Genetic inheritance and mutation
* Species emergence
* Predator-prey interactions
* Disease propagation
* Environmental pressure
* Climate events
* Resource competition
* Carrying capacity control
* Dynamic trophic structures

### Visualization

* PixiJS accelerated rendering
* Infinite camera navigation
* Organism selection and tracking
* Heatmaps

  * Population density
  * Resource distribution
* Live organism inspection
* Evolution analytics dashboard

### Evolution Systems

* Genome recombination
* Mutation engine
* Fitness calculation
* Natural selection
* Lineage tracking
* Species classification
* Extinction tracking
* Evolution milestones

### Research Analytics

* Population dynamics
* Genetic diversity
* Evolution score
* Apex predator tracking
* Species dominance analysis
* Phylogenetic tree visualization
* Ecosystem event timeline

---

## Performance

Current optimization status:

| Metric               | Value                         |
| -------------------- | ----------------------------- |
| Population           | 250-300 organisms             |
| Simulation Tick Rate | 30 TPS                        |
| Rendering            | 60 FPS                        |
| Organism Update Time | ~55 ms                        |
| Broadcast Time       | ~8 ms                         |
| Backend Improvement  | 43x faster than initial build |

Recent optimizations:

* Spatial partitioning
* Viewport culling
* Graphics pooling
* Reduced sensing complexity
* Cached food search
* Optimized density calculations
* Performance profiling framework

---

## Technology Stack

### Backend

* FastAPI
* Python
* NumPy
* WebSockets
* AsyncIO

### Frontend

* React 19
* TypeScript
* Zustand
* PixiJS
* Tailwind CSS

### Future Technologies

* PyTorch
* CUDA
* Multi-processing
* Tauri
* WebGPU
* Reinforcement Learning Frameworks

---

## Project Architecture

```text
Frontend
 ├─ Pixi Renderer
 ├─ Analytics Dashboard
 ├─ Inspector System
 ├─ Camera System
 └─ Realtime WebSocket Client

Backend
 ├─ Simulation Engine
 ├─ Genetics Engine
 ├─ Ecology Systems
 ├─ Environment Systems
 ├─ Analytics Pipeline
 ├─ Performance Profiler
 └─ State Broadcaster
```

---

## Running Locally

### Backend_

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Server:

```text
http://localhost:8000
```

### Frontend_

```bash
cd frontend

npm install

npm run dev
```

Application:

```text
http://localhost:5173
```

---

## Roadmap

### v0.2.x

Performance & Simulation Quality

* Motion interpolation
* Smooth rendering
* Tick scheduler improvements
* Better heatmaps
* Organism tracking improvements
* Save / Load simulation

### v0.3

Neural Organisms

* Artificial neural networks
* Synapses and neurons
* Brain visualization panel
* Realtime neuron firing display
* Decision tracing

### v0.4

Biological Realism

* Photosynthesis
* Oxygen / CO₂ cycle
* Fungi networks
* Aerobic metabolism
* Anaerobic metabolism
* Food chains
* Ecosystem succession

### v0.5

Research Platform

* Experiment management
* Dataset export
* Statistical reports
* Reproducible simulations
* Academic publication support

### v0.6

High Performance Engine

* Multi-threaded simulation
* User-configurable CPU cores
* Parallel sensing
* Parallel reproduction
* Parallel environment updates

### v0.7

GPU Acceleration

* CUDA support
* PyTorch integration
* GPU-based neural evolution
* Reinforcement learning training

### v0.8

Desktop Application

Built using Tauri

* Windows
* Linux
* macOS

### v1.0

Artificial Life Laboratory

* Thousands of organisms
* Neural evolution
* Emergent intelligence
* Research-grade ecosystem simulation
* Educational visualization suite

---

## Research Goals

Evolve-B is being designed as a platform for:

* Evolutionary biology education
* Artificial life experiments
* Emergent behavior research
* Multi-agent systems research
* Evolutionary computation
* Neural evolution studies
* Reinforcement learning environments

Future academic publications generated from this project will focus on ecosystem simulation, emergent behavior, and AI-driven evolutionary systems.

---

## License

MIT License

---

## Author

Vinoth

Computer Science Engineer

Building a next-generation artificial life and evolution laboratory.
