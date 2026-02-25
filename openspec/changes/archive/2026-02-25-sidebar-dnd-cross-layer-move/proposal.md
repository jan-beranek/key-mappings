## Why

Currently, the left sidebar tree only supports click-based interactions for selecting and editing bindings. There is no way to reorder bindings within a layer or move a binding between layers (e.g., from a sublayer to direct bindings, or from one sublayer to another) without manually deleting and re-creating it. This makes reorganizing key mappings tedious, especially as configurations grow.

## What Changes

- Add drag & drop to all binding leaf nodes (level 1 direct bindings and level 2 sublayer bindings) in the sidebar tree
- Allow reordering bindings within the same layer/sublayer via drag & drop
- Allow moving a binding to a different parent (from sublayer → direct bindings, direct → sublayer, or sublayer → different sublayer) by dropping onto a trigger node or sublayer node
- Update the config store to reflect the new parent and order after a drop
- Show visual drop indicators (insertion line for reorder, highlight for reparenting) during drag

## Capabilities

### New Capabilities
- `sidebar-drag-drop`: Drag & drop interactions in the sidebar tree for reordering bindings and moving bindings between layers/sublayers

### Modified Capabilities
- `nested-layer-tree`: Tree nodes gain drag handles and drop zone behavior; bindings can be rearranged via drag & drop in addition to existing click interactions

## Impact

- `src/js/renderer.js` — Tree node creation needs `draggable` attributes, drag event handlers, and drop zone logic
- `src/js/config-store.js` — New `moveBinding()` and `reorderBinding()` methods to atomically move/reorder bindings in the data model
- `src/styles/sublayer-panel.css` — Drop indicator styles (insertion lines, highlight states)
- No new dependencies (using native HTML5 Drag and Drop API)
