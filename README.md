# Evolve-B

Realtime scientific evolutionary ecosystem simulation platform with live visualization and analytics.

## Features

- **Realtime Ecosystem Simulation** - Watch evolution in action with 250+ organisms
- **Genetics & Inheritance** - Full genetic system with mutation, recombination, and phenotype generation
- **Environmental Pressure** - Temperature, humidity, and resource dynamics affect survival
- **Natural Selection** - Organisms survive based on fitness (energy, age, reproduction)
- **Species Tracking** - Dynamic species classification based on genetic traits
- **WebSocket Streaming** - Live updates with automatic reconnection
- **Analytics Dashboards** - Population, fitness, diversity, and trophic level charts
- **Organism Inspector** - Inspect individual organism traits and genetics
- **Export Functionality** - Export population data as CSV or JSON

## Architecture

### Backend Stack

- **Framework**: FastAPI with async/await
- **Biology**: Custom simulation engine with genetics, ecology, and evolution
- **Real-time**: WebSocket streaming, event broadcasting
- **Data**: In-memory deques for history tracking

### Frontend Stack

- **Framework**: React 19 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Visualization**: Canvas 2D rendering + Recharts
- **Real-time**: WebSocket client with auto-reconnection

## Quick Start

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
& .\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn app.main:app --reload
# Server runs on http://localhost:8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

## Key Components

### Simulation Engine

- **Tick**: 30 Hz update rate
- **Organisms**: 250+ individuals with full genetics
- **Traits**: Size, speed, metabolism, lifespan, fertility, vision, camouflage
- **Selection**: Natural selection through energy/age-based mortality

### Genetics

- **Genome**: 11 traits per organism
- **Mutation**: 8% per trait with ±15% magnitude
- **Inheritance**: Single-parent with mutation or two-parent recombination
- **Diet**: Herbivore, Carnivore, Omnivore with environmental trade-offs

### Environment

- **Resources**: Renewable plant-like resources in grid cells
- **Biomes**: Desert, Tundra, Rainforest, Volcanic with different temperatures
- **Pressure**: Organisms stress if temperature tolerance doesn't match biome
- **Regeneration**: Resource regeneration at 0.05x per tick

### Analytics

- **Population History**: Track population changes over 10,000 ticks
- **Genetic Diversity**: Shannon entropy of genome variation
- **Fitness Tracking**: Average organism fitness (25% age + 25% energy + 35% reproduction + 15% adaptation)
- **Species Classification**: Dynamic grouping by similar traits

## Configuration

Edit `backend/app/core/config.py`:

- `WORLD_WIDTH/HEIGHT`: 2000 units (500x500 grid cells)
- `INITIAL_POPULATION`: 250 organisms
- `SIMULATION_TICK_RATE`: 30 Hz
- `RESOURCE_REGEN_RATE`: 0.05 per tick

## API Endpoints

### Simulation Control

- `POST /api/simulation/start` - Start simulation
- `POST /api/simulation/pause` - Pause simulation
- `POST /api/simulation/resume` - Resume simulation
- `POST /api/simulation/reset` - Reset to initial state
- `GET /api/simulation/state` - Get current state
- `POST /api/simulation/speed` - Set simulation speed (0.1x - 20x)

### API Analytics

- `GET /api/analytics/stats` - Population and diversity stats
- `GET /api/analytics/history` - Population and diversity history
- `GET /api/analytics/fitness` - Fitness history over time
- `GET /api/analytics/traits` - Average traits in population

### Species & Export

- `GET /api/species/` - List current species
- `GET /api/export/csv` - Download population as CSV
- `GET /api/export/json` - Download simulation state as JSON

### WebSocket

- `WS /ws/stream` - Subscribe to realtime simulation state updates

## Testing

Run backend tests:

```bash
cd backend
python -m pytest tests/ -v
```

All tests pass (7/7):

- Diversity calculation
- Genome creation
- Mutation logic
- Reproduction
- Spatial grid
- Species tracking
- Trait analysis

## Performance

- **Rendering**: 60 FPS canvas with 300 visible organisms
- **Network**: ~30 updates/sec, 50-200 KB/sec per client
- **Simulation**: 30 Hz, ~10ms per tick with 250 organisms
- **Memory**: ~50 MB for simulation + 100 MB for history

## Scientific Accuracy

The simulation implements realistic evolutionary dynamics:

1. **Genetic Variation**: Mutations introduce heritable changes
2. **Natural Selection**: Fitness affects reproduction probability (0.05x fertility)
3. **Environmental Pressure**: Temperature mismatch causes stress (−0.15 energy/tick)
4. **Resource Competition**: Limited resources create carrying capacity pressure
5. **Reproduction Cost**: Energy cost prevents infinite growth
6. **Lifespan**: Age-based mortality prevents population imbalance

## Project Structure

```bash
backend/
  app/
    analytics/      # Metrics collection and tracking
    api/           # REST API routes and WebSocket
    core/          # Configuration and logging
    ecology/       # Predator-prey interactions
    environment/   # Biome, climate, resources
    evolution/     # Fitness and selection
    genetics/      # Genome, mutation, inheritance
    models/        # Simulation state models
    schemas/       # Pydantic request/response schemas
    services/      # WebSocket manager, serializers
    simulation/    # Core simulation engine
    storage/       # Persistence layer
  tests/           # Pytest unit tests

frontend/
  src/
    api/          # HTTP clients
    components/   # React components (ui, analytics, simulation)
    hooks/        # Custom React hooks
    pages/        # Page components
    store/        # Zustand state management
    types/        # TypeScript type definitions
    websocket/    # WebSocket client
```

## Known Limitations & Future Work

- Simulation is CPU-bound; optimization via multi-threading possible
- Canvas rendering optimized for ~300 organisms; higher populations need LOD
- Species classification fragile; should use clustering algorithms
- No predator-prey complex yet (infrastructure exists)
- No genetic visualization (phylogenetic trees)
- Export limited to CSV/JSON; database persistence not implemented

## Contributing

Areas for improvement:

1. Add genetic visualization UI
2. Implement proper phylogenetic tree rendering
3. Add machine learning to analyze evolution strategies
4. Implement terrain and spatial heterogeneity
5. Add advanced filtering and statistics UI
6. Performance optimization for 1000+ organisms

## License

MIT

## Research Notice

Evolve-B is an open-source research and educational project exploring evolutionary dynamics, ecosystem simulation, and AI-assisted software development.

This repository may contain code generated or assisted by AI systems including ChatGPT and Claude. The project serves as an experimental platform for evaluating AI-assisted scientific software engineering workflows and ecosystem simulation techniques.
