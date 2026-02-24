## 1. Project Scaffold

- [x] 1.1 Create `index.html` with base HTML structure, inline `<style>` and `<script>` sections, and app shell layout (header, sidebar, main content area)
- [x] 1.2 Define CSS custom properties for theming (colors, spacing, radii) and base styles (reset, typography, layout grid)

## 2. State Management

- [x] 2.1 Implement the config store: a JS class that holds the parsed config (hyper key settings, sublayers, bindings, pass-through rules) and emits change events via EventTarget
- [x] 2.2 Implement default config factory: create a new empty hyper key config (Caps Lock trigger, Escape on tap, no sublayers)

## 3. JSON Parser

- [x] 3.1 Implement `parseRules(rulesArray)`: walk manipulators to identify hyper key activator (sets `hyper` variable on trigger key), sublayer activators (sets `hyper_sublayer_*`), sublayer bindings (conditioned on `hyper_sublayer_*`), and direct hyper bindings (conditioned only on `hyper == 1`)
- [x] 3.2 Implement input normalization: detect whether pasted JSON is a full `karabiner.json` (extract `profiles[0].complex_modifications.rules`) or a bare rules array, with error handling for invalid JSON
- [x] 3.3 Collect unrecognized rules as pass-through (preserved in output, not editable)

## 4. JSON Serializer

- [x] 4.1 Implement `serializeConfig(config)`: generate the hyper key activator rule with correct `from`, `to` (set_variable), `to_if_alone`, `to_after_key_up`
- [x] 4.2 Generate sublayer rules: for each sublayer, create activator manipulator (conditioned on `hyper == 1`, sets `hyper_sublayer_X`) and binding manipulators (conditioned on `hyper_sublayer_X == 1`) with proper `from`, `to`, and `modifiers.optional: ["any"]`
- [x] 4.3 Generate direct hyper binding rules (conditioned on `hyper == 1` only)
- [x] 4.4 Merge generated rules with pass-through rules in correct order and output as formatted JSON array

## 5. JSON I/O UI

- [x] 5.1 Build the paste input view: textarea with "Load" button, error display area, and "New Configuration" button
- [x] 5.2 Build the copy output panel: "Copy JSON" button that serializes current config and copies to clipboard, with success feedback

## 6. Hyper Key Config UI

- [x] 6.1 Build hyper key settings panel: display current trigger key (Caps Lock / Tab) with a toggle/select to switch, and display tap behavior
- [x] 6.2 Wire trigger key changes to the config store (update hyper activator rule)

## 7. Sublayer List & Management

- [x] 7.1 Build sublayer list component: show all sublayers with activation key, label, and binding count; highlight selected sublayer; include "Direct" pseudo-sublayer for hyper-only bindings
- [x] 7.2 Build "Add Sublayer" form: key input (single letter) + label input, with duplicate key validation
- [x] 7.3 Implement sublayer delete with confirmation
- [x] 7.4 Implement sublayer label rename (inline edit)

## 8. Binding Editor

- [x] 8.1 Build binding list for selected sublayer: show each binding's key, action type, and value in a compact row with edit/delete controls
- [x] 8.2 Build binding add/edit form: key selector, action type dropdown (Open App / Shell Command / Key Combo), value input with appropriate placeholder per type, save/cancel buttons
- [x] 8.3 Implement duplicate key validation within a sublayer
- [x] 8.4 Implement binding delete

## 9. Key Grid Visualization

- [x] 9.1 Build key grid component: CSS Grid of letter/number keys showing bound status (highlighted with action label) vs available (dimmed) for the selected sublayer
- [x] 9.2 Wire grid clicks: click bound key opens edit form, click unbound key opens add form pre-filled with that key
- [x] 9.3 In "Direct" view, mark sublayer activation keys distinctly from available keys and direct bindings

## 10. Integration & Polish

- [x] 10.1 Wire all components together: paste → parse → populate editor → edit → serialize → copy
- [x] 10.2 Test round-trip fidelity: paste a known mxstbr-style config, make no edits, verify output matches input semantically
- [x] 10.3 Test with real karabiner.json configs to verify parser handles edge cases (missing optional fields, extra properties)
