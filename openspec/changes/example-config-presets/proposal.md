## Why

New users arriving at the paste view face a blank textarea with no guidance on what a valid configuration looks like. Unless they already have a `karabiner.json` to paste, their only option is "New Configuration" which opens an empty editor — leaving them to figure out the data model (triggers, sublayers, bindings, action types) from scratch. Adding example preset buttons gives users an immediate, working starting point and teaches the configuration patterns by example.

## What Changes

- **Remove the binding editor panel from the initial paste view.** The initial screen should show only the JSON input area and action buttons — the full editor UI appears only after a configuration is loaded.
- **Add two example preset buttons** alongside the existing "Load Configuration" and "New Configuration" buttons:
  1. **"Simple Example"** — A minimal, flat hyper key setup with Caps Lock as trigger, ~8 direct bindings for common apps and Vim-style arrow keys. No sublayers. Designed for easy first-time understanding.
  2. **"Full Example"** — A feature-rich multi-sublayer setup inspired by popular community configurations (mxstbr, Vonng/Capslock) and the project's own `open-apps.json`. Includes sublayers for app launching, window management, system controls, and Vim navigation. Demonstrates the full power of the tool.
- Each preset button populates the JSON textarea with valid Karabiner rules JSON so the user can inspect the configuration before loading it, or modify it before loading.

## Capabilities

### New Capabilities
- `example-presets`: Preset example configurations that populate the JSON textarea with valid Karabiner hyper key configurations, providing starter templates at two complexity levels.

### Modified Capabilities
- `json-io`: The paste view layout changes — the initial screen should only contain the JSON input area and action buttons (no editor UI visible). Two new preset buttons are added to the action area.

## Impact

- **UI**: `src/index.html` — paste view layout (add preset buttons)
- **JS**: `src/js/app.js` — event handlers for new preset buttons
- **JS**: New module `src/js/example-presets.js` — contains the two preset JSON configurations as constants
- **CSS**: `src/styles/paste-view.css` — styling for additional buttons, potentially button group layout
- **No breaking changes** — existing "Load" and "New Configuration" buttons remain unchanged
