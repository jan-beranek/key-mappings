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

### Requirement: Expand and collapse tree nodes
The system SHALL allow users to expand and collapse trigger key and sublayer nodes to show or hide their children.

#### Scenario: Collapse an expanded sublayer
- **WHEN** user clicks the expand/collapse toggle on an expanded sublayer node "O — Open Apps"
- **THEN** the binding leaves under that sublayer are hidden and the toggle icon changes to indicate collapsed state

#### Scenario: Expand a collapsed sublayer
- **WHEN** user clicks the expand/collapse toggle on a collapsed sublayer node
- **THEN** the binding leaves under that sublayer are shown and the toggle icon changes to indicate expanded state

#### Scenario: Active trigger key auto-expanded
- **WHEN** a config is loaded or trigger key is switched
- **THEN** the active trigger key node SHALL be expanded and the inactive trigger key node SHALL be collapsed

### Requirement: Select binding from tree
The system SHALL allow users to select an individual binding by clicking its leaf node in the tree, which opens the binding editor in the main panel. This applies to both direct binding leaves (level 1) and sublayer binding leaves (level 2).

#### Scenario: Click a direct binding leaf node
- **WHEN** user clicks the leaf node for direct binding "A — Safari" at level 1 under "Caps Lock"
- **THEN** that leaf node is visually highlighted as selected, `selectedSublayer` is set to null, and the binding editor shows the edit form for that binding

#### Scenario: Click a sublayer binding leaf node
- **WHEN** user clicks the leaf node for binding "S — Safari" at level 2 under sublayer "O"
- **THEN** that leaf node is visually highlighted as selected, and the binding editor panel shows the edit form for that binding

### Requirement: Select sublayer from tree
The system SHALL allow users to select a sublayer by clicking its node in the tree, updating the key grid to show that sublayer's bindings.

#### Scenario: Click a sublayer node
- **WHEN** user clicks the sublayer node "W — Window"
- **THEN** that sublayer is selected, the key grid updates to show bindings for the "Window" sublayer, and no individual binding is selected

### Requirement: Show binding details in tree leaves
Each binding leaf node in the tree SHALL display the binding key and a short description of its action.

#### Scenario: Display binding information
- **WHEN** a sublayer "O" has bindings: key "s" (app: Safari), key "t" (shell: open -a Terminal)
- **THEN** the leaf nodes show "S — Safari" and "T — open -a Terminal" respectively

### Requirement: Empty state for sublayer with no bindings
The system SHALL show an indicator when a sublayer has no bindings.

#### Scenario: Sublayer with no bindings expanded
- **WHEN** user expands a sublayer that has no bindings
- **THEN** the tree shows a dimmed "No bindings" text under that sublayer node

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
