## MODIFIED Requirements

### Requirement: Display hyper key trigger configuration
The system SHALL display which physical key is configured as the hyper key trigger via the top-level nodes of the tree in the left panel. The active trigger key node SHALL be visually distinguished (bold, expanded) and the inactive trigger key node SHALL appear dimmed and collapsed.

#### Scenario: Show detected hyper key trigger
- **WHEN** user loads a config that uses `caps_lock` as the hyper key
- **THEN** the tree shows "Caps Lock" as the first top-level node (active, expanded, bold) and "Tab" as the second top-level node (inactive, dimmed, collapsed)

#### Scenario: Show Tab-based hyper key
- **WHEN** user loads a config that uses `tab` as the hyper key
- **THEN** the tree shows "Tab" as the active top-level node (expanded, bold) and "Caps Lock" as inactive (dimmed, collapsed)

### Requirement: Change hyper key trigger
The system SHALL allow the user to change the hyper key trigger by clicking the inactive trigger key node in the tree.

#### Scenario: Switch from Caps Lock to Tab
- **WHEN** user clicks the "Tab" top-level node while "Caps Lock" is active
- **THEN** the trigger key switches to `tab`, the "Tab" node becomes active and expanded showing sublayers and bindings, and "Caps Lock" becomes inactive and collapsed

#### Scenario: Switch from Tab to Caps Lock
- **WHEN** user clicks the "Caps Lock" top-level node while "Tab" is active
- **THEN** the trigger key switches to `caps_lock`, the "Caps Lock" node becomes active and expanded, and "Tab" becomes inactive and collapsed

## REMOVED Requirements

### Requirement: Display hyper key trigger configuration
**Reason**: The header dropdown display is replaced by tree-level trigger key nodes in the left panel.
**Migration**: Trigger key display and tap action info are now shown within the tree's top-level nodes.
