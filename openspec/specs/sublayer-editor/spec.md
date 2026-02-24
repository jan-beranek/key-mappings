## ADDED Requirements

### Requirement: List sublayers
The system SHALL display all sublayers as a navigable list with their activation key and label.

#### Scenario: Show parsed sublayers
- **WHEN** user loads a config with sublayers `o` (Open apps), `w` (Window), `s` (System)
- **THEN** the UI displays a list/tabs showing each sublayer with its key and label

#### Scenario: Select a sublayer
- **WHEN** user clicks on a sublayer in the list
- **THEN** the editor shows the bindings for that sublayer

### Requirement: Add sublayer
The system SHALL allow the user to create a new sublayer by specifying an activation key and label.

#### Scenario: Create new sublayer
- **WHEN** user clicks "Add Sublayer", enters key `b` and label "Browse"
- **THEN** a new sublayer `b` is created with no bindings, the sublayer activator rule is generated with proper `hyper == 1` condition and `hyper_sublayer_b` variable, and the new sublayer appears in the sublayer list

#### Scenario: Prevent duplicate sublayer key
- **WHEN** user tries to create a sublayer with a key already used by another sublayer
- **THEN** the system shows an error and does not create the sublayer

### Requirement: Delete sublayer
The system SHALL allow the user to delete a sublayer and all its bindings.

#### Scenario: Delete existing sublayer
- **WHEN** user clicks "Delete" on sublayer `b`
- **THEN** the sublayer and all its bindings are removed from the configuration, and the sublayer activator rule is removed

### Requirement: Rename sublayer
The system SHALL allow the user to change a sublayer's label (description) without changing its activation key.

#### Scenario: Rename sublayer label
- **WHEN** user edits the label of sublayer `o` from "Open" to "Open Apps"
- **THEN** the sublayer's description updates in the list and in the generated JSON rule description

### Requirement: Add binding to sublayer
The system SHALL allow the user to add a new key binding within a sublayer.

#### Scenario: Add app launch binding
- **WHEN** user is in sublayer `o` and adds a binding: key `s`, action "Open App", value "Safari"
- **THEN** a new manipulator is created conditioned on `hyper_sublayer_o == 1`, from key `s`, with `to: [{ "shell_command": "open -a 'Safari.app'" }]`

#### Scenario: Add shell command binding
- **WHEN** user adds a binding: key `x`, action "Shell Command", value `bash ~/scripts/test.sh`
- **THEN** a new manipulator is created with `to: [{ "shell_command": "bash ~/scripts/test.sh" }]`

#### Scenario: Add key combo binding
- **WHEN** user adds a binding: key `h`, action "Key Combo", value `left_arrow`
- **THEN** a new manipulator is created with `to: [{ "key_code": "left_arrow" }]`

#### Scenario: Prevent duplicate binding key in same sublayer
- **WHEN** user tries to add a binding with a key already used in the current sublayer
- **THEN** the system shows an error and does not create the binding

### Requirement: Edit binding
The system SHALL allow the user to modify an existing binding's action type and value.

#### Scenario: Change binding action
- **WHEN** user edits the binding for key `s` in sublayer `o`, changing from "Safari" to "Slack"
- **THEN** the manipulator's `to` array updates to `[{ "shell_command": "open -a 'Slack.app'" }]`

### Requirement: Delete binding
The system SHALL allow the user to remove a binding from a sublayer.

#### Scenario: Delete a binding
- **WHEN** user clicks "Delete" on the binding for key `t` in sublayer `o`
- **THEN** the manipulator for that binding is removed from the sublayer's rule

### Requirement: Direct bindings (Hyper + key without sublayer)
The system SHALL support bindings directly on the hyper layer (no sublayer), for actions that should fire on Hyper + key without an intermediate sublayer key.

#### Scenario: Show direct hyper bindings
- **WHEN** user loads a config with manipulators conditioned only on `hyper == 1` (not on any `hyper_sublayer_*`)
- **THEN** these appear as bindings under a "Direct" or "Hyper" pseudo-sublayer in the UI

#### Scenario: Add direct hyper binding
- **WHEN** user adds a binding to the "Direct" sublayer
- **THEN** the manipulator is conditioned on `hyper == 1` without any sublayer variable
