## ADDED Requirements

### Requirement: Paste JSON input
The system SHALL provide a textarea where the user can paste Karabiner complex modification JSON in any of the supported formats.

#### Scenario: User pastes valid rules JSON array
- **WHEN** user pastes a valid JSON array of Karabiner rules into the input textarea and clicks "Load"
- **THEN** the system parses the JSON and populates the editor with recognized hyper key and sublayer configurations

#### Scenario: User pastes single rule object (flat format)
- **WHEN** user pastes a single JSON object with `description` and `manipulators` keys (the format produced by this tool and accepted by Karabiner-Elements import)
- **THEN** the system splits mixed manipulators into logical groups (hyper activators, sublayer activators with their bindings, direct bindings) and populates the editor

#### Scenario: User pastes full karabiner.json
- **WHEN** user pastes a complete `karabiner.json` file (with `global`, `profiles`, etc.)
- **THEN** the system extracts `profiles[0].complex_modifications.rules` and parses it, ignoring the rest of the structure

#### Scenario: User pastes invalid JSON
- **WHEN** user pastes text that is not valid JSON
- **THEN** the system displays an inline error message indicating the JSON is invalid and does not modify any existing editor state

#### Scenario: Initial paste view shows only JSON input area
- **WHEN** the application loads or the user returns to the paste view via "Start Over"
- **THEN** the paste view SHALL display only the title, subtitle, JSON textarea, error message area, and action buttons — no editor UI (key grid, binding panel, layer tree) SHALL be visible

### Requirement: Copy JSON output
The system SHALL provide a way for the user to copy the edited configuration back as valid Karabiner JSON.

#### Scenario: User copies edited rules
- **WHEN** user clicks "Copy JSON" after editing
- **THEN** the system copies a single rule object (`{"description": "...", "manipulators": [...]}`) containing all manipulators to the clipboard as formatted JSON, compatible with Karabiner-Elements import

#### Scenario: Output preserves unrecognized rules
- **WHEN** the pasted input contained rules not recognized as hyper/sublayer patterns
- **THEN** those rules SHALL appear unchanged in the output JSON, in their original position relative to hyper rules

### Requirement: Parse hyper key structure from JSON
The system SHALL identify hyper key and sublayer patterns in the parsed rules by recognizing variable-based activation patterns.

#### Scenario: Recognize hyper key activator
- **WHEN** parsing rules
- **THEN** the system identifies a manipulator that sets a variable named `hyper` to `1` on a trigger key (e.g., `caps_lock` or `tab`) as the hyper key activator

#### Scenario: Recognize sublayer activators
- **WHEN** parsing rules
- **THEN** the system identifies manipulators conditioned on `hyper == 1` that set variables matching `hyper_sublayer_*` to `1` as sublayer activators

#### Scenario: Recognize sublayer bindings
- **WHEN** parsing rules
- **THEN** the system identifies manipulators conditioned on a `hyper_sublayer_*` variable as bindings within that sublayer

### Requirement: Serialize config to valid Karabiner JSON
The system SHALL generate valid Karabiner Elements JSON from the editor state.

#### Scenario: Generated JSON is structurally valid
- **WHEN** the user copies the output JSON
- **THEN** the output is a valid JSON object with `description` and `manipulators` keys, conforming to the Karabiner complex modifications rule schema

#### Scenario: Round-trip fidelity for unmodified config
- **WHEN** user pastes JSON, makes no edits, and copies output
- **THEN** the output JSON SHALL be semantically equivalent to the input (same manipulators and behavior; the structural grouping into a single flat rule and formatting may differ from the input)
