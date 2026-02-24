## ADDED Requirements

### Requirement: Display hyper key trigger configuration
The system SHALL display which physical key is configured as the hyper key trigger and its tap behavior.

#### Scenario: Show detected hyper key trigger
- **WHEN** user loads a config that uses `caps_lock` as the hyper key
- **THEN** the UI displays "Hyper Key: Caps Lock" with the tap action (e.g., "Tap: Escape")

#### Scenario: Show Tab-based hyper key
- **WHEN** user loads a config that uses `tab` as the hyper key
- **THEN** the UI displays "Hyper Key: Tab" with the tap action (e.g., "Tap: Tab")

### Requirement: Change hyper key trigger
The system SHALL allow the user to change the hyper key trigger between Caps Lock and Tab.

#### Scenario: Switch from Caps Lock to Tab
- **WHEN** user selects "Tab" as the hyper key trigger
- **THEN** the hyper key activator rule updates to use `tab` as the `from.key_code` and sets `to_if_alone` to send `tab`

#### Scenario: Switch from Tab to Caps Lock
- **WHEN** user selects "Caps Lock" as the hyper key trigger
- **THEN** the hyper key activator rule updates to use `caps_lock` as the `from.key_code` and sets `to_if_alone` to send `escape`

### Requirement: Create hyper key from scratch
The system SHALL allow creating a new hyper key configuration when no existing config is loaded.

#### Scenario: Start with empty config
- **WHEN** user clicks "New Configuration" without pasting any JSON
- **THEN** the system creates a default hyper key activator (Caps Lock, tap = Escape) with no sublayers, and enters the editor
