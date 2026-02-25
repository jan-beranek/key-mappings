## Context

KEKE's paste view currently shows a textarea and two buttons ("Load Configuration", "New Configuration"). Users without an existing `karabiner.json` hit "New Configuration" and face an empty editor with no guidance on how sublayers, bindings, or action types work. The hyper key configuration pattern — with variable-based activation, sublayer state management, and mnemonic key grouping — is well-established in the community (mxstbr/karabiner, Vonng/Capslock, karabiner.ts) but non-obvious to newcomers.

The project's own `open-apps.json` demonstrates the sublayer pattern but exists only as a standalone file — it's not surfaced in the UI.

## Goals / Non-Goals

**Goals:**
- Give users immediate working examples at two complexity levels
- Teach configuration patterns by example (flat bindings vs. sublayers)
- Populate the textarea (not load directly into editor) so users can inspect/modify JSON before loading
- Keep the initial screen focused: JSON input + action buttons only

**Non-Goals:**
- Custom preset builder or preset management UI
- Saving/persisting user-created presets
- Importing presets from URLs or external sources
- Modifying the editor view in any way

## Decisions

### 1. Presets populate textarea, not editor directly

**Decision:** Clicking a preset button fills `#json-input` with the preset JSON string. The user then clicks "Load Configuration" to enter the editor.

**Rationale:** This lets users inspect the JSON structure before loading, teaches the JSON format, and reuses the existing load flow without introducing a parallel code path. Alternative (loading directly into editor) would bypass the learning opportunity and require duplicating validation logic.

### 2. Preset data as a dedicated JS module

**Decision:** Create `src/js/example-presets.js` exporting two constants — each being a complete Karabiner rules array as a JavaScript object. The button handlers serialize these to formatted JSON strings.

**Rationale:** Keeping presets as JS objects (not raw strings) means they're validated at build time and easy to maintain. A dedicated module isolates preset data from app logic. Alternative (inline JSON strings in `app.js`) would be harder to read and maintain.

### 3. Button layout — horizontal group below textarea

**Decision:** All four buttons arranged in a single row: `[Load Configuration] [New Configuration] [Simple Example] [Full Example]`. The preset buttons use a distinct visual style (ghost/outline) to differentiate them from the primary actions.

**Rationale:** Keeps the paste view compact. Preset buttons are secondary actions (they prepare data for the primary "Load" action). A vertical layout or separate section would make the view unnecessarily tall.

### 4. Simple Example content — flat Caps Lock hyper key

**Decision:** Caps Lock as hyper trigger (Escape on tap). ~8 direct bindings, no sublayers:
- App launchers: Safari (S), Terminal (T), VS Code (C), Finder (F), Slack (L)
- Vim navigation: H/J/K/L as arrow keys

**Rationale:** This is the most universal starting point — every macOS user benefits from a hyper key on Caps Lock with app switching and arrow keys. No sublayers keeps cognitive load minimal. Inspired by the flat pattern seen in Hyperkey.app and basic Karabiner community configs.

### 5. Full Example content — multi-sublayer with mnemonic grouping

**Decision:** Caps Lock as hyper trigger (Escape on tap) + Tab as secondary hyper trigger (Tab on tap). Sublayers on Caps Lock using mnemonic letters:
- **O (Open apps):** Safari, Terminal, VS Code, Finder, Slack, Spotify, Teams, Outlook, Messages, ChatGPT — adapted from the project's `open-apps.json`
- **W (Window management):** H/J/K/L for half-screen positioning, F for fullscreen, using Rectangle-compatible key combos
- **S (System):** Volume up/down/mute (U/D/M), brightness, play/pause (P), next/prev track
- **V (moVe/Vim):** H/J/K/L arrow keys, word-level movement with modifiers

Tab trigger with direct bindings for less-frequent app shortcuts.

**Rationale:** Mirrors the most popular community pattern (mxstbr's sublayer approach). Mnemonic grouping (O=Open, W=Window, S=System, V=Vim) is the established convention. Including both triggers demonstrates KEKE's dual-trigger capability. The `open-apps.json` content is adapted into the O sublayer to show continuity with the project's existing config.

## Risks / Trade-offs

- **Preset examples may not match user's installed apps** → The presets use universally available macOS apps (Safari, Finder, Terminal) plus common third-party apps. Users are expected to modify after loading.
- **Window management key combos are tool-dependent** → The full example uses Rectangle-compatible shortcuts. Users with different window managers will need to adjust. A comment/description in the binding makes this clear.
- **Preset JSON size** → The full example will be ~200-300 lines of JSON. This is fine for a textarea but the stringified constant in the JS module will be substantial. Using JS objects (not strings) keeps the source readable.
