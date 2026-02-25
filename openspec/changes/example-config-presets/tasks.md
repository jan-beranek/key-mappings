## 1. Preset Data Module

- [x] 1.1 Create `src/js/example-presets.js` with a `SIMPLE_EXAMPLE` constant — a JS object representing a valid Karabiner rules array with: Caps Lock hyper activator (Escape on tap), direct bindings for Safari (S), Terminal (T), VS Code (C), Finder (F), Slack (L), and Vim arrow keys (H/J/K/L)
- [x] 1.2 Add a `FULL_EXAMPLE` constant to `src/js/example-presets.js` — a JS object representing a valid Karabiner rules array with: Caps Lock hyper activator (Escape on tap), sublayer O (Open Apps: Safari, Terminal, VS Code, Finder, Slack, Spotify, Teams, Outlook, Messages, ChatGPT), sublayer W (Window Management: H=left half, L=right half, K=maximize, J=bottom half via key combos), sublayer S (System: U=volume up, D=volume down, M=mute, P=play/pause, N=next track, B=prev track), sublayer V (Vim Navigation: H/J/K/L as arrow keys)
- [x] 1.3 Export a helper function `getPresetJSON(preset)` that takes a preset object and returns a formatted JSON string (4-space indent)

## 2. Paste View UI Changes

- [x] 2.1 Add two buttons to `#paste-actions` in `src/index.html`: "Simple Example" (`#btn-example-simple`) and "Full Example" (`#btn-example-full`), using `btn-ghost` class for visual distinction from Load/New buttons
- [x] 2.2 Update `src/styles/paste-view.css` to handle the 4-button row layout — ensure buttons wrap gracefully on narrow viewports and preset buttons are visually distinct (ghost/outline style)

## 3. Event Handlers

- [x] 3.1 In `src/js/app.js`, import preset data and wire up click handlers for `#btn-example-simple` and `#btn-example-full` — each populates `#json-input` textarea with the formatted JSON string of the corresponding preset, clears any existing error message

## 4. Verification

- [x] 4.1 Verify both presets load correctly: click each preset button, then click "Load Configuration" — confirm the editor shows all expected triggers, sublayers, and bindings without errors
- [x] 4.2 Verify round-trip: load each preset, click "Copy JSON", paste back into textarea, load again — confirm identical editor state
