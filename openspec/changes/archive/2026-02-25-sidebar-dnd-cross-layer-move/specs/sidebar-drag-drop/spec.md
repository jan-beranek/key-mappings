## ADDED Requirements

### Requirement: Drag binding to reorder within same layer
The system SHALL allow users to drag a binding leaf node and drop it onto another binding leaf node within the same parent (same sublayer or same direct bindings list) to reorder bindings. The dropped binding SHALL be inserted at the position indicated by the drop target.

#### Scenario: Reorder direct binding before another
- **WHEN** user drags direct binding "A — Safari" and drops it above direct binding "E — Terminal" under the same trigger
- **THEN** binding "A" moves before "E" in the direct bindings list, and the tree re-renders with the new order

#### Scenario: Reorder sublayer binding after another
- **WHEN** user drags binding "S — Safari" within sublayer "O" and drops it below binding "T — Terminal"
- **THEN** binding "S" moves after "T" in sublayer "O"'s bindings list

#### Scenario: Drop position determined by cursor half
- **WHEN** user drags a binding and hovers over the top half of a target binding node
- **THEN** the drop indicator shows an insertion line above the target node
- **WHEN** user drags a binding and hovers over the bottom half of a target binding node
- **THEN** the drop indicator shows an insertion line below the target node

### Requirement: Drag binding to move between layers
The system SHALL allow users to drag a binding leaf node and drop it onto a different parent node (trigger node or sublayer node) to move the binding into that layer. The binding SHALL be removed from its source layer and added to the destination layer.

#### Scenario: Move direct binding into sublayer
- **WHEN** user drags direct binding "A — Safari" from trigger "Caps Lock" and drops it onto sublayer node "O — Open Apps"
- **THEN** binding "A" is removed from direct bindings and added to sublayer "O"'s bindings

#### Scenario: Move sublayer binding to direct bindings
- **WHEN** user drags binding "S — Safari" from sublayer "O" and drops it onto the trigger node "Caps Lock"
- **THEN** binding "S" is removed from sublayer "O" and added to direct bindings under "Caps Lock"

#### Scenario: Move binding between sublayers
- **WHEN** user drags binding "T — Terminal" from sublayer "O" and drops it onto sublayer node "W — Window"
- **THEN** binding "T" is removed from sublayer "O" and added to sublayer "W"'s bindings

#### Scenario: Move binding across triggers
- **WHEN** user drags binding "A — Safari" from trigger "Caps Lock" direct bindings and drops it onto trigger node "Tab"
- **THEN** binding "A" is removed from "Caps Lock" direct bindings and added to "Tab" direct bindings

### Requirement: Reject move on key conflict
The system SHALL reject a cross-layer move if the binding's key already exists in the destination layer and SHALL show an error message.

#### Scenario: Key conflict prevents move
- **WHEN** user drags binding "S — Safari" from sublayer "O" and drops it onto sublayer "W" which already has a binding with key "S"
- **THEN** the move is rejected, the binding stays in sublayer "O", and a toast error shows "Key 'S' already exists in target layer"

#### Scenario: No conflict allows move
- **WHEN** user drags binding "T — Terminal" from sublayer "O" and drops it onto sublayer "W" which has no binding with key "T"
- **THEN** the move succeeds and binding "T" appears in sublayer "W"

### Requirement: Visual drag feedback
The system SHALL provide visual indicators during drag operations to show valid drop zones and insertion positions.

#### Scenario: Dragging a binding dims the source
- **WHEN** user starts dragging a binding leaf node
- **THEN** the source node is visually dimmed to indicate it is being moved

#### Scenario: Hovering over a valid reorder target shows insertion line
- **WHEN** user drags a binding over another binding in the same parent
- **THEN** a horizontal insertion line appears above or below the target binding to indicate where the dragged binding will be placed

#### Scenario: Hovering over a valid reparent target highlights it
- **WHEN** user drags a binding over a trigger node or sublayer node that is a different parent
- **THEN** the target node is highlighted to indicate it is a valid drop zone

#### Scenario: Leaving a drop zone removes indicators
- **WHEN** user drags a binding away from a drop zone
- **THEN** all visual indicators on that zone are removed

### Requirement: Only binding leaves are draggable
The system SHALL make only binding leaf nodes (level 1 direct bindings and level 2 sublayer bindings) draggable. Trigger key nodes and sublayer nodes SHALL NOT be draggable.

#### Scenario: Binding leaf is draggable
- **WHEN** user attempts to drag a binding leaf node
- **THEN** the drag operation starts and the node can be moved

#### Scenario: Sublayer node is not draggable
- **WHEN** user attempts to drag a sublayer node
- **THEN** no drag operation starts

#### Scenario: Trigger node is not draggable
- **WHEN** user attempts to drag a trigger key node
- **THEN** no drag operation starts
