## MODIFIED Requirements

### Requirement: Paste JSON input
The system SHALL provide a textarea where the user can paste Karabiner complex modification JSON (the `rules` array from `profiles[].complex_modifications.rules`).

#### Scenario: User pastes valid rules JSON
- **WHEN** user pastes a valid JSON array of Karabiner rules into the input textarea and clicks "Load"
- **THEN** the system parses the JSON and populates the editor with recognized hyper key and sublayer configurations

#### Scenario: User pastes full karabiner.json
- **WHEN** user pastes a complete `karabiner.json` file (with `global`, `profiles`, etc.)
- **THEN** the system extracts `profiles[0].complex_modifications.rules` and parses it, ignoring the rest of the structure

#### Scenario: User pastes invalid JSON
- **WHEN** user pastes text that is not valid JSON
- **THEN** the system displays an inline error message indicating the JSON is invalid and does not modify any existing editor state

#### Scenario: Initial paste view shows only JSON input area
- **WHEN** the application loads or the user returns to the paste view via "Start Over"
- **THEN** the paste view SHALL display only the title, subtitle, JSON textarea, error message area, and action buttons — no editor UI (key grid, binding panel, layer tree) SHALL be visible
