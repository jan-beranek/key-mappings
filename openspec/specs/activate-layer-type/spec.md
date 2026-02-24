### Requirement: Activate Layer binding type
The binding editor Type dropdown SHALL include an "Activate Layer" option alongside the existing "Open App", "Shell Command", and "Key Combo" options.

#### Scenario: Type dropdown shows Activate Layer option
- **WHEN** user opens the binding editor (via key grid click or tree "+" button)
- **THEN** the Type dropdown contains four options: "Open App", "Shell Command", "Key Combo", and "Activate Layer"

### Requirement: Activate Layer form adaptation
When "Activate Layer" is selected as the binding type, the form SHALL display a "Label" field (instead of "Value") with placeholder "Layer name (e.g. Open Apps)". The modifier row SHALL be hidden.

#### Scenario: Select Activate Layer type for new binding
- **WHEN** user selects "Activate Layer" from the Type dropdown
- **THEN** the second input field label changes to "Label", its placeholder changes to "Layer name (e.g. Open Apps)", and the modifier checkboxes row is hidden

#### Scenario: Switch from Activate Layer to another type
- **WHEN** user switches the Type from "Activate Layer" to "Open App"
- **THEN** the second input field label changes back to "Value", placeholder updates to "App name (e.g. Safari)", and the form displays normally

### Requirement: Create sublayer via Activate Layer binding
Saving a new binding with type "Activate Layer" SHALL create a sublayer with the specified key and label. The sublayer SHALL appear in both the tree and the key grid as a sublayer activator.

#### Scenario: Save new Activate Layer binding
- **WHEN** user creates a new binding with key "j", type "Activate Layer", and label "Open Apps"
- **THEN** a sublayer with key "j" and label "Open Apps" is created, it appears as a sublayer node in the tree, and key "J" shows as a sublayer activator in the key grid

#### Scenario: Prevent duplicate sublayer key
- **WHEN** user tries to create an "Activate Layer" binding with a key already used by another sublayer
- **THEN** the system shows an error and does not create the sublayer

#### Scenario: Prevent Activate Layer in sublayer context
- **WHEN** user is viewing bindings within a sublayer (not at the trigger/direct level)
- **THEN** the "Activate Layer" option SHALL NOT be available in the Type dropdown (sublayers cannot be nested)

### Requirement: Edit sublayer via binding editor
Clicking a sublayer activator key in the key grid or selecting edit on a sublayer node in the tree SHALL open the binding editor pre-filled with type "Activate Layer", the sublayer's key (disabled), and the sublayer's label.

#### Scenario: Edit sublayer from key grid
- **WHEN** user clicks a sublayer activator key "J" in the key grid (while viewing direct/trigger level)
- **THEN** the binding editor opens with key "J" (disabled), type "Activate Layer", and label showing the sublayer's current label (e.g. "Open Apps")

#### Scenario: Rename sublayer via binding editor
- **WHEN** user edits a sublayer activator binding, changes the label from "Open Apps" to "Applications", and saves
- **THEN** the sublayer's label updates to "Applications" in both the tree and the key grid

### Requirement: Delete sublayer via binding editor
The binding editor SHALL show a Delete button when editing a sublayer activator. Clicking it SHALL delete the sublayer and all its bindings after confirmation.

#### Scenario: Delete sublayer from binding editor
- **WHEN** user opens the binding editor for sublayer "J - Open Apps" and clicks "Delete"
- **THEN** a confirmation dialog asks "Delete sublayer 'Open Apps' and all its bindings?"
- **WHEN** user confirms
- **THEN** the sublayer and all its bindings are removed from the configuration
