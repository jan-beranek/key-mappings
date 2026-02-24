## REMOVED Requirements

### Requirement: Add sublayer
**Reason**: Sublayer creation is now handled through the binding editor with type "Activate Layer." The dedicated "+ Add Sublayer" button and inline form are no longer needed.
**Migration**: Users create sublayers by adding a binding with type "Activate Layer" in the binding editor.

## MODIFIED Requirements

### Requirement: Edit sublayer via binding editor
Clicking a sublayer activator key in the key grid or using the edit action on a sublayer tree node SHALL open the binding editor with type "Activate Layer", the sublayer key (disabled), and the current label. The user can rename the label and save, or delete the sublayer via the Delete button.

#### Scenario: Rename sublayer via binding editor
- **WHEN** user clicks sublayer activator "J" in the key grid, changes the label to "Applications", and saves
- **THEN** the sublayer's label updates to "Applications" in the tree and key grid

#### Scenario: Delete sublayer via binding editor
- **WHEN** user clicks sublayer activator "J" in the key grid, then clicks "Delete" in the binding editor
- **THEN** a confirmation dialog appears, and upon confirmation the sublayer and all its bindings are removed

### Requirement: Rename sublayer
The system SHALL allow the user to change a sublayer's label via the binding editor (type "Activate Layer") or via inline rename in the tree. Both methods SHALL update the label in the tree and generated JSON rule description.

#### Scenario: Rename sublayer label via binding editor
- **WHEN** user opens binding editor for sublayer "o" (showing type "Activate Layer"), changes label from "Open" to "Open Apps", and saves
- **THEN** the sublayer's description updates in the tree and in the generated JSON rule description

#### Scenario: Rename sublayer label via inline rename
- **WHEN** user clicks "Rename" on sublayer "o" in the tree and edits the label
- **THEN** the sublayer's description updates in the tree and in the generated JSON rule description

### Requirement: Delete sublayer
The system SHALL allow the user to delete a sublayer and all its bindings via the binding editor Delete button (when editing a sublayer activator) or via the tree node delete action.

#### Scenario: Delete sublayer via binding editor
- **WHEN** user opens binding editor for sublayer "b" (type "Activate Layer") and clicks Delete
- **THEN** a confirmation dialog asks to confirm, and upon confirmation the sublayer and all its bindings are removed

#### Scenario: Delete sublayer via tree
- **WHEN** user clicks "Del" on sublayer "b" in the tree
- **THEN** a confirmation dialog asks to confirm, and upon confirmation the sublayer and all its bindings are removed

### Requirement: Direct bindings (Hyper + key without sublayer)
The system SHALL support bindings directly on the hyper layer (no sublayer), for actions that should fire on Hyper + key without an intermediate sublayer key.

#### Scenario: Show direct hyper bindings
- **WHEN** user loads a config with manipulators conditioned only on `hyper == 1` (not on any `hyper_sublayer_*`)
- **THEN** these appear as binding leaf nodes at level 1 directly under the trigger key node in the tree (not inside a "Direct" group)

#### Scenario: Add direct hyper binding
- **WHEN** user selects a trigger node in the tree and adds a binding via the key grid or binding editor
- **THEN** the manipulator is conditioned on `hyper == 1` without any sublayer variable
