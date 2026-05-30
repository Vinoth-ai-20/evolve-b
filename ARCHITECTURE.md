# Evolve-B Architecture

## System Overview

Evolve-B is a full-stack evolutionary simulation platform with real-time visualization and analytics.

```bash
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Frontend                      │
│  React + TypeScript + Zustand + Canvas + Recharts           │
│  - SimulationCanvas: 2D organism rendering                  │
│  - Analytics: Population, Fitness, Diversity charts         │
│  - Controls: Start, pause, reset, speed adjustment          │
│  - Inspector: Individual organism detail view               │
└────────────────────────────────────────────────────────────┘
                            │ WebSocket
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                          │
│  - Async event loop running simulation at 30 Hz             │
│  - WebSocket broadcasting: 300 organisms/tick               │
│  - REST API: Analytics, control, export endpoints           │
│  - In-memory history (population, fitness, diversity)       │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ Simulation │  │ Analytics  │  │ Environment│
    │   Engine   │  │   Trackers │  │   System   │
    └────────────┘  └────────────┘  └────────────┘

```

## Backend Architecture

### Core Simulation Engine (`simulation/engine.py`)

**Responsibilities:**

- Coordinate all simulation subsystems
- Execute organism update cycle: sensing → behavior → movement → reproduction → death
- Tick scheduler: runs at 30 Hz via asyncio.sleep(0.033)
- History tracking and analytics collection

**Main Loop:**

```python
async def tick():
    for organism in self.organisms:
        organism.sense()           # Gather environmental data
        organism.behave()          # Decide actions
        organism.move()            # Update position
        organism.reproduce()       # Create offspring

    # Natural mortality
    self.organisms = [o for o in organisms if o.alive]

    # Collect analytics
    history_tracker.add_population(len(organisms))
    fitness_tracker.add(average_fitness)
```

**Tick Rate:** 30 Hz (33ms per tick)
**Simulation Speed:** Configurable (0.1x to 20x)

### Simulation Manager (`simulation/simulation_manager.py`)

**Responsibilities:**

- Lifecycle management (start, pause, resume, reset)
- Task scheduling and cancellation
- State reset

**State Machine:**

```bash
[Initial] --start()--> [Running] <--pause()--
                          |              |
                          |         [Paused]
                          |           |
                          +---reset()--+
```

### Genetics System

**Genome Structure** (`genetics/genome.py`):

- 11 traits: size, speed, metabolism, lifespan, fertility, vision_range, camouflage, energy_efficiency, mutation_rate, diet_type, maturity_age
- Float values with genetic bounds

**Mutation** (`genetics/mutation.py`):

- 8% per-trait mutation rate (±15% magnitude)
- Diet type mutates separately at 2% rate
- Affects phenotypic expression

**Inheritance** (`genetics/inheritance.py`):

- Single-parent: copy + mutate
- Two-parent: recombine traits + mutate
- Both properly handle diet_type trait

**Phenotype** (`genetics/phenotype.py`):

- Traits expressed as organism behavior/appearance
- Radius derived from size trait
- Color derived from diet type

### Evolution System

**Fitness Calculation** (`evolution/fitness.py`):

```python
fitness = (
    age_factor * 0.25 +              # Longevity
    energy_factor * 0.25 +           # Health
    reproduction_factor * 0.35 +     # Reproductive success
    adaptation_factor * 0.15         # Environmental adaptation
)
```

**Selection** (`evolution/selection.py`):

- Fertility modulated by fitness (high fitness = higher reproduction rate)
- Low fitness = higher mortality risk

### Environment System

**Resources** (`environment/resources.py`):

- Grid-based with ~0.05 regeneration per tick
- Organisms consume energy to move/think
- Starvation leads to death

**Climate** (`environment/climate.py`):

- Temperature/humidity cycles
- Biome-specific patterns

**Biomes** (`environment/biome.py`):

- Desert: High temp, low resources
- Tundra: Low temp, high resources
- Rainforest: Moderate, high diversity
- Volcanic: High pressure, hot spots

**Pressure** (`environment/environmental_pressure.py`):

- Temperature stress: -0.15 energy/tick if tolerance mismatch

### Analytics System

**Trackers:**

- `HistoryTracker`: Population and diversity history (deque, max 10k ticks)
- `FitnessTracker`: Average fitness over time
- `SpeciesTracker`: Dynamic species grouping

**Metrics:**

- Population count
- Shannon entropy (genetic diversity)
- Average fitness
- Trophic level distribution (herbivore/carnivore/omnivore)

### State Broadcaster (`services/state_broadcaster.py`)

**Serialization Pipeline:**

1. Select top 300 organisms by energy
2. Serialize each: position, energy, age, traits, color, fitness
3. Include metadata: tick_count, simulation_speed
4. Send via WebSocket to all clients (broadcast)

**Optimization:**

- Only 300 organisms sent (not 500+) to reduce bandwidth
- Prioritized by energy (healthier organisms visible)
- Tick count for synchronization

### API Routes

**Simulation Control** (`api/routes/simulation.py`):

- `POST /api/simulation/start`
- `POST /api/simulation/pause`
- `POST /api/simulation/resume`
- `POST /api/simulation/reset`
- `GET /api/simulation/state` - Current snapshot
- `POST /api/simulation/speed` - Set speed (0.1x to 20x)

**Analytics** (`api/routes/analytics.py`):

- `GET /api/analytics/stats` - Population, diversity, avg fitness
- `GET /api/analytics/history` - Population/diversity over time
- `GET /api/analytics/fitness` - Fitness timeline
- `GET /api/analytics/traits` - Average trait values

**Species** (`api/routes/species.py`):

- `GET /api/species/` - List all species with population stats

**Export** (`api/routes/export.py`):

- `GET /api/export/csv` - Download population as CSV
- `GET /api/export/json` - Download simulation state as JSON

**WebSocket** (`api/websocket.py`):

- `WS /ws/stream` - Real-time simulation state updates

## Frontend Architecture

### State Management (`store/simulationStore.ts`)

Zustand store managing:

```typescript
{
  simulationState: SimulationState,        // Current tick state
  populationHistory: PopulationPoint[],    // 500-tick deque
  setState: (state) => void,              // Update from WebSocket
  addPopulationPoint: (point) => void     // Add analytics point
}
```

### WebSocket Client (`websocket/simulationSocket.ts`)

**Connection Strategy:**

- Exponential backoff reconnection (5 max attempts, 3s delay)
- Auto-reconnect on close
- Message parsing → store dispatch

**Flow:**

```bash
connect() → ws://localhost:8000/ws/stream
   ↓ (on message)
parse SimulationState
   ↓
store.setState(state)
   ↓
Components re-render
```

### Components

**SimulationCanvas** (`components/simulation/SimulationCanvas.tsx`):

- 2D canvas rendering of organisms
- Frame rate capped at 60 FPS via requestAnimationFrame
- Grid visualization (200-unit intervals)
- Depth sorting (smaller organisms render first)
- Stats overlay (population, temperature, rendering count)

**StatsDashboard** (`components/analytics/StatsDashboard.tsx`):

- Live metrics display
- Styled cards: population, temperature, humidity, sunlight, speed

**FitnessChart** (`components/analytics/FitnessChart.tsx`):

- Line chart of average fitness over time
- Polls `/api/analytics/fitness` every 5s
- Recharts visualization

**TrophicChart** (`components/analytics/TrophicChart.tsx`):

- Bar chart of diet distribution (herbivore/carnivore/omnivore)
- Updates when organisms change

**SpeciesInspector** (`components/inspector/SpeciesInspector.tsx`):

- Random organism selection
- Display: age, generation, energy, fitness, diet, position, speed/size/density

**SimulationControls** (`components/controls/SimulationControls.tsx`):

- Start/pause/resume/reset buttons
- Speed slider (0.1x to 20x)
- Preset buttons (0.5x, 1x, 2x, 5x, 10x)
- Error handling and loading states

**Dashboard** (`pages/Dashboard.tsx`):

- Master layout component
- Arranges all sections: header, simulation, analytics, controls

### Styling

- **Framework**: Tailwind CSS v4
- **Theme**: Dark slate (#020617 background)
- **Colors**: Emerald (health), Red (stress), Blue (info), Yellow (warning), Purple (accent)

## Data Flow

### Simulation Tick

```bash
1. Engine.tick() every 33ms
   ├─ Organism.sense() - gather inputs
   ├─ Organism.behave() - decision logic
   ├─ Organism.move() - physics update
   ├─ Organism.reproduce() - genetics, offspring creation
   └─ Natural death filtering

2. Analytics collection
   ├─ HistoryTracker.add_population()
   ├─ HistoryTracker.add_diversity()
   └─ FitnessTracker.add(avg_fitness)

3. State broadcast (every tick)
   ├─ Serialize top 300 organisms by energy
   ├─ Collect metadata (tick_count, simulation_speed)
   └─ WebSocket broadcast to all connected clients

4. Frontend rendering (every frame)
   ├─ WebSocket message received
   ├─ Store updates with new SimulationState
   ├─ Components re-render
   ├─ Canvas.draw() renders organisms
   └─ Charts update if subscribed
```

### Analytics Pipeline

```bash
Backend Tick:
  history_tracker → deque(population, diversity)
  fitness_tracker → deque(avg_fitness)

API:
  GET /api/analytics/stats → query dequeues, return summary
  GET /api/analytics/history → return population/diversity timeseries
  GET /api/analytics/fitness → return fitness timeseries

Frontend:
  FitnessChart polls /api/analytics/fitness every 5s
  Stores in Zustand populationHistory
  Charts subscribe to store updates
```

## Performance Characteristics

### Backend

- **Tick Time**: ~10ms per tick with 250 organisms
- **Memory**: ~50 MB for simulation + 100 MB for history (10k ticks)
- **Network**: ~30-50 KB per broadcast frame (300 organisms serialized)
- **Throughput**: 30 ticks/sec × 50 KB = 1.5 MB/sec for single client

### Frontend

- **Rendering**: 60 FPS max (capped by frame limiter)
- **Canvas**: Can render 500+ organisms at interactive speeds
- **Memory**: ~100 MB for state + canvas buffers
- **Bundle Size**: 607 KB (uncompressed), 185 KB (gzipped)

### Network

- **Bandwidth**: ~1.5 MB/sec per client at 30 Hz
- **Latency**: WebSocket maintains <100ms for state updates
- **Scalability**: ~20 concurrent clients on typical server

## Testing

**Unit Tests** (7 total, all passing):

- test_diversity.py - Shannon entropy calculation
- test_genetics.py - Genome creation
- test_mutation.py - Mutation application
- test_reproduction.py - Offspring generation
- test_spatial_grid.py - Grid insertion/queries
- test_species.py - Species tracking
- test_trait_analysis.py - Trait averaging

**Integration Points:**

- Backend API endpoints (manual testing)
- WebSocket connection and message format
- Frontend state synchronization
- Analytics data consistency

## Future Architecture Improvements

1. **Multi-threading**: Simulation tick in worker thread to reduce blocking
2. **Database**: Persist simulation history to MongoDB/PostgreSQL
3. **Distributed**: Redis for state sharing across multiple simulation instances
4. **Genetic Visualization**: Phylogenetic tree rendering
5. **Advanced Analytics**: ML-based evolution pattern detection
6. **Predator-Prey**: Full food web simulation (infrastructure exists)
7. **Terrain**: Spatial heterogeneity and elevation maps
