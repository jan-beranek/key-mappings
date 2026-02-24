## Context

KEKE's current UI has three distinct interaction patterns for managing layers: a dedicated "+ Add Sublayer" button with inline form in the sidebar, separate Rename/Delete actions on sublayer nodes, and the binding editor form for key bindings. Direct bindings live inside a "Direct" pseudo-layer that behaves differently from real sublayers (no key badge, no rename/delete). This creates cognitive overhead — users must learn separate workflows for what are conceptually related operations.

The binding editor already supports three types (Open App, Shell Command, Key Combo) via a `<select>` dropdown. Adding a fourth type "Activate Layer" is a natural extension that unifies layer creation with the binding workflow.

## Goals / Non-Goals

**Goals:**
- Unify layer creation into the binding editor as type "Activate Layer"
- Remove the dedicated "+ Add Sublayer" button and form from the sidebar
- Remove the "Direct" pseudo-layer — show direct bindings as leaf nodes at level 1 in the tree
- Preserve all existing functionality (create, rename, delete sublayers; create/edit/delete bindings)

**Non-Goals:**
- Changing the data model (triggers, sublayers, directBindings, ruleSlots remain the same)
- Changing serialization/parsing of Karabiner JSON
- Changing the key grid behavior
- Supporting nested sublayers (sublayers within sublayers)

## Decisions

### 1. "Activate Layer" as a binding type in the form

**Decision**: Add `<option value="layer">Activate Layer</option>` to the `#bf-type` select. When selected, the Value field's label changes to "Label" and its placeholder becomes "Layer name (e.g. Open Apps)." The modifier row stays hidden.

**Rationale**: This reuses the existing form infrastructure. Users already understand "pick a key, pick a type, fill in a value." A sublayer activator is just another type of thing a key can do.

**Alternatives considered**:
- *Separate modal dialog for layer creation*: More UI to build, still a separate workflow.
- *Right-click context menu on key grid*: Discoverable but inconsistent with existing patterns.

### 2. Binding form adapts save behavior based on type

**Decision**: When type is "layer", `saveBinding()` calls `store.addSublayer()` (for new) or `store.renameSublayer()` (for edit) instead of `store.addBinding()`. Deleting a "layer" binding calls `store.deleteSublayer()`.

**Rationale**: Keeps the store API stable. The binding form acts as a unified facade over what remain distinct store operations.

### 3. Sublayer activators are editable through the binding form

**Decision**: Clicking a sublayer activator key in the key grid (or clicking the sublayer node in the tree with a new "Edit" action) opens the binding form pre-filled with type "layer", the sublayer key, and the label. The key field is disabled (can't change activator key). Users can rename the label or delete the sublayer from this form.

**Rationale**: Consistent editing experience — everything that appears in the key grid is editable through the same form.

### 4. Direct bindings render as level-1 leaf nodes in the tree

**Decision**: Remove the `renderSublayerNode(container, trigger.key, null, 'Direct', ...)` call. Instead, iterate `triggerData.directBindings` and render each as a `tree-node--level-1` leaf (similar to current level-2 binding leaves but at level 1). These appear between the trigger node and the sublayer nodes.

**Rationale**: Direct bindings aren't a "layer" — they're just bindings directly on the hyper key. Showing them at level 1 without a wrapper reflects their true nature. The "+" button for adding direct bindings moves to the trigger node or is handled by clicking empty keys in the grid when the trigger-level view is selected.

### 5. Tree ordering: direct bindings first, then sublayers

**Decision**: Under each trigger, render direct binding leaves first, then sublayer nodes. This matches the mental model of "simple keys first, layers second" and mirrors the key grid where unbound/direct keys and sublayer activators coexist.

**Rationale**: Keeps the most common quick-access bindings visible at the top.

### 6. Selecting a trigger node shows direct bindings in the key grid

**Decision**: Clicking a trigger node sets `selectedSublayer = null`, which already shows direct bindings in the key grid. This behavior is unchanged. The grid title remains "Caps Lock + Key" (dropping the "(Direct Bindings)" suffix since there's no longer a concept of "Direct" as a named group).

**Rationale**: Simplifies the title and aligns with the removal of the Direct pseudo-layer concept.

## Risks / Trade-offs

- **Discoverability of layer creation**: Users may not realize they can create layers through the binding editor type dropdown. → Mitigation: The key grid already shows sublayer activator keys distinctly styled. When adding a new binding, "Activate Layer" is visible in the Type dropdown. The placeholder text guides the user.
- **Edit entry point for sublayers**: Previously sublayer nodes had Rename/Delete inline actions. → Mitigation: Sublayer nodes in the tree get an edit icon. Clicking it opens the binding form with type "layer." Delete remains available in the form.
- **Migration of existing "Direct" node selection state**: Code uses `selectedSublayer === null` for direct mode. → Mitigation: This convention remains unchanged. The only change is how null-sublayer state renders in the tree (no wrapping group node).
