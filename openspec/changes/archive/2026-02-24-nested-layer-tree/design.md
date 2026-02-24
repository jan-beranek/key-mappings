## Context

KEKE ([HYPER] Key Editor for Karabiner-Elements) is a single-file HTML app with vanilla JS. The current left panel (`#sublayer-panel`) renders a flat list of sublayers. The trigger key is selected via a dropdown in the header. Bindings are shown in a separate panel (`#binding-panel`) below the key grid. The user wants to unify these into a single nested tree in the left panel, with the main area dedicated to editing a selected binding.

## Goals / Non-Goals

**Goals:**
- Replace the flat sublayer list with a 3-level nested tree: trigger key > sublayer > binding
- Absorb trigger key selection into the tree's top level (no more header dropdown)
- Absorb the binding list into the tree's leaf level
- Dedicate the full lower main area to editing the currently selected binding
- Maintain all existing CRUD operations (add/delete/rename sublayers, add/edit/delete bindings)

**Non-Goals:**
- Drag-and-drop reordering of tree nodes
- Multi-select or bulk operations
- Changing the data model or ConfigStore API
- Changing the key grid behavior
- Supporting more than two trigger keys (Tab, Caps Lock)

## Decisions

### 1. Tree structure as nested HTML with indentation levels

**Decision**: Render the tree as flat `.tree-node` divs with CSS `padding-left` based on depth level, rather than nested `<ul>/<li>` elements.

**Rationale**: Flat divs with depth-based indentation are simpler to render from JS, easier to manage selection state, and match the existing rendering pattern (the current sublayer panel already uses flat divs). Nested DOM trees add complexity for selection management and event delegation.

**Alternatives considered**: Nested `<ul>` elements (semantic but harder to manage click handlers and selection state programmatically).

### 2. Tree levels map to existing data

**Decision**: The three tree levels are:
- **Level 0 (root)**: Trigger keys — always exactly 2 nodes: "Caps Lock" and "Tab". The active one is visually distinguished. Clicking switches the trigger key.
- **Level 1**: Sublayers + "Direct" pseudo-sublayer under the active trigger key. Same as the current flat list items.
- **Level 2**: Individual bindings under each sublayer. Shows key badge + action description.

**Rationale**: This directly maps the user's request — trigger key selection replaces the dropdown, bindings replace the binding panel list.

### 3. Expand/collapse state management

**Decision**: Track expanded nodes in a `Set` of node IDs (e.g., `"trigger:caps_lock"`, `"sublayer:o"`). The active trigger key node is always expanded. Sublayer nodes can be individually expanded/collapsed by clicking the expand toggle.

**Rationale**: A Set is simple, O(1) lookup, and easy to persist if needed later.

### 4. Selection state extension

**Decision**: Extend the current `selectedSublayer` state with a new `selectedBinding` variable. When a binding leaf node is clicked, both `selectedSublayer` and `selectedBinding` are set, and the main panel shows the binding editor form.

**Rationale**: Minimal state change — adds one variable rather than refactoring the existing selection model.

### 5. Binding editor replaces binding list

**Decision**: The `#binding-panel` area (currently showing a list of bindings + inline form) becomes a dedicated editor panel that shows the full edit form for whatever binding is selected in the tree. When no binding is selected, it shows a placeholder message ("Select a binding from the tree to edit, or click a key in the grid to add one").

**Rationale**: Since bindings are now listed in the tree, the panel no longer needs to display a list. This gives the editor more space and reduces visual clutter.

### 6. Add binding workflow

**Decision**: "Add Binding" can be triggered from two places: (a) clicking an unbound key in the key grid (same as today), or (b) an "+ Add" button shown at the sublayer level in the tree. Both open the editor panel in "new binding" mode.

**Rationale**: Preserves the existing key grid interaction while also providing tree-based access.

## Risks / Trade-offs

- **Wider left panel needed**: The tree with 3 levels of nesting will need more horizontal space than the current 220px panel. **Mitigation**: Increase panel width to ~280px and use compact node styling.
- **More clicks to navigate**: Expanding tree nodes to find a binding requires more clicks than the current flat list + binding panel. **Mitigation**: Auto-expand the active trigger key node and the selected sublayer. Keep the key grid as a quick-access shortcut.
- **Inactive trigger key node**: Showing both trigger keys but only the active one having children could confuse users. **Mitigation**: Visually differentiate the active node (bold, expanded) vs inactive (dimmed, collapsed, no children shown). Clicking the inactive one switches the trigger key and expands it.
