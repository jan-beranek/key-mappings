## Why

Editing Karabiner Elements hyper key + sublayer configurations requires manually crafting verbose JSON (often 1000+ lines for a typical setup). No purpose-built visual editor exists for this specific use case. Users need a simple, focused tool to manage their app-launcher and sublayer bindings without touching raw JSON.

## What Changes

- A single-page web application (single HTML file, no server required) for visually editing Karabiner hyper key configurations
- Paste-in / copy-out JSON workflow: user pastes their `karabiner.json` complex modifications, edits via UI, copies the result
- Purpose-built UI for the hyper key + sublayer pattern: activate sublayers via Hyper+key, bind actions (app launch, shell commands, key combos) within each sublayer
- Support for both Caps Lock and Tab as hyper key trigger
- Visual keyboard-like layout showing bindings per sublayer
- Add/remove/edit sublayers and their bindings through form controls

## Capabilities

### New Capabilities
- `json-io`: Paste-in / copy-out of Karabiner complex modification JSON. Parse hyper key rules from raw JSON, serialize edited config back to valid Karabiner JSON.
- `hyper-key-config`: Configure the hyper key trigger (Caps Lock or Tab), tap behavior (Escape/Tab), and core hyper variable setup.
- `sublayer-editor`: Create, rename, delete sublayers. Add/edit/remove bindings within each sublayer. Support action types: app launch (`shell_command: open -a`), key combos, and arbitrary shell commands.
- `binding-visualization`: Visual grid/keyboard representation showing which keys are bound in the active sublayer, with quick identification of available vs used keys.

### Modified Capabilities

(none -- greenfield project)

## Impact

- New files: single `index.html` (or small set of static files) in the project root
- No backend dependencies -- runs entirely in the browser
- No build step required for basic usage
- Tech stack is contained within the HTML file (inline CSS/JS or lightweight CDN dependencies)
