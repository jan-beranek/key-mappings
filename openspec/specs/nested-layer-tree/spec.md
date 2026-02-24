### Requirement: Display hierarchical tree navigation
The system SHALL display a nested tree in the left panel with three levels: trigger key (level 0), sublayer (level 1), and individual binding (level 2).

#### Scenario: Show tree structure for loaded config
- **WHEN** user loads a config with trigger key `caps_lock`, sublayers `o` (Open Apps with 3 bindings) and `w` (Window with 2 bindings), and 1 direct binding
- **THEN** the left panel displays a tree with:
  - "Caps Lock" node (level 0, expanded, active)
    - "Direct" node (level 1) with its binding as a leaf
    - "O — Open Apps" node (level 1) with 3 binding leaves
    - "W — Window" node (level 1) with 2 binding leaves
  - "Tab" node (level 0, collapsed, inactive)

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
The system SHALL allow users to select an individual binding by clicking its leaf node in the tree, which opens the binding editor in the main panel.

#### Scenario: Click a binding leaf node
- **WHEN** user clicks the leaf node for binding "S — Safari (app)" under sublayer "O"
- **THEN** that leaf node is visually highlighted as selected, and the binding editor panel shows the edit form for that binding with key "s", type "Open App", and value "Safari"

#### Scenario: Click a different binding leaf
- **WHEN** user has binding "S" selected and clicks binding "E" in the same sublayer
- **THEN** selection moves to "E", and the editor panel updates to show the edit form for binding "E"

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
The system SHALL provide an "Add" action at the sublayer level in the tree to create a new binding.

#### Scenario: Add binding via tree
- **WHEN** user clicks the "+" button on a sublayer node in the tree
- **THEN** the binding editor panel opens in "new binding" mode for that sublayer
