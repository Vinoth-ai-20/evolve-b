# Changelog

## [1.1.0] - 2026-05-30 - Production Ready Release

### Fixed (Critical)

- Fixed all TypeScript import syntax errors blocking frontend build
- Fixed SimulationManager.pause() memory leak (task not canceling)
- Fixed missing diet_type in genome inheritance and recombination
- Fixed analytics data loss - history_tracker now properly called
- Fixed predation occurring at wrong lifecycle point
- Removed duplicate imports in engine.py

### Added

- Async pause/resume/reset in SimulationManager with proper cleanup
- WebSocket reconnection with exponential backoff (up to 5 attempts)
- Proper type annotations for all API endpoints (Pydantic models)
- Export endpoints with file downloads (CSV and JSON)
- Improved fitness calculation (multi-factor scoring)
- Separate mutation rate for diet_type trait
- FitnessChart and TrophicChart components
- SimulationCanvas optimization with frame rate limiting
- Grid visualization in canvas
- SpeciesInspector with organism selection
- StatsDashboard with styled metric cards

### Improved

- Reduced broadcast payload (300 instead of 500 organisms)
- Canvas rendering efficiency (60 FPS cap)
- Overall UI consistency and polish
- Error handling throughout codebase
- API response types and documentation

### Changed

- Fitness now considers environmental adaptation
- Genome inheritance properly includes diet_type
- Export format includes more organism data

## Phase 2 (Previous)

- mutation engine implemented
- inheritance system implemented
- recombination support added
- lineage tracking added
- biome systems added
- environmental pressure added
- carrying capacity system added
- reproduction mechanics implemented
- climate cycle foundation added
- resource competition added

## Phase 3 (Previous)

- WebSocket realtime streaming added
- event bus implemented
- spatial partitioning added
- analytics endpoints added
- organism serialization added
- simulation snapshot system added
- realtime state broadcasting added
- diversity metrics added
- scalable synchronization foundation added
