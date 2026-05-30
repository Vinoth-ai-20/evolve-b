# API Specification

Base URL: `http://localhost:8000`

## Simulation Control

### POST /api/simulation/start

Start the simulation from paused or initial state.

**Request:**

```bash
POST /api/simulation/start
```

**Response:** `200 OK`

```json
{
  "status": "running",
  "message": "Simulation started"
}
```

### POST /api/simulation/pause

Pause the running simulation (can be resumed later).

**Request:**

```bash
POST /api/simulation/pause
```

**Response:** `200 OK`

```json
{
  "status": "paused",
  "message": "Simulation paused"
}
```

### POST /api/simulation/resume

Resume a paused simulation.

**Request:**

```bash
POST /api/simulation/resume
```

**Response:** `200 OK`

```json
{
  "status": "running",
  "message": "Simulation resumed"
}
```

### POST /api/simulation/reset

Reset simulation to initial state with a new random population.

**Request:**

```bash
POST /api/simulation/reset
```

**Response:** `200 OK`

```json
{
  "status": "paused",
  "message": "Simulation reset to initial state"
}
```

### GET /api/simulation/state

Get the current simulation state (current tick snapshot).

**Request:**

```bash
GET /api/simulation/state
```

**Response:** `200 OK`

```json
{
  "tick_count": 1250,
  "organisms": [
    {
      "id": "org-abc123",
      "x": 500,
      "y": 600,
      "energy": 45.2,
      "age": 150,
      "generation": 3,
      "radius": 5.2,
      "speed": 8.5,
      "color": "#22c55e",
      "fitness": 0.72,
      "children": 2,
      "diet_type": "herbivore"
    }
  ],
  "environment": {
    "temperature": 22.5,
    "humidity": 65.0,
    "sunlight": 0.8
  },
  "simulation_speed": 1.0,
  "type": "simulation_state"
}
```

### POST /api/simulation/speed

Set simulation speed multiplier.

**Request:**

```bash
POST /api/simulation/speed
Content-Type: application/json

{
  "speed": 2.0
}
```

**Parameters:**

- `speed`: float, range [0.1, 20.0] (default: 1.0)

**Response:** `200 OK`

```json
{
  "status": "ok",
  "message": "Simulation speed set to 2.0x",
  "speed": 2.0
}
```

## Analytics

### GET /api/analytics/stats

Get current population and diversity statistics.

**Request:**

```bash
GET /api/analytics/stats
```

**Response:** `200 OK`

```json
{
  "population_count": 247,
  "diversity": 2.84,
  "average_fitness": 0.65,
  "average_age": 125.3,
  "average_energy": 42.1,
  "species_count": 8
}
```

### GET /api/analytics/history

Get population and diversity history.

**Request:**

```bash
GET /api/analytics/history
```

**Response:** `200 OK`

```json
{
  "population_history": [
    {"tick": 0, "count": 250},
    {"tick": 30, "count": 248},
    {"tick": 60, "count": 251}
  ],
  "diversity_history": [
    {"tick": 0, "diversity": 3.2},
    {"tick": 30, "diversity": 3.19},
    {"tick": 60, "diversity": 3.15}
  ]
}
```

### GET /api/analytics/fitness

Get average fitness history over time.

**Request:**

```bash
GET /api/analytics/fitness
```

**Response:** `200 OK`

```json
[
  {"tick": 0, "fitness": 0.55},
  {"tick": 30, "fitness": 0.58},
  {"tick": 60, "fitness": 0.61}
]
```

### GET /api/analytics/traits

Get average trait values in current population.

**Request:**

```bash
GET /api/analytics/traits
```

**Response:** `200 OK`

```json
{
  "average_size": 3.2,
  "average_speed": 8.5,
  "average_metabolism": 1.2,
  "average_lifespan": 500,
  "average_fertility": 0.15,
  "average_vision_range": 150,
  "average_camouflage": 0.4,
  "average_energy_efficiency": 0.8,
  "average_mutation_rate": 0.08,
  "average_maturity_age": 120
}
```

## Species

### GET /api/species/

Get all species with population statistics.

**Request:**

```bash
GET /api/species/
```

**Response:** `200 OK`

```json
[
  {
    "species_id": "species-001",
    "count": 42,
    "avg_speed": 8.3,
    "avg_size": 3.1,
    "avg_metabolism": 1.15
  },
  {
    "species_id": "species-002",
    "count": 35,
    "avg_speed": 7.9,
    "avg_size": 3.3,
    "avg_metabolism": 1.22
  }
]
```

## Export

### GET /api/export/csv

Download population data as CSV file.

**Request:**

```bash
GET /api/export/csv
```

**Response:** `200 OK` with file download

```bash
Content-Type: text/csv
Content-Disposition: attachment; filename="population.csv"

id,age,generation,energy,x,y,diet_type,speed,size,metabolism
org-001,125,3,45.2,500,600,herbivore,8.5,3.2,1.2
org-002,98,2,38.1,250,350,carnivore,9.2,2.8,1.3
...
```

### GET /api/export/json

Download simulation state as JSON file.

**Request:**

```bash
GET /api/export/json
```

**Response:** `200 OK` with file download

```bash
Content-Type: application/json
Content-Disposition: attachment; filename="simulation_state.json"

{
  "tick_count": 1250,
  "timestamp": "2026-05-30T15:30:00Z",
  "organisms": [
    {
      "id": "org-abc123",
      "age": 125,
      "generation": 3,
      "energy": 45.2,
      "x": 500,
      "y": 600,
      "diet_type": "herbivore",
      "fitness": 0.72,
      "children": 2,
      "traits": {
        "size": 3.2,
        "speed": 8.5,
        "metabolism": 1.2,
        ...
      }
    }
  ],
  "environment": {
    "temperature": 22.5,
    "humidity": 65.0,
    "sunlight": 0.8
  }
}
```

## WebSocket

### WS /ws/stream

Real-time simulation state streaming via WebSocket.

**Connection:**

```bash
WS ws://localhost:8000/ws/stream
```

**Message Format:**

```json
{
  "type": "simulation_state",
  "tick_count": 1250,
  "organisms": [
    {
      "id": "org-abc123",
      "x": 500,
      "y": 600,
      "energy": 45.2,
      "age": 150,
      "generation": 3,
      "radius": 5.2,
      "speed": 8.5,
      "color": "#22c55e",
      "fitness": 0.72,
      "children": 2,
      "diet_type": "herbivore"
    }
  ],
  "environment": {
    "temperature": 22.5,
    "humidity": 65.0,
    "sunlight": 0.8
  },
  "simulation_speed": 1.0
}
```

**Update Frequency:** 30 Hz (approximately every 33ms)

**Client Handling:**

- Connect on app load
- Auto-reconnect with exponential backoff if connection drops
- Render organisms and update charts on each message
- Maximum 300 organisms sent (sorted by energy for performance)

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Invalid request parameter"
}
```

### 404 Not Found

```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error. Check server logs."
}
```

## Rate Limiting

- WebSocket: Continuous streaming, no rate limit
- REST API: No explicit rate limit (suitable for single client)
- Production deployment should implement rate limiting

## Notes

1. **Simulation Speed**: Affects tick frequency. Speed 2.0 means ticks run at 60 Hz instead of 30 Hz.
2. **Organism Selection**: Top 300 organisms by energy are broadcast to minimize network bandwidth.
3. **Analytics Deque**: History stored for last 10,000 ticks (~333 seconds at 30 Hz).
4. **Export Format**: CSV is optimized for spreadsheet analysis, JSON preserves full simulation state.
5. **Timestamps**: All times are simulation time, not wall-clock time. Use tick_count for synchronization.
