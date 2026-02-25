## MODIFIED Requirements

### Requirement: Display hierarchical tree navigation
The system SHALL display a nested tree in the left panel with trigger keys at level 0, and both direct binding leaves and sublayer nodes at level 1. Sublayer nodes expand to show their binding leaves at level 2. All binding leaf nodes SHALL have `draggable="true"` and appropriate drag event handlers. Trigger and sublayer nodes SHALL act as drop zones for reparenting bindings.

#### Scenario: Show tree structure for loaded config
- **WHEN** user loads a config with trigger key `caps_lock`, sublayers `o` (Open Apps with 3 bindings) and `w` (Window with 2 bindings), and 1 direct binding (key "a", app: Safari)
- **THEN** the left panel displays a tree with:
  - "Caps Lock" node (level 0, expanded, acts as drop zone)
    - "A — Safari" leaf (level 1, direct binding, draggable)
    - "O — Open Apps" node (level 1, sublayer, acts as drop zone) with 3 draggable binding leaves at level 2
    - "W — Window" node (level 1, sublayer, acts as drop zone) with 2 draggable binding leaves at level 2
  - "Tab" node (level 0, collapsed, acts as drop zone)

#### Scenario: Show tree with no direct bindings
- **WHEN** user loads a config with trigger key `caps_lock` that has sublayers but no direct bindings
- **THEN** the tree shows only sublayer nodes at level 1 under "Caps Lock" (no "Direct" group)

#### Scenario: Show tree with only direct bindings
- **WHEN** user loads a config with trigger key `caps_lock` that has 3 direct bindings and no sublayers
- **THEN** the tree shows 3 draggable binding leaves at level 1 directly under "Caps Lock"

### Requirement: Add binding from tree
The system SHALL provide an "Add" action at the trigger level in the tree to create a new direct binding, since the "Direct" pseudo-layer no longer exists.

#### Scenario: Add direct binding via trigger node
- **WHEN** user clicks the "+" button on a trigger key node (e.g. "Caps Lock")
- **THEN** the binding editor opens in "new binding" mode for the direct binding context (selectedSublayer = null)

#### Scenario: Add binding to sublayer via tree
- **WHEN** user clicks the "+" button on a sublayer node in the tree
- **THEN** the binding editor opens in "new binding" mode for that sublayer

#### Scenario: Click interactions preserved during drag
- **WHEN** user clicks (without dragging) a binding leaf node
- **THEN** the binding editor opens for that binding, same as before drag & drop was added
