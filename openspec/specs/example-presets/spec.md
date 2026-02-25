## ADDED Requirements

### Requirement: Simple example preset
The system SHALL provide a "Simple Example" button on the paste view that populates the JSON textarea with a minimal hyper key configuration using Caps Lock as the trigger.

#### Scenario: User clicks Simple Example button
- **WHEN** the user clicks the "Simple Example" button
- **THEN** the JSON textarea is populated with a valid Karabiner rules array containing:
  - A Caps Lock hyper key activator (sets `hyper` variable to 1 on hold, sends Escape on tap)
  - Direct bindings for common app launchers (Safari, Terminal/iTerm, VS Code, Finder, Slack)
  - Direct bindings for Vim-style arrow keys (H=left, J=down, K=up, L=right)
  - No sublayers

#### Scenario: Simple example is valid loadable JSON
- **WHEN** the Simple Example JSON is in the textarea and the user clicks "Load Configuration"
- **THEN** the configuration loads successfully into the editor with all bindings visible under the Caps Lock trigger

#### Scenario: Simple example does not auto-load
- **WHEN** the user clicks "Simple Example"
- **THEN** the editor view does NOT appear — the user remains on the paste view with the textarea populated, allowing inspection and modification before loading

### Requirement: Full example preset
The system SHALL provide a "Full Example" button on the paste view that populates the JSON textarea with a feature-rich multi-sublayer hyper key configuration.

#### Scenario: User clicks Full Example button
- **WHEN** the user clicks the "Full Example" button
- **THEN** the JSON textarea is populated with a valid Karabiner rules array containing:
  - A Caps Lock hyper key activator (sets `hyper` variable to 1 on hold, sends Escape on tap)
  - A sublayer "O" (Open Apps) with bindings for common applications
  - A sublayer "W" (Window Management) with bindings for window positioning using key combos
  - A sublayer "S" (System Controls) with bindings for volume, media playback, and brightness
  - A sublayer "V" (Vim Navigation) with bindings for arrow key movement from the home row

#### Scenario: Full example is valid loadable JSON
- **WHEN** the Full Example JSON is in the textarea and the user clicks "Load Configuration"
- **THEN** the configuration loads successfully into the editor with all sublayers and bindings visible, demonstrating the tree navigation, key grid coloring, and binding editor

#### Scenario: Full example does not auto-load
- **WHEN** the user clicks "Full Example"
- **THEN** the editor view does NOT appear — the user remains on the paste view with the textarea populated

### Requirement: Preset buttons visual distinction
The system SHALL visually distinguish preset buttons from the primary action buttons (Load, New Configuration).

#### Scenario: Preset buttons appear as secondary actions
- **WHEN** the paste view is rendered
- **THEN** the "Simple Example" and "Full Example" buttons SHALL use a ghost/outline style distinct from the primary "Load Configuration" button and the secondary "New Configuration" button

#### Scenario: All buttons are in one row
- **WHEN** the paste view is rendered
- **THEN** all action buttons (Load, New, Simple Example, Full Example) SHALL be displayed in a single horizontal row below the textarea
