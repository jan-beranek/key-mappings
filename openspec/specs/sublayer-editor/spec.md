### Requirement: List sublayers
The system SHALL display all sublayers as level-1 nodes in the tree under the active trigger key, showing their activation key and label. Each sublayer node SHALL be expandable to reveal its bindings as level-2 leaf nodes.

#### Scenario: Show parsed sublayers
- **WHEN** user loads a config with sublayers `o` (Open apps), `w` (Window), `s` (System)
- **THEN** the tree displays these as expandable nodes under the active trigger key, each showing its key and label

#### Scenario: Select a sublayer
- **WHEN** user clicks on a sublayer node in the tree
- **THEN** the key grid updates to show the bindings for that sublayer, and the sublayer node is highlighted as selected

### Requirement: Delete sublayer
The system SHALL allow the user to delete a sublayer and all its bindings via the binding editor Delete button (when editing a sublayer activator) or via the tree node delete action.

#### Scenario: Delete sublayer via binding editor
- **WHEN** user opens binding editor for sublayer "b" (type "Activate Layer") and clicks Delete
- **THEN** a confirmation dialog asks to confirm, and upon confirmation the sublayer and all its bindings are removed

#### Scenario: Delete sublayer via tree
- **WHEN** user clicks "Del" on sublayer "b" in the tree
- **THEN** a confirmation dialog asks to confirm, and upon confirmation the sublayer and all its bindings are removed

### Requirement: Rename sublayer
The system SHALL allow the user to change a sublayer's label via the binding editor (type "Activate Layer") or via inline rename in the tree. Both methods SHALL update the label in the tree and generated JSON rule description.

#### Scenario: Rename sublayer label via binding editor
- **WHEN** user opens binding editor for sublayer "o" (showing type "Activate Layer"), changes label from "Open" to "Open Apps", and saves
- **THEN** the sublayer's description updates in the tree and in the generated JSON rule description

#### Scenario: Rename sublayer label via inline rename
- **WHEN** user clicks "Rename" on sublayer "o" in the tree and edits the label
- **THEN** the sublayer's description updates in the tree and in the generated JSON rule description

### Requirement: Add binding to sublayer
The system SHALL allow the user to add a new key binding within a sublayer, either by clicking an unbound key in the key grid or by clicking the "+" button on a sublayer node in the tree. The binding editor SHALL be displayed in the dedicated editor panel in the main area.

#### Scenario: Add app launch binding
- **WHEN** user is in sublayer `o` and adds a binding: key `s`, action "Open App", value "Safari"
- **THEN** a new manipulator is created conditioned on `hyper_sublayer_o == 1`, from key `s`, with `to: [{ "shell_command": "open -a 'Safari.app'" }]`, and a new leaf node appears under sublayer `o` in the tree

#### Scenario: Add shell command binding
- **WHEN** user adds a binding: key `x`, action "Shell Command", value `bash ~/scripts/test.sh`
- **THEN** a new manipulator is created with `to: [{ "shell_command": "bash ~/scripts/test.sh" }]`, and the binding appears as a leaf node in the tree

#### Scenario: Add key combo binding
- **WHEN** user adds a binding: key `h`, action "Key Combo", value `left_arrow`
- **THEN** a new manipulator is created with `to: [{ "key_code": "left_arrow" }]`, and the binding appears as a leaf node in the tree

#### Scenario: Prevent duplicate binding key in same sublayer
- **WHEN** user tries to add a binding with a key already used in the current sublayer
- **THEN** the system shows an error and does not create the binding

### Requirement: Edit sublayer via binding editor
Clicking a sublayer activator key in the key grid or using the edit action on a sublayer tree node SHALL open the binding editor with type "Activate Layer", the sublayer key (disabled), and the current label. The user can rename the label and save, or delete the sublayer via the Delete button.

#### Scenario: Rename sublayer via binding editor
- **WHEN** user clicks sublayer activator "J" in the key grid, changes the label to "Applications", and saves
- **THEN** the sublayer's label updates to "Applications" in the tree and key grid

#### Scenario: Delete sublayer via binding editor
- **WHEN** user clicks sublayer activator "J" in the key grid, then clicks "Delete" in the binding editor
- **THEN** a confirmation dialog appears, and upon confirmation the sublayer and all its bindings are removed

### Requirement: Edit binding
The system SHALL allow the user to modify an existing binding by selecting its leaf node in the tree, which opens the binding editor in the dedicated editor panel.

#### Scenario: Change binding action
- **WHEN** user selects binding leaf node for key `s` in sublayer `o`, changes from "Safari" to "Slack" in the editor panel, and saves
- **THEN** the manipulator's `to` array updates and the tree leaf node updates to show the new value

### Requirement: Delete binding
The system SHALL allow the user to remove a binding from a sublayer via a delete action on the binding's leaf node in the tree or via the editor panel.

#### Scenario: Delete a binding
- **WHEN** user deletes the binding for key `t` in sublayer `o`
- **THEN** the manipulator for that binding is removed from the sublayer's rule, and the leaf node is removed from the tree

### Requirement: Direct bindings (Hyper + key without sublayer)
The system SHALL support bindings directly on the hyper layer (no sublayer), for actions that should fire on Hyper + key without an intermediate sublayer key.

#### Scenario: Show direct hyper bindings
- **WHEN** user loads a config with manipulators conditioned only on `hyper == 1` (not on any `hyper_sublayer_*`)
- **THEN** these appear as binding leaf nodes at level 1 directly under the trigger key node in the tree (not inside a "Direct" group)

#### Scenario: Add direct hyper binding
- **WHEN** user selects a trigger node in the tree and adds a binding via the key grid or binding editor
- **THEN** the manipulator is conditioned on `hyper == 1` without any sublayer variable
