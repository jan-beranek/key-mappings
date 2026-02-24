# Karabiner Elements: Hyper Key, Sublayers & Configuration Guide

A comprehensive reference for the Hyper Key pattern, sublayer architecture, and the ecosystem of tools for managing Karabiner Elements configurations on macOS.

---

## Table of Contents

1. [Karabiner Elements Overview](#1-karabiner-elements-overview)
2. [Configuration File Structure](#2-configuration-file-structure)
3. [Complex Modifications: The Building Blocks](#3-complex-modifications-the-building-blocks)
4. [The Hyper Key Concept](#4-the-hyper-key-concept)
5. [Caps Lock as Hyper Key](#5-caps-lock-as-hyper-key)
6. [Tab as Hyper Key](#6-tab-as-hyper-key)
7. [The Sublayer Pattern](#7-the-sublayer-pattern)
8. [Virtual Modifiers and Variables](#8-virtual-modifiers-and-variables)
9. [Practical Examples](#9-practical-examples)
10. [Notable Community Configurations](#10-notable-community-configurations)
11. [Configuration Generator Tools](#11-configuration-generator-tools)
12. [UI Tools and Visual Editors](#12-ui-tools-and-visual-editors)
13. [Comparison with QMK/ZMK Firmware Layers](#13-comparison-with-qmkzmk-firmware-layers)
14. [Resources and Links](#14-resources-and-links)

---

## 1. Karabiner Elements Overview

Karabiner Elements is a powerful keyboard customizer for macOS. It operates at the system level (via DriverKit on modern macOS) and intercepts keyboard events before they reach applications. It supports:

- **Simple modifications** -- one-to-one key remaps (e.g., Caps Lock to Escape)
- **Complex modifications** -- conditional, multi-step key transformations with variables, conditions, layers, shell commands, and more
- **Device-specific rules** -- different behavior per keyboard (vendor/product ID filtering)
- **Per-application rules** -- different behavior per active application (bundle identifier filtering)
- **Multiple profiles** -- switch between entire configuration sets

Karabiner Elements watches its config file and hot-reloads on any change. This means any tool that writes valid JSON to the config file will take effect immediately.

---

## 2. Configuration File Structure

### File Location

```
~/.config/karabiner/karabiner.json
```

The directory can be relocated via symlink (symlink the `~/.config/karabiner/` directory, not the file itself) or via the `XDG_CONFIG_HOME` environment variable.

### Top-Level Structure

```json
{
    "global": {
        "check_for_updates_on_startup": true,
        "show_in_menu_bar": true,
        "show_profile_name_in_menu_bar": false
    },
    "profiles": [
        {
            "name": "Default",
            "selected": true,
            "simple_modifications": [],
            "fn_function_keys": [],
            "complex_modifications": {
                "parameters": {
                    "basic.to_if_alone_timeout_milliseconds": 200,
                    "basic.to_if_held_down_threshold_milliseconds": 200
                },
                "rules": []
            },
            "virtual_hid_keyboard": {
                "keyboard_type": "ansi",
                "caps_lock_delay_milliseconds": 0
            },
            "devices": []
        }
    ]
}
```

### Key Parameters

| Parameter | Default | Description |
|---|---|---|
| `basic.to_if_alone_timeout_milliseconds` | 1000 | Max time for a key press to be considered "alone" (tap) |
| `basic.to_if_held_down_threshold_milliseconds` | 500 | Min time holding a key before `to_if_held_down` triggers |
| `basic.to_delayed_action_delay_milliseconds` | 500 | Delay before `to_delayed_action.to_if_invoked` triggers |
| `basic.simultaneous_threshold_milliseconds` | 50 | Max time gap between keys to count as simultaneous |

---

## 3. Complex Modifications: The Building Blocks

Complex modifications are defined as **rules**, each containing one or more **manipulators**. A manipulator has a `from` event (what you press) and various `to` events (what happens).

### Manipulator Structure

```json
{
    "type": "basic",
    "description": "Human-readable description",

    "from": {
        "key_code": "a",
        "modifiers": {
            "mandatory": ["control"],
            "optional": ["caps_lock", "shift"]
        }
    },

    "to": [
        { "key_code": "b", "modifiers": ["left_shift"] }
    ],

    "to_if_alone": [
        { "key_code": "escape" }
    ],

    "to_if_held_down": [
        { "key_code": "left_control" }
    ],

    "to_after_key_up": [
        { "set_variable": { "name": "my_var", "value": 0 } }
    ],

    "to_delayed_action": {
        "to_if_invoked": [],
        "to_if_canceled": []
    },

    "conditions": [],

    "parameters": {}
}
```

### Manipulator Fields Reference

| Field | When it fires | Common use |
|---|---|---|
| `from` | Defines the trigger key + modifiers | The input event to match |
| `to` | Immediately on key press | Primary action: send key, set variable, run shell command |
| `to_if_alone` | Key pressed and released without other keys | Dual-role keys: tap = one thing, hold = another |
| `to_if_held_down` | Key held past threshold | Activate modifier or layer on sustained press |
| `to_after_key_up` | Key released | Clean up variables, reset layer state |
| `to_delayed_action` | After delay if no other key pressed | Timeout-based actions |
| `conditions` | Guards that must be true for rule to apply | Variable checks, app checks, device checks |

### From Event: Key Specification

The `from` object accepts one of these mutually exclusive key types:

- `"key_code"` -- standard keyboard keys (`"a"`, `"tab"`, `"caps_lock"`, `"f1"`, `"spacebar"`, etc.)
- `"consumer_key_code"` -- media/consumer keys (`"volume_up"`, `"play_or_pause"`, `"dictation"`, etc.)
- `"pointing_button"` -- mouse buttons (`"button1"`, `"button2"`, etc.)
- `"any"` -- matches any key type (`"key_code"`, `"consumer_key_code"`, or `"pointing_button"`)

### From Event: Modifiers

```json
"modifiers": {
    "mandatory": ["control", "shift"],
    "optional": ["caps_lock"]
}
```

- **`mandatory`** -- these modifiers MUST be pressed. They are **removed** from the output event.
- **`optional`** -- these modifiers MAY be pressed. They are **kept** in the output event.
- Use `"optional": ["any"]` to allow the rule to fire regardless of what modifiers are held.

Available modifier values: `"left_control"`, `"left_shift"`, `"left_option"`, `"left_command"`, `"right_control"`, `"right_shift"`, `"right_option"`, `"right_command"`, `"control"` (either side), `"shift"`, `"option"`, `"command"`, `"caps_lock"`, `"fn"`, `"any"`.

### To Event: Actions

A `to` event can contain:

```json
{ "key_code": "a", "modifiers": ["left_shift"] }
{ "consumer_key_code": "volume_up" }
{ "shell_command": "open -a 'Safari.app'" }
{ "set_variable": { "name": "my_layer", "value": 1 } }
{ "apple_vendor_keyboard_key_code": "mission_control" }
{ "key_code": "vk_none" }
```

Special properties on `to` events:

| Property | Type | Description |
|---|---|---|
| `modifiers` | array | Modifier keys to apply with the key event |
| `lazy` | boolean | Don't send modifier until a non-modifier key is pressed |
| `repeat` | boolean | Whether the key repeats when held (default: true) |
| `halt` | boolean | Stop processing further `to` events |
| `hold_down_milliseconds` | number | Hold the key down for specified duration |

### Conditions

Conditions determine WHEN a manipulator is active:

```json
// Variable condition
{ "type": "variable_if", "name": "hyper_mode", "value": 1 }
{ "type": "variable_unless", "name": "hyper_mode", "value": 1 }

// Application condition
{
    "type": "frontmost_application_if",
    "bundle_identifiers": ["^com\\.apple\\.Safari$"]
}
{
    "type": "frontmost_application_unless",
    "bundle_identifiers": ["^com\\.apple\\.Terminal$"]
}

// Device condition
{
    "type": "device_if",
    "identifiers": [{ "vendor_id": 1133, "product_id": 50488 }]
}

// Expression condition (advanced, for timing)
{
    "type": "expression_if",
    "expression": "my_var_expiration > system.now.milliseconds"
}
```

---

## 4. The Hyper Key Concept

### Historical Origin

The Hyper key originates from the **MIT Space-Cadet keyboard** (1978), designed for Lisp machines. It was a physical modifier key alongside Super, Meta, Control, and Shift. The X Window System (1984) and Emacs relied on it heavily. Modern keyboards dropped the physical Hyper key, but the concept lives on in software.

### Modern Definition

A **Hyper key** maps a single physical key to pressing **all four macOS modifiers simultaneously**: `Command + Control + Option + Shift`. This creates a modifier combination that no application uses by default, giving you an entirely **conflict-free namespace** for custom shortcuts.

### Why It Works

- No application binds shortcuts to `Cmd+Ctrl+Opt+Shift+[key]`
- You get 40+ unique global hotkeys (one per letter/number/symbol key)
- Works system-wide, across all applications
- The single-key activation is ergonomically efficient

### The Two Common Trigger Keys

| Key | Pros | Cons |
|---|---|---|
| **Caps Lock** | Rarely used for its original purpose; easy to reach with pinky; universal convention | Requires remapping in System Settings or Karabiner; some users want Caps Lock for actual caps |
| **Tab** | Even easier to reach (home row adjacent); allows `to_if_alone` to preserve Tab functionality | More complex config needed to preserve Tab's normal behavior; can interfere with fast typing |

### Dual-Role Behavior

The most powerful aspect is making the trigger key **dual-purpose**:

- **Tapped alone** (quick press and release): sends the original key (Escape for Caps Lock, Tab for Tab)
- **Held with another key**: activates the Hyper modifier

This is implemented using Karabiner's `to_if_alone` (for the tap behavior) combined with `to` or `to_if_held_down` (for the hold behavior).

---

## 5. Caps Lock as Hyper Key

### Basic Implementation: Caps Lock to Hyper (Escape on tap)

```json
{
    "description": "Caps Lock -> Hyper Key (Escape when tapped alone)",
    "manipulators": [
        {
            "type": "basic",
            "from": {
                "key_code": "caps_lock",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                {
                    "key_code": "left_shift",
                    "modifiers": ["left_control", "left_option", "left_command"]
                }
            ],
            "to_if_alone": [
                { "key_code": "escape" }
            ]
        }
    ]
}
```

**How it works:**

1. When Caps Lock is pressed, it immediately sends `Shift+Ctrl+Opt+Cmd` (the Hyper combo)
2. If Caps Lock is released quickly without pressing any other key, it sends `Escape` instead
3. The `"optional": ["any"]` in `from.modifiers` ensures the rule fires even if other modifiers are held

### Variable-Based Implementation (for sublayers)

For sublayer support, a variable-based approach is more flexible:

```json
{
    "description": "Caps Lock -> Set Hyper variable",
    "manipulators": [
        {
            "type": "basic",
            "from": {
                "key_code": "caps_lock",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "set_variable": { "name": "hyper", "value": 1 } }
            ],
            "to_if_alone": [
                { "key_code": "escape" }
            ],
            "to_after_key_up": [
                { "set_variable": { "name": "hyper", "value": 0 } }
            ]
        }
    ]
}
```

This sets a `hyper` variable to `1` while Caps Lock is held, which other rules can check via `variable_if` conditions.

### macOS System Settings Prerequisite

Before using Caps Lock in Karabiner, you may need to remap it in **System Settings > Keyboard > Modifier Keys** to "No Action" to prevent macOS from intercepting the Caps Lock event. Alternatively, Karabiner's `simple_modifications` can handle this directly.

### Standalone Alternative: Hyperkey.app

[Hyperkey.app](https://hyperkey.app/) is a standalone macOS app that provides just the Caps Lock to Hyper mapping without needing Karabiner Elements. However, it does **not** support sublayers, variables, or complex modifications. It's a simpler alternative if you only need basic Hyper key functionality.

---

## 6. Tab as Hyper Key

Using Tab as a Hyper key is less common but has ergonomic advantages -- it's on the home row and easier to press than Caps Lock with the pinky.

### Tab as Hyper with Variable (preserving Tab on tap)

```json
{
    "description": "Tab -> Hyper variable (Tab when tapped alone)",
    "manipulators": [
        {
            "type": "basic",
            "from": {
                "key_code": "tab",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "set_variable": { "name": "hyper", "value": 1 } }
            ],
            "to_if_alone": [
                { "key_code": "tab" }
            ],
            "to_after_key_up": [
                { "set_variable": { "name": "hyper", "value": 0 } }
            ]
        }
    ]
}
```

### Tab-Specific Considerations

1. **Fast typing interference**: When typing quickly, Tab might be held briefly while the next key is pressed, potentially triggering Hyper actions. The `basic.to_if_alone_timeout_milliseconds` parameter (default: 1000ms, commonly set to 200ms) controls how quickly you must release Tab for it to register as a tap.

2. **Tab in terminal/code editors**: Tab is heavily used for indentation and autocompletion. You may want to add `frontmost_application_unless` conditions to disable the Hyper behavior in specific apps:

```json
"conditions": [
    {
        "type": "frontmost_application_unless",
        "bundle_identifiers": [
            "^com\\.apple\\.Terminal$",
            "^com\\.googlecode\\.iterm2$"
        ]
    }
]
```

3. **Shift+Tab**: Make sure `"optional": ["any"]` is set in modifiers so Shift+Tab (reverse-tab) still works.

### Tab vs Caps Lock: Comparison

| Aspect | Caps Lock | Tab |
|---|---|---|
| **Finger** | Left pinky | Left pinky or ring finger |
| **Reach** | Slight stretch down-left | On home row, natural position |
| **Original function** | Rarely needed (toggle caps) | Frequently used (indent, autocomplete, tab-switch) |
| **Dual-role complexity** | Low (Escape on tap is rarely problematic) | Medium (Tab on tap can misfire during fast typing) |
| **Community adoption** | Very high (the standard approach) | Lower (niche, used by power users) |
| **App conflicts** | Minimal | Possible in terminals, code editors, web forms |

---

## 7. The Sublayer Pattern

### Concept

Sublayers extend the Hyper key from a flat namespace (Hyper + key) to a **two-level hierarchy** (Hyper + category key, then action key). This multiplies the available shortcuts dramatically.

Instead of:
- Hyper + S = Safari
- Hyper + T = Terminal
- Hyper + C = Chrome (only ~30 keys available)

You get:
- Hyper + O (Open apps sublayer), then S = Safari
- Hyper + O, then T = Terminal
- Hyper + W (Window sublayer), then H = left half
- Hyper + S (System sublayer), then U = volume up
- (26 sublayers x ~30 keys each = ~780 possible bindings)

### How It Works Technically

1. **Hyper key pressed**: Sets `hyper` variable to `1`
2. **Sublayer key pressed** (e.g., `o` while hyper is active): Sets `hyper_sublayer_o` variable to `1`
3. **Action key pressed** (e.g., `s` while sublayer_o is active): Triggers the action (e.g., open Safari)
4. **Sublayer key released**: `to_after_key_up` resets `hyper_sublayer_o` to `0`
5. **Hyper key released**: `to_after_key_up` resets `hyper` to `0`

### Mutual Exclusion

Each sublayer activation rule should check that no OTHER sublayer is currently active. This prevents conflicts when switching between sublayers:

```json
{
    "description": "Toggle Hyper sublayer o",
    "conditions": [
        { "type": "variable_if", "name": "hyper", "value": 1 },
        { "type": "variable_if", "name": "hyper_sublayer_w", "value": 0 },
        { "type": "variable_if", "name": "hyper_sublayer_s", "value": 0 }
    ],
    "from": {
        "key_code": "o",
        "modifiers": { "optional": ["any"] }
    },
    "to": [
        { "set_variable": { "name": "hyper_sublayer_o", "value": 1 } }
    ],
    "to_after_key_up": [
        { "set_variable": { "name": "hyper_sublayer_o", "value": 0 } }
    ],
    "type": "basic"
}
```

### Complete Sublayer Example: App Launcher

```json
{
    "description": "Hyper + E sublayer -> Open apps",
    "manipulators": [
        {
            "type": "basic",
            "description": "Activate sublayer E",
            "conditions": [
                { "type": "variable_if", "name": "hyper", "value": 1 }
            ],
            "from": {
                "key_code": "e",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "set_variable": { "name": "hyper_sublayer_e", "value": 1 } }
            ],
            "to_after_key_up": [
                { "set_variable": { "name": "hyper_sublayer_e", "value": 0 } }
            ]
        },
        {
            "type": "basic",
            "description": "E + S -> Safari",
            "conditions": [
                { "type": "variable_if", "name": "hyper_sublayer_e", "value": 1 }
            ],
            "from": {
                "key_code": "s",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "shell_command": "open -a 'Safari.app'" }
            ]
        },
        {
            "type": "basic",
            "description": "E + T -> Terminal",
            "conditions": [
                { "type": "variable_if", "name": "hyper_sublayer_e", "value": 1 }
            ],
            "from": {
                "key_code": "t",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "shell_command": "open -a 'Terminal.app'" }
            ]
        },
        {
            "type": "basic",
            "description": "E + C -> VS Code",
            "conditions": [
                { "type": "variable_if", "name": "hyper_sublayer_e", "value": 1 }
            ],
            "from": {
                "key_code": "c",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "shell_command": "open -a 'Visual Studio Code.app'" }
            ]
        }
    ]
}
```

### Canonical Sublayer Layout (mxstbr)

Max Stoiber's widely-forked configuration defines these sublayers:

| Hyper + Key | Category | Bindings |
|---|---|---|
| `o` | **Open** apps | `1`=1Password, `g`=Chrome, `v`=Zed, `d`=Discord, `s`=Slack, `e`=Superhuman, `n`=Notion, `t`=Terminal, `z`=Zoom, `f`=Finder, `p`=Spotify |
| `w` | **Window** management | `h`=left half, `l`=right half, `k`=top half, `j`=bottom half, `f`=maximize, `y`=prev display, `o`=next display |
| `s` | **System** controls | `u`/`j`=volume up/down, `i`/`k`=brightness up/down, `p`=play/pause, `d`=Do Not Disturb, `l`=lock screen |
| `v` | **moVe** (Vim nav) | `h`=left, `j`=down, `k`=up, `l`=right (arrow keys) |
| `c` | **musiC** controls | `p`=play/pause, `n`=next, `b`=previous |
| `r` | **Raycast** utilities | `c`=color picker, `e`=emoji, `l`=clipboard history, `a`=AI chat |
| `b` | **Browse** websites | `t`=Twitter, `r`=Reddit, `y`=Hacker News, `f`=Facebook |

---

## 8. Virtual Modifiers and Variables

### The Variable System

Karabiner Elements has an internal variable system that enables stateful behavior. Variables are global, persist across rules, and can be integers, booleans, or strings.

**Setting a variable:**
```json
{ "set_variable": { "name": "my_mode", "value": 1 } }
```

**Checking a variable:**
```json
{ "type": "variable_if", "name": "my_mode", "value": 1 }
{ "type": "variable_unless", "name": "my_mode", "value": 1 }
```

**Expression-based variables (for timing):**
```json
{
    "set_variable": {
        "name": "double_tap_expiration",
        "expression": "system.now.milliseconds + 300"
    }
}
```

### Unset Variables Default to 0

A variable that has never been set defaults to `0`. This means `variable_if` with `value: 0` will match for any undefined variable, and `variable_if` with `value: 1` will NOT match for any undefined variable.

### Inspecting Variables at Runtime

Use the bundled **Karabiner-EventViewer** application to see variable state in real-time. It shows which variables are set and their current values as you press keys.

### Virtual Modifier Pattern

A "virtual modifier" is a key that acts like a modifier (changes the behavior of other keys while held) but isn't a real macOS modifier. It's implemented entirely via variables:

```json
[
    {
        "type": "basic",
        "description": "Keypad 1 becomes a virtual modifier",
        "from": {
            "key_code": "keypad_1",
            "modifiers": { "optional": ["any"] }
        },
        "to": [
            { "set_variable": { "name": "my_modifier_1", "value": 1 } }
        ],
        "to_after_key_up": [
            { "set_variable": { "name": "my_modifier_1", "value": 0 } }
        ]
    },
    {
        "type": "basic",
        "description": "With virtual mod: A -> Mission Control",
        "from": {
            "key_code": "a",
            "modifiers": { "optional": ["any"] }
        },
        "to": [
            { "apple_vendor_keyboard_key_code": "mission_control" }
        ],
        "conditions": [
            { "type": "variable_if", "name": "my_modifier_1", "value": 1 }
        ]
    }
]
```

The Hyper key itself is essentially a virtual modifier implemented this way.

---

## 9. Practical Examples

### Double-Tap Right Shift for Mission Control

```json
{
    "description": "Double-tap right_shift -> Mission Control",
    "manipulators": [
        {
            "type": "basic",
            "from": {
                "key_code": "right_shift",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                { "apple_vendor_keyboard_key_code": "mission_control" },
                { "key_code": "vk_none" }
            ],
            "conditions": [
                {
                    "type": "expression_if",
                    "expression": "right_shift_x2_expiration > system.now.milliseconds"
                }
            ]
        },
        {
            "type": "basic",
            "from": {
                "key_code": "right_shift",
                "modifiers": { "optional": ["any"] }
            },
            "to": [
                {
                    "set_variable": {
                        "name": "right_shift_x2_expiration",
                        "expression": "system.now.milliseconds + 300"
                    }
                },
                { "key_code": "right_shift" }
            ]
        }
    ]
}
```

### Dual-Role F Key (Shift when held)

```json
{
    "description": "F key -> left_shift when held, f when tapped",
    "manipulators": [
        {
            "type": "basic",
            "from": {
                "key_code": "f",
                "modifiers": { "optional": ["any"] }
            },
            "to_if_alone": [
                { "key_code": "f", "halt": true }
            ],
            "to_if_held_down": [
                { "key_code": "left_shift" }
            ],
            "to_delayed_action": {
                "to_if_canceled": [
                    { "key_code": "f" }
                ]
            },
            "parameters": {
                "basic.to_delayed_action_delay_milliseconds": 500,
                "basic.to_if_held_down_threshold_milliseconds": 500
            }
        }
    ]
}
```

### Device-Specific Mapping (Presenter Remote)

```json
{
    "description": "Logitech R400 -> Desktop switching",
    "manipulators": [
        {
            "type": "basic",
            "conditions": [
                {
                    "type": "device_if",
                    "identifiers": [
                        { "vendor_id": 1133, "product_id": 50488 }
                    ]
                }
            ],
            "from": { "key_code": "f5" },
            "to": [
                {
                    "key_code": "left_arrow",
                    "modifiers": ["left_control"]
                }
            ]
        }
    ]
}
```

### App-Specific Rule (only in Safari)

```json
{
    "type": "basic",
    "description": "Ctrl+J -> Down Arrow in Safari only",
    "from": {
        "key_code": "j",
        "modifiers": { "mandatory": ["control"] }
    },
    "to": [{ "key_code": "down_arrow" }],
    "conditions": [
        {
            "type": "frontmost_application_if",
            "bundle_identifiers": ["^com\\.apple\\.Safari$"]
        }
    ]
}
```

### Shell Command Execution

```json
{
    "type": "basic",
    "description": "Hyper+X -> Run custom script",
    "from": { "key_code": "x" },
    "to": [
        { "shell_command": "bash ~/scripts/my_script.sh" }
    ],
    "conditions": [
        { "type": "variable_if", "name": "hyper", "value": 1 }
    ]
}
```

---

## 10. Notable Community Configurations

### mxstbr/karabiner (Max Stoiber)

- **URL:** https://github.com/mxstbr/karabiner
- **Stars:** ~644, 281 forks
- **Approach:** Custom TypeScript DSL with `rules.ts`, `utils.ts`, `types.ts`. Runs `yarn run build` to compile to `karabiner.json`.
- **Hyper Key:** Caps Lock mapped to `Ctrl+Opt+Shift+Cmd`
- **Sublayers:** Open apps, Window management, System controls, Vim navigation, Music, Raycast utilities, Browse websites
- **Key design:** Sublayers require holding Hyper + sublayer key, then pressing the action key. Mutual exclusion via variables.
- **Best for:** Forking and customizing. The most widely copied sublayer implementation.

### Vonng/Capslock

- **URL:** https://github.com/Vonng/Capslock
- **Stars:** ~1,500
- **Approach:** Raw Karabiner JSON (`capslock.json`). Cross-platform (macOS + Windows via AutoHotkey).
- **Hyper Key:** Caps Lock as full extra keyboard layer (tap = Escape, hold = Hyper)
- **Features:** Vim navigation (HJKL), deletion (word/line/character), mouse control via keypad, window management, app shortcuts across three planes, terminal control shortcuts, ten independent clipboard buffers
- **Key design:** The most comprehensive single-layer implementation. Turns Caps Lock into an entire secondary keyboard.

### Nikita Voloboev's "God Mode"

- **URL:** https://github.com/nikitavoloboev/config
- **Article:** "Karabiner God Mode" on Medium
- **Approach:** Uses GokuRakuJoudo (EDN format). ~22,000+ line JSON output.
- **Key concept:** **Every key** on the keyboard can become a hyper key when held. A, S, D, F, etc. each activate different layers. The entire keyboard becomes a multi-layered control surface.
- **Integrations:** Keyboard Maestro for complex automation, custom `kar` tool for management.
- **Why notable:** Pioneered the extreme multi-layer approach. Motivated GokuRakuJoudo's creation.

### Erlendms/karabiner-actions

- **URL:** https://github.com/Erlendms/karabiner-actions
- **Stars:** ~132
- **Approach:** Uses karabiner.ts (Evan Liu's TypeScript library)
- **Features:** Meh Key (R/U = Shift+Control+Option when held), Hyper Key (Caps Lock/Quote = all four modifiers), Turbo Arrows (5x with Meh, 10x with Hyper), Home Row Mods
- **Key design:** Threshold-based timing (200ms `to_if_held_down_threshold`) for tap vs hold.

### John Lindquist's dotfiles

- **URL:** https://github.com/johnlindquist/dotfiles
- **Approach:** Uses GokuRakuJoudo (EDN format). Creator of egghead.io.
- **Features:** Capslock mode, VS Code mode, Vim mode, "home row computing" (AJKL for arrows and modifiers)
- **Influence:** Popularized Karabiner + Goku among web developers via Twitch streams.

### evan-liu/karabiner-config

- **URL:** https://github.com/evan-liu/karabiner-config
- **Approach:** Author of karabiner.ts using his own library
- **Features:** Dual-modifier system where `fd`/`jk` = Command, `fs`/`jl` = Control, `fa`/`j;` = Option. Plus vim navigation layers, symbol layers, digit layers, snippet layers, app-specific rules.

---

## 11. Configuration Generator Tools

Raw Karabiner JSON for a full sublayer setup can exceed **20,000 lines**. The community has built several tools to manage this complexity.

### karabiner.ts (TypeScript DSL)

- **URL:** https://github.com/evan-liu/karabiner.ts
- **Docs:** https://karabiner.ts.evanliu.dev/
- **Online Editor:** https://karabiner.ts.evanliu.dev/editor/
- **Stars:** ~319 | **License:** MIT | **Last update:** December 2025
- **Install:** `npx create-karabiner-config@latest`

First-class support for the hyper key pattern:

```typescript
import { hyperLayer, map, toApp, writeToProfile } from 'karabiner.ts'

writeToProfile('Default', [
    // Caps Lock -> Hyper (Escape on tap)
    map('caps_lock').toHyper().toIfAlone('escape'),

    // Hyper + L sublayer -> Launch apps
    hyperLayer('l', 'launch-app').manipulators({
        s: toApp('Safari'),
        t: toApp('Terminal'),
        c: toApp('Visual Studio Code'),
        f: toApp('Finder'),
    }),
])
```

**Key abstractions:**
- `hyperLayer('key', 'name')` -- hold Hyper+key to activate a layer
- `duoLayer('z', 'x', 'name')` -- press two keys simultaneously to activate a layer
- `leaderMode('key')` -- Vim-style leader key (layer stays active after release until action or escape)
- `mapSimultaneous(['a', 'b'])` -- trigger on simultaneous key press

### GokuRakuJoudo (Goku)

- **URL:** https://github.com/yqrashawn/GokuRakuJoudo
- **Stars:** ~1,400 | **License:** GPL-3.0 | **Last release:** February 2025
- **Install:** `brew install yqrashawn/goku/goku`
- **Config file:** `~/.config/karabiner.edn`
- **Watch mode:** `gokuw` or `brew services start goku`

Uses Clojure's EDN format for ~6x compression vs raw JSON:

```clojure
{:main [{:des "Hyper Key"
         :rules [
            ;; Caps Lock -> Hyper (Escape alone)
            [:caps_lock ["hyper" 1] nil {:alone :escape
                                         :afterup ["hyper" 0]}]
            ;; Hyper + S -> Safari
            [:s [:open "/Applications/Safari.app"] ["hyper" 1]]
            ;; Hyper + T -> Terminal
            [:t [:open "/Applications/Terminal.app"] ["hyper" 1]]
         ]}]}
```

**Pros:** Most popular generator, largest community of example configs, extremely terse.
**Cons:** EDN syntax has a learning curve if unfamiliar with Clojure/Lisp.

### Karabiner-Human-Config (KHC)

- **URL:** https://github.com/nrjdalal/karabiner-human-config
- **Stars:** ~40 | **License:** MIT | **Last release:** March 2025
- **Install:** `npx karabiner-human-config`
- **Config file:** `konfig.json`

The most human-readable syntax:

```json
{
    "caps": { "t": "hyper", "a": "100 caps" },
    "hyper s": "$ open -a Safari",
    "hyper t": "$ open -a Terminal",
    "fn": {
        "_self": { "t": "fn", "a": "cmd tab" },
        "spacebar": "cmd spacebar"
    }
}
```

**Pros:** Lowest barrier to entry, very intuitive JSON-like syntax, built-in `hyper` alias.
**Cons:** Small community, may not cover all edge cases.

### Karabinerge (JavaScript API)

- **URL:** https://github.com/amekusa/karabinerge
- **Install:** `npm i karabinerge`

Programmatic JavaScript API:

```javascript
import { RuleSet, key } from 'karabinerge'
const rules = new RuleSet('My Hyper Rules')
rules.add('Hyper+S to Safari')
    .remap({ from: key('s', 'control+option+shift+command'), to: key('open -a Safari') })
rules.out()
```

### Other Tools

| Tool | Language | Description |
|---|---|---|
| **karabiner-ts-config** | TypeScript | Fluent builder API, auto duplicate detection, multi-device |
| **deno_karabiner** | TypeScript/Deno | Deno-based generator |
| **Layercake** | Custom DSL | Simple language focused on key layers |
| **karaml** | YAML | YAML-based alternative |
| **Jsonnet** | Jsonnet | General-purpose data templating (officially listed by Karabiner) |

### Comparison

| Tool | Format | Hyper Key Support | Learning Curve | Maintenance |
|---|---|---|---|---|
| **Raw JSON** | JSON | Manual | High (verbose) | N/A (official) |
| **karabiner.ts** | TypeScript | `hyperLayer()` built-in | Medium | Active |
| **GokuRakuJoudo** | EDN | Layer support | Medium-High | Active |
| **Karabiner-Human-Config** | JSON shorthand | `hyper` alias built-in | Low | Active |
| **Karabinerge** | JavaScript | Programmatic | Medium | Moderate |
| **mxstbr (fork)** | TypeScript DSL | Sublayers built-in | Low (just edit) | Community |

---

## 12. UI Tools and Visual Editors

### The Gap

**No polished, dedicated GUI application exists** specifically for visually editing Karabiner complex modifications with form-based rule building. This is the primary pain point for users who want to manage hyper key + sublayer configurations without editing JSON.

### What Exists

#### Karabiner Elements Built-in UI

- **Simple Modifications tab:** Point-and-click for basic one-to-one key remaps. Works well.
- **Complex Modifications tab:**
  - "Add predefined rule" button: Opens the community rules library at [ke-complex-modifications.pqrs.org](https://ke-complex-modifications.pqrs.org/) for one-click import
  - "Add your own rule" button: Opens a **bare-bones text editor** with sample JSON. No form fields, no dropdowns, no autocomplete -- just raw JSON editing.
  - "Edit" button: Same raw text editor for existing rules.
- **EventViewer** (bundled app): Identifies key codes by pressing keys. Essential for building rules.
- **Import/Export:** Manual file management only. No dedicated UI.

**Verdict:** The built-in editor for complex modifications is a raw JSON text area. No form-based or visual editing.

#### Karabiner Complex Rules Generator (Web UI)

- **URL:** https://genesy.github.io/karabiner-complex-rules-generator/
- **GitHub:** https://github.com/genesy/karabiner-complex-rules-generator
- **Stars:** ~545 | **Tech:** React + TypeScript + Material UI
- **Features:** Form-based interface with dropdowns for key codes, modifier selection, "from" and "to" field builders. Generates valid JSON. Has an "Install" button that writes directly to `karabiner.json`.
- **Limitations:** Low maintenance (14 open issues, 26 open PRs, only 2 contributors). May not support all advanced features (variables, expressions, simultaneous keys). Not specifically designed for the sublayer pattern.
- **Verdict:** The closest thing to a GUI editor that exists, but basic and undermaintained.

#### karabiner.ts Online Editor

- **URL:** https://karabiner.ts.evanliu.dev/editor/
- **Also on:** StackBlitz
- **Features:** Write TypeScript in a web-based editor, see generated JSON in real-time. No installation needed.
- **Verdict:** Best "no-install" experience for building configs, but requires writing TypeScript (not a visual/form UI).

#### Community Rules Library

- **URL:** https://ke-complex-modifications.pqrs.org/
- **GitHub:** https://github.com/pqrs-org/KE-complex_modifications
- **Features:** Hundreds of community-contributed rules. One-click import from within Karabiner Elements. Searchable. Many hyper key rules available.
- **Verdict:** Great for importing pre-built rules, but no editing capability.

### The Opportunity

There is a clear gap for a **purpose-built visual editor** that:
- Reads/writes the Karabiner JSON format (or individual rule files)
- Provides a form-based UI specifically for the hyper key + sublayer + app launcher pattern
- Shows a visual map of the keyboard with assigned bindings per layer
- Allows adding/removing/editing bindings via dropdowns and text fields instead of raw JSON
- Generates valid JSON that Karabiner auto-reloads

---

## 13. Comparison with QMK/ZMK Firmware Layers

For users familiar with custom mechanical keyboard firmware, the Karabiner sublayer pattern has clear parallels:

| Aspect | Karabiner Hyper/Sublayers | QMK/ZMK Firmware Layers |
|---|---|---|
| **Runs at** | macOS software (DriverKit) | Keyboard firmware (hardware) |
| **Portability** | macOS only, any keyboard | Any OS, specific keyboard only |
| **Layer activation** | Variable-based (`set_variable` + `variable_if`) | `MO(layer)` momentary, `LT(layer, kc)` layer-tap, `TG(layer)` toggle |
| **Hold-tap** | `to_if_alone` / `to_if_held_down` | `TAPPING_TERM` (default 200ms), `PERMISSIVE_HOLD`, `FLOW_TAP` |
| **Layer stacking** | Sublayers are mutually exclusive (via variable guards) | Layers stack numerically; higher overrides lower; `KC_TRNS` passes through |
| **Max layers** | Effectively unlimited (limited by variable namespace) | QMK: 16 (16-bit keycode); ZMK: also limited but flexible |
| **Config format** | JSON, TypeScript, EDN, YAML | C code (QMK), Devicetree (ZMK), or GUI tools |
| **Latency** | Small software overhead (imperceptible) | Zero overhead (runs at scan rate ~1ms) |
| **Advanced features** | Sublayers, leader mode, duo layers | Combos, tap dance, one-shot mods, auto-shift, caps word |

**Conceptual parallels:**
- Karabiner **sublayer** = QMK `MO(layer)` (momentary layer activation)
- Karabiner **leader mode** = QMK `TG(layer)` or QMK leader key
- Karabiner **dual-role Caps Lock** (Escape/Hyper) = QMK `LT(layer, KC_ESC)`
- karabiner.ts **`duoLayer('f', 'd')`** = QMK **combos**
- QMK `FLOW_TAP` = Karabiner's `simultaneous_threshold_milliseconds`

**Key philosophical difference:** QMK/ZMK layers are true keyboard layers where **every key** has a different meaning per layer (like Shift changes every letter). Karabiner sublayers are more like **namespaced shortcut prefixes** -- you activate a category and press a key within it. QMK is more powerful but requires custom hardware; Karabiner works with any keyboard on macOS.

---

## 14. Resources and Links

### Official

- [Karabiner Elements Documentation](https://karabiner-elements.pqrs.org/docs/)
- [Complex Modifications Reference](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/)
- [Community Rules Library](https://ke-complex-modifications.pqrs.org/)
- [External JSON Generators (Official List)](https://karabiner-elements.pqrs.org/docs/json/external-json-generators/)
- [Karabiner EventViewer](https://karabiner-elements.pqrs.org/docs/manual/operation/eventviewer/) -- identify key codes
- [Configuration File Location](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/)

### Generator Tools

- [karabiner.ts](https://github.com/evan-liu/karabiner.ts) -- TypeScript DSL with `hyperLayer()` ([Online Editor](https://karabiner.ts.evanliu.dev/editor/))
- [GokuRakuJoudo](https://github.com/yqrashawn/GokuRakuJoudo) -- EDN-based config (~6x compression)
- [Karabiner-Human-Config](https://github.com/nrjdalal/karabiner-human-config) -- Simplified JSON syntax
- [Karabinerge](https://github.com/amekusa/karabinerge) -- JavaScript API
- [Karabiner Complex Rules Generator](https://genesy.github.io/karabiner-complex-rules-generator/) -- Web GUI
- [karaml](https://github.com/al-ce/karaml) -- YAML-based

### Notable Configs

- [mxstbr/karabiner](https://github.com/mxstbr/karabiner) -- TypeScript sublayer reference (644 stars, 281 forks)
- [Vonng/Capslock](https://github.com/Vonng/Capslock) -- Comprehensive Caps Lock layer (1,500 stars)
- [Nikita Voloboev config](https://github.com/nikitavoloboev/config) -- "God Mode" via Goku
- [Erlendms/karabiner-actions](https://github.com/Erlendms/karabiner-actions) -- karabiner.ts with Meh+Hyper
- [evan-liu/karabiner-config](https://github.com/evan-liu/karabiner-config) -- karabiner.ts author's own config

### Guides and Tutorials

- [Brett Terpstra: A Hyper Key with Karabiner Elements](https://brettterpstra.com/2017/06/15/a-hyper-key-with-karabiner-elements-full-instructions/) -- Original comprehensive guide (2017)
- [Ben Holmen: Hyper Key with Raycast](https://benholmen.com/blog/hyper-key-with-karabiner-elements-raycast/) -- Simplified modern guide
- [Johannes Holmberg: Setting up a Hyper Key](https://holmberg.io/hyper-key/) -- Clean explanation
- [linkarzu: Karabiner Elements Workflow](https://linkarzu.com/posts/2024-macos-workflow/karabiner-elements/) -- 2024 workflow with space-based sublayers
- [Nikita Voloboev: Karabiner God Mode](https://medium.com/@nikitavoloboev/karabiner-god-mode-7407a5ddc8f6) -- Extreme multi-layer approach

### Standalone Alternatives

- [Hyperkey.app](https://hyperkey.app/) -- Simple Caps Lock to Hyper mapping without Karabiner (no sublayer support)

### GitHub Topics

- [github.com/topics/karabiner](https://github.com/topics/karabiner) -- Browse all Karabiner-tagged repositories
- [github.com/topics/karabiner-elements](https://github.com/topics/karabiner-elements) -- More specific topic
