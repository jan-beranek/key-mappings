## Context

The sidebar tree displays a 3-level hierarchy: trigger keys (level 0) → sublayers + direct bindings (level 1) → sublayer bindings (level 2). All interactions are currently click-based. The app is vanilla JavaScript with no framework dependencies, using native `EventTarget` for store events and full re-render on every store change.

The config store (`ConfigStore`) holds bindings in two arrays per trigger: `directBindings[]` for hyper-only bindings and `sublayers[].bindings[]` for sublayer bindings. There is no existing move or reorder API.

## Goals / Non-Goals

**Goals:**
- Enable drag & drop of binding leaf nodes to reorder within the same layer
- Enable drag & drop of binding leaf nodes onto a different parent (trigger node for direct, sublayer node for sublayer) to move between layers
- Update config store atomically so serialization reflects the new structure
- Provide clear visual feedback during drag (drop indicators, valid/invalid zones)

**Non-Goals:**
- Dragging sublayer nodes (reordering sublayers or moving sublayers between triggers) — out of scope
- Dragging trigger key nodes — triggers are fixed (caps_lock, tab)
- Touch/mobile drag support — this is a desktop-oriented tool
- Undo/redo for drag operations — no undo system exists today

## Decisions

### 1. Use native HTML5 Drag and Drop API

**Rationale**: No framework dependencies to match. The native API provides `dragstart`, `dragover`, `dragenter`, `dragleave`, `drop` events which are sufficient. The tree is fully re-rendered on store change, so we only need to set up drag attributes during render — no persistent event listener cleanup needed.

**Alternative considered**: A library like SortableJS. Rejected because it adds a dependency for a feature achievable with native APIs, and the tree's full-rerender pattern makes library state management awkward.

### 2. Drag data encoding via `dataTransfer`

On `dragstart`, encode the binding's identity as JSON in `dataTransfer`:
```json
{ "triggerKey": "caps_lock", "sublayerKey": "o" | null, "bindingKey": "s" }
```

This lets the drop handler identify the source binding regardless of where it's dropped. Use MIME type `application/json` to avoid conflicts.

### 3. Drop zones: two modes distinguished by drop target

- **Reorder within same parent**: Drop on another binding leaf node within the same parent → insert before/after based on cursor position (top/bottom half detection).
- **Reparent to different layer**: Drop on a trigger node (level 0) → move to direct bindings. Drop on a sublayer node (level 1) → move into that sublayer's bindings.

The drop handler checks: if the target parent matches the source parent, it's a reorder. Otherwise, it's a reparent (move).

### 4. Store methods: `moveBinding()` and `reorderBinding()`

Two new methods on `ConfigStore`:

- `moveBinding(fromTrigger, fromSublayer, bindingKey, toTrigger, toSublayer)` — removes binding from source, adds to destination. Validates no key conflict at destination. Returns false if conflict.
- `reorderBinding(triggerKey, sublayerKey, bindingKey, newIndex)` — reorders a binding within its current array.

Both emit a single `change` event so the tree re-renders with the updated structure.

**Key conflict on move**: If the binding's key already exists in the destination layer, the move is rejected and a toast is shown. The user must rename the binding first.

### 5. Visual indicators via CSS classes

During drag, apply CSS classes dynamically:
- `.drag-over-above` / `.drag-over-below` on binding nodes → shows a horizontal insertion line
- `.drag-over-into` on trigger/sublayer nodes → highlights the node as a valid drop target
- `.dragging` on the source node → dims it during drag

These classes are toggled via `dragenter`/`dragleave`/`drop` handlers, not via re-render, to keep drag interactions smooth without triggering full re-renders mid-drag.

### 6. Only bindings are draggable, not sublayer nodes

Sublayer nodes represent structural containers. Dragging them would mean reordering `ruleSlots` and sublayer arrays, which is more complex and less commonly needed. This can be a future enhancement.

## Risks / Trade-offs

- **[Risk] Key conflicts on cross-layer move** → Mitigation: Validate destination before moving; show toast error "Key 'X' already exists in target layer" and cancel the drop.
- **[Risk] Full re-render clears drag state** → Mitigation: Drag visual indicators are applied via direct DOM manipulation (classList), not via the render cycle. The `drop` handler completes the store update which then triggers re-render only after the drag operation is done.
- **[Risk] `dragenter`/`dragleave` fire on child elements** → Mitigation: Use a reference-counting approach or check `e.currentTarget` vs `e.relatedTarget` to avoid flickering drop indicators.
- **[Trade-off] No cross-trigger moves (caps_lock ↔ tab)** → Allowing this would be valid but adds complexity. The drop handler will support it since `moveBinding` takes both trigger keys, but the UI won't prominently afford it (user must expand both triggers and drop across). This keeps it simple.
