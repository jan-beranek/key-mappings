## ADDED Requirements

### Requirement: Key grid visualization
The system SHALL display a grid of keys showing the binding status for the currently selected sublayer.

#### Scenario: Show bound keys
- **WHEN** a sublayer with bindings on keys `s`, `t`, `c` is selected
- **THEN** the key grid highlights keys `s`, `t`, `c` as bound, showing their action labels

#### Scenario: Show available keys
- **WHEN** a sublayer is selected
- **THEN** keys without bindings are visually distinct (dimmed or outlined) to indicate they are available for new bindings

#### Scenario: Click key to edit binding
- **WHEN** user clicks a bound key in the grid
- **THEN** the binding editor opens for that key, allowing modification

#### Scenario: Click empty key to add binding
- **WHEN** user clicks an unbound key in the grid
- **THEN** the binding creation form opens pre-filled with that key

### Requirement: Sublayer overview
The system SHALL show a summary view of all sublayers with their binding counts.

#### Scenario: Display sublayer summary
- **WHEN** user views the sublayer list
- **THEN** each sublayer shows its activation key, label, and number of bindings (e.g., "O - Open Apps (5 bindings)")

### Requirement: Keys used across sublayers
The system SHALL indicate which letter keys are already used as sublayer activation keys in the key grid when viewing the "Direct" hyper layer.

#### Scenario: Show sublayer keys in direct view
- **WHEN** user views the "Direct" hyper bindings
- **THEN** keys assigned as sublayer activators (e.g., `o`, `w`, `s`) are marked distinctly from available keys and from direct bindings
