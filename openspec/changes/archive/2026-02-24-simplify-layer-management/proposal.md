## Why

Layer creation currently requires a separate workflow ("+ Add Sublayer" button with its own form) that's disconnected from the binding editor. This adds UI complexity and a learning step. Meanwhile, the "Direct" pseudo-layer in the tree adds visual noise without providing real value — direct bindings are conceptually just bindings on the trigger key, not a separate "layer." Simplifying both of these reduces the number of UI concepts users need to learn.

## What Changes

- **New binding type "Activate Layer"**: The binding editor's Type dropdown gets a fourth option. Selecting it shows a Label field instead of Value. Saving creates a sublayer activator — unifying layer creation with the familiar binding workflow.
- **Remove "+ Add Sublayer" button and form**: The entire `#add-sublayer-area` section in the sidebar is removed. Layer creation happens exclusively through the binding editor.
- **Remove "Direct" pseudo-layer from tree**: Direct bindings are displayed as leaf nodes at level 1, directly under their trigger key node (alongside sublayer nodes), instead of being nested inside a "Direct" group.

## Capabilities

### New Capabilities
- `activate-layer-type`: New "Activate Layer" binding type in the binding editor that creates/manages sublayer activators through the same form used for all other bindings.

### Modified Capabilities
- `sublayer-editor`: Remove the dedicated "Add Sublayer" button and form. Sublayer creation, rename, and delete now flow through the binding editor with type "Activate Layer."
- `nested-layer-tree`: Remove the "Direct" pseudo-layer. Direct bindings display as level-1 leaf nodes directly under their trigger key, interleaved with sublayer nodes.

## Impact

- **UI (HTML/CSS)**: Remove `#add-sublayer-area` from sidebar. Add "Activate Layer" option to `#bf-type` select. Add conditional Label field in binding form. Adjust tree rendering for direct bindings at level 1.
- **renderer.js**: Remove `renderSublayerNode` call for Direct pseudo-layer. Add rendering of direct bindings as level-1 leaves. Update key grid to handle sublayer activators as editable bindings.
- **binding-form.js**: Handle "layer" action type — show label field, hide value field, save as sublayer creation/update instead of binding.
- **config-store.js**: May need a method to convert between sublayer and binding representations, or adapt `addSublayer`/`deleteSublayer` to work with binding-style calls.
- **serializer.js / parser.js**: Minimal impact — serialization of sublayer activators and direct bindings remains the same; only the UI path to create them changes.
