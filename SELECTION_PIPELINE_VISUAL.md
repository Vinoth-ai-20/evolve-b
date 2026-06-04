# Selection Pipeline - Visual & Mathematical Analysis

---

## Complete Selection Data Flow

```
CLICK EVENT (screen-space)
        │
        ├─ event.clientX = 450
        ├─ event.clientY = 300
        └─ Canvas: 800x600
        │
        ↓
COORDINATE CONVERSION (screen-space → world-space)
        │
        ├─ canvasX = 450 - 0 = 450
        ├─ canvasY = 300 - 0 = 300
        ├─ centerX = 800 / 2 = 400
        ├─ centerY = 600 / 2 = 300
        │
        ├─ worldX = camera.x + (450 - 400) / zoom
        │         = 5000 + 50 / 2
        │         = 5025
        │
        ├─ worldY = camera.y + (300 - 300) / zoom
        │         = 3000 + 0 / 2
        │         = 3000
        │
        └─ Result: World coordinate (5025, 3000)
        │
        ↓
HIT DETECTION (🔴 CRITICAL FIX APPLIED HERE)
        │
        ├─ screenClickTolerance = 15 pixels
        ├─ clickTolerance = 15 / zoom = 15 / 2 = 7.5 world-units ✅
        │
        │ Loop through 250 organisms:
        │   Organism A at (5000, 3000), radius 20
        │     distance = √((5025-5000)² + (3000-3000)²)
        │              = √(625 + 0)
        │              = 25
        │     hit_radius = 20 + 7.5 = 27.5
        │     HIT? 25 ≤ 27.5 = YES ✓
        │     closest_distance = 25
        │
        │   Organism B at (4900, 3000), radius 20
        │     distance = √((5025-4900)² + (3000-3000)²)
        │              = √(15625)
        │              = 125
        │     hit_radius = 20 + 7.5 = 27.5
        │     HIT? 125 ≤ 27.5 = NO
        │
        ├─ Selected: Organism A (closest hit)
        └─ Distance from click: 25 world-units
        │
        ↓
STORE STATE UPDATE
        │
        ├─ selectedOrganismId = "organism-A-id"
        ├─ Store notifies subscribers
        └─ Re-render queued
        │
        ↓
NEXT RENDER FRAME (60 FPS)
        │
        ├─ Hover Ring Rendering
        │  └─ getOrganismAtMouse(): check if mouse over unselected organism
        │     └─ if (hoverOrganism && not selected):
        │        └─ Draw orange circle at hoverOrganism with radius + 2
        │
        ├─ Selection Ring Rendering
        │  └─ Find selectedOrganismId in organisms array
        │     └─ Found? Draw double green ring
        │     └─ Not found? Log warning (organism dead)
        │
        ├─ Camera Follow (if enabled)
        │  └─ setCameraPosition(selectedOrg.x, selectedOrg.y)
        │
        └─ Result: Visual ring appears, inspector updates
        │
        ↓
SPECIES INSPECTOR UPDATE
        │
        ├─ useEffect triggered (selectedOrganismId changed)
        ├─ Log: [SpeciesInspector] ✓ Displaying organism
        └─ Display stats: Energy, Age, Fitness, etc.
```

---

## Mathematical Coordinate System Explanation

### Canvas & Screen Space

```
┌─────────────────────────────────────────┐
│ SCREEN/CANVAS SPACE (800x600)           │
│                                         │
│ (0,0)────────────────────────────────── │
│   │                                 │   │
│   │    MOUSE CLICK                  │   │
│   │    at (450, 300)                │   │
│   │         ↓                        │   │
│   │    Canvas Center                │   │
│   │    at (400, 300)                │   │
│   │                                 │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                              (800, 600)  │
└─────────────────────────────────────────┘
```

### World Space (After Transformation)

```
Transformation:
  canvasX = 450
  canvasY = 300
  centerX = 400
  centerY = 300
  camera.x = 5000
  camera.y = 3000
  zoom = 2.0

  worldX = 5000 + (450 - 400) / 2
         = 5000 + 50 / 2
         = 5000 + 25
         = 5025

  worldY = 3000 + (300 - 300) / 2
         = 3000 + 0 / 2
         = 3000

Result: World coordinates (5025, 3000)
```

### Click Tolerance Scaling

**The Critical Bug Fix**:

```
BEFORE (BROKEN):
  clickTolerance = 15 (constant, not scaled)

  At zoom = 2.0: tolerance = 15 world-units
                            = 7.5 pixels on screen ❌ HARD TO CLICK

  At zoom = 0.5: tolerance = 15 world-units
                           = 30 pixels on screen ❌ EASY TO MISCLICK

AFTER (FIXED):
  screenClickTolerance = 15 (constant on screen)
  clickTolerance = 15 / zoom (scales by zoom)

  At zoom = 2.0: tolerance = 15 / 2 = 7.5 world-units
                           = 15 pixels on screen ✅ CONSISTENT

  At zoom = 0.5: tolerance = 15 / 0.5 = 30 world-units
                           = 15 pixels on screen ✅ CONSISTENT

  At zoom = 1.0: tolerance = 15 / 1 = 15 world-units
                           = 15 pixels on screen ✅ CONSISTENT
```

### Distance Calculation

```
Two organisms in world space:

  Organism A at (5000, 3000), radius 20
  Organism B at (4950, 3050), radius 20
  Click at (5025, 3000)

Distance to A:
  d_A = √((5025 - 5000)² + (3000 - 3000)²)
      = √(25² + 0²)
      = √625
      = 25 world-units

Distance to B:
  d_B = √((5025 - 4950)² + (3000 - 3050)²)
      = √(75² + (-50)²)
      = √(5625 + 2500)
      = √8125
      ≈ 90.1 world-units

Hit Detection (with tolerance = 7.5):
  A: 25 ≤ (20 + 7.5) = 25 ≤ 27.5 = TRUE ✓ HIT
  B: 90.1 ≤ (20 + 7.5) = 90.1 ≤ 27.5 = FALSE

Selected: Organism A (closest)
```

---

## Visual Ring Rendering

### Selection Ring (Double Ring Effect)

```
Organism at (5000, 3000), radius 20

OUTER RING (Glow Effect):
  Center: (5000, 3000)
  Radius: 20 + 6 = 26
  Color: 0x00ff00 (green)
  Width: 1 pixel
  Alpha: 0.4 (40% opacity)

INNER RING (Main Indicator):
  Center: (5000, 3000)
  Radius: 20 + 4 = 24
  Color: 0x00ff00 (green)
  Width: 2 pixels
  Alpha: 1.0 (100% opacity)

Result:
  ╭─────────────────╮  ← Outer ring (faint glow)
  │                 │
  │  ╭───────────╮  │
  │  │           │  │
  │  │  ORG (20) │  │ ← Organism circle
  │  │           │  │
  │  ╰───────────╯  │ ← Inner ring (bright green)
  │                 │
  ╰─────────────────╯
```

### Hover Ring

```
When mouse over unselected organism:

  Center: organism.x
  Radius: organism.radius + 2
  Color: 0xffaa00 (orange)
  Width: 1 pixel
  Alpha: 0.6 (60% opacity)

Visual:
  ╭─────────────╮  ← Hover ring (orange)
  │             │
  │    ORG      │
  │             │
  ╰─────────────╯
```

---

## Console Output Flow

```
USER CLICKS ON ORGANISM
        ↓
[Selection] ===== CLICK EVENT =====
        ↓
[Selection] Canvas click position: {x: 450.0, y: 300.0, ...}
        ↓
[Selection] Hit test: {
  canvasClick: {x: 450.0, y: 300.0},
  worldPos: {x: 5025.0, y: 3000.0},
  camera: {x: 5000.0, y: 3000.0, zoom: 2.00},
  tolerance: 7.5,  ← 15 / 2.0 = 7.5 (SCALED!)
  organisms: 250
}
        ↓
[Selection] Hit organism: abc123... {
  distance: 25.0,
  radius: 20.0,
  hitRadius: 27.5  ← 20 + 7.5
}
        ↓
[Selection] Hit result: closest organism: abc123..., distance: 25.0
        ↓
[Selection] ✓ Selected organism: abc123... at {x: 5000.0, y: 3000.0}
        ↓
[Selection] Store state after selection: {selectedId: "abc123..."}
        ↓
[Selection] ===== END CLICK =====
        ↓
[SpeciesInspector] ✓ Displaying organism: abc123...
        ↓
[Selection] Rendering selection ring for: abc123... at {x: 5000.0, y: 3000.0, radius: 20.0}
        ↓
✅ SELECTION COMPLETE
```

---

## Algorithm Pseudocode

### Main Selection Algorithm

```
function handleCanvasClick(event):
  if dragging:
    return  // Ignore clicks while panning

  // Convert screen → world coordinates
  canvasX = event.clientX - canvasRect.left
  canvasY = event.clientY - canvasRect.top

  centerX = canvas.width / 2
  centerY = canvas.height / 2

  worldX = camera.x + (canvasX - centerX) / zoom
  worldY = camera.y + (canvasY - centerY) / zoom

  // Find organism at click position
  organism = getOrganismAtPoint(canvasX, canvasY)

  if organism:
    store.setSelectedOrganism(organism.id)
  else:
    store.setSelectedOrganism(null)
```

### Hit Detection Algorithm

```
function getOrganismAtPoint(canvasX, canvasY):
  // Convert to world space
  worldX = camera.x + (canvasX - canvas.width/2) / zoom
  worldY = camera.y + (canvasY - canvas.height/2) / zoom

  // Calculate tolerance (CRITICAL FIX)
  screenTolerance = 15 pixels
  worldTolerance = screenTolerance / zoom  ← NOW SCALES!

  closestOrganism = null
  closestDistance = INFINITY

  for each organism in organisms:
    // Calculate distance
    distance = sqrt((worldX - organism.x)² + (worldY - organism.y)²)

    // Check if within hit radius
    hitRadius = organism.radius + worldTolerance

    if distance <= hitRadius:
      // Track closest organism
      if distance < closestDistance:
        closestOrganism = organism
        closestDistance = distance

  return closestOrganism
```

### Rendering Algorithm

```
function tick():
  // Hover ring (under cursor)
  hoverRing.clear()
  hoverOrganism = getOrganismAtMouse()
  if hoverOrganism and not selected:
    draw circle at (hoverOrganism.x, hoverOrganism.y)
            radius hoverOrganism.radius + 2
            color 0xffaa00 (orange)

  // Selection ring
  selectionRing.clear()
  if selectedOrganismId:
    selectedOrg = find organism by selectedOrganismId
    if selectedOrg:
      // Outer ring (glow)
      draw circle at (selectedOrg.x, selectedOrg.y)
              radius selectedOrg.radius + 6
              color 0x00ff00, width 1, alpha 0.4

      // Inner ring
      draw circle at (selectedOrg.x, selectedOrg.y)
              radius selectedOrg.radius + 4
              color 0x00ff00, width 2, alpha 1.0

      // Camera follow
      if followSelected:
        camera.position = selectedOrg.position
    else:
      log warning "Organism not found"
```

---

## State Transition Diagram

```
                    ┌─────────────────┐
                    │  NO SELECTION   │
                    │ selectedId=null │
                    └────────┬────────┘
                             │
                Click on      │      Click on
              organism A      │     empty space
                    ↓         │         ↑
          ┌──────────────────────────┐ │
          │  SELECTION: ORG A        │ │
          │ selectedId="org-a-id"    │─┘
          └──────────────────────────┘
                    │         △
                    │         │
            Click   │         │  Click
          on org B  │         │  on org B
                    ↓         │
          ┌──────────────────────────┐
          │  SELECTION: ORG B        │
          │ selectedId="org-b-id"    │
          └──────────────────────────┘

At each state transition:
  1. Store updates selectedOrganismId
  2. Component re-renders
  3. Selection ring moves/disappears
  4. Inspector updates
  5. Console logs transition
```

---

## Performance Analysis

### Hit Test Complexity
```
for each click:
  for each of N organisms:
    calculate distance: O(1)
    compare to radius: O(1)

  Total: O(N)

  With N=250: ~250 operations
  Time: <1ms on modern hardware
```

### Rendering Complexity
```
per frame (60 FPS = 16.6ms per frame):
  hover ring rendering: O(1)
  selection ring rendering: O(1)
  both use pre-allocated graphics objects

  Total overhead: negligible (<1% of frame time)
```

### Memory Usage
```
Additional allocations: NONE
Graphics reused from pool
Total memory impact: negligible
```

---

## Conclusion

The organism selection system uses:
- **Accurate coordinate transformations** (screen → world)
- **Zoom-scaled hit detection** (tolerance / zoom)
- **Efficient hit testing** (O(N) where N ≈ 250)
- **Visual feedback** (hover + selection rings)
- **Comprehensive diagnostics** (console logging)

Result: **Reliable, fast, and user-friendly organism selection at any zoom level.**

