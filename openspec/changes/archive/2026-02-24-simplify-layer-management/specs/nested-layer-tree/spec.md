## MODIFIED Requirements

### Requirement: Display hierarchical tree navigation
The system SHALL display a nested tree in the left panel with trigger keys at level 0, and both direct binding leaves and sublayer nodes at level 1. Sublayer nodes expand to show their binding leaves at level 2.

#### Scenario: Show tree structure for loaded config
- **WHEN** user loads a config with trigger key `caps_lock`, sublayers `o` (Open Apps with 3 bindings) and `w` (Window with 2 bindings), and 1 direct binding (key "a", app: Safari)
- **THEN** the left panel displays a tree with:
  - "Caps Lock" node (level 0, expanded)
    - "A — Safari" leaf (level 1, direct binding)
    - "O — Open Apps" node (level 1, sublayer) with 3 binding leaves at level 2
    - "W — Window" node (level 1, sublayer) with 2 binding leaves at level 2
  - "Tab" node (level 0, collapsed)

#### Scenario: Show tree with no direct bindings
- **WHEN** user loads a config with trigger key `caps_lock` that has sublayers but no direct bindings
- **THEN** the tree shows only sublayer nodes at level 1 under "Caps Lock" (no "Direct" group)

#### Scenario: Show tree with only direct bindings
- **WHEN** user loads a config with trigger key `caps_lock` that has 3 direct bindings and no sublayers
- **THEN** the tree shows 3 binding leaves at level 1 directly under "Caps Lock"

### Requirement: Select binding from tree
The system SHALL allow users to select an individual binding by clicking its leaf node in the tree, which opens the binding editor in the main panel. This applies to both direct binding leaves (level 1) and sublayer binding leaves (level 2).

#### Scenario: Click a direct binding leaf node
- **WHEN** user clicks the leaf node for direct binding "A — Safari" at level 1 under "Caps Lock"
- **THEN** that leaf node is visually highlighted as selected, `selectedSublayer` is set to null, and the binding editor shows the edit form for that binding

#### Scenario: Click a sublayer binding leaf node
- **WHEN** user clicks the leaf node for binding "S — Safari" at level 2 under sublayer "O"
- **THEN** that leaf node is visually highlighted as selected, and the binding editor panel shows the edit form for that binding

### Requirement: Add binding from tree
The system SHALL provide an "Add" action at the trigger level in the tree to create a new direct binding, since the "Direct" pseudo-layer no longer exists.

#### Scenario: Add direct binding via trigger node
- **WHEN** user clicks the "+" button on a trigger key node (e.g. "Caps Lock")
- **THEN** the binding editor opens in "new binding" mode for the direct binding context (selectedSublayer = null)

#### Scenario: Add binding to sublayer via tree
- **WHEN** user clicks the "+" button on a sublayer node in the tree
- **THEN** the binding editor opens in "new binding" mode for that sublayer

## REMOVED Requirements

### Requirement: Direct pseudo-sublayer display
**Reason**: The "Direct" pseudo-layer wrapper is removed. Direct bindings are now displayed as individual leaf nodes at level 1, making the tree flatter and simpler.
**Migration**: Direct bindings appear directly under the trigger node. Clicking a trigger node still sets the key grid to show direct bindings. The "+" button for adding direct bindings moves to the trigger node.
