// Simple example: Caps Lock hyper key with flat direct bindings.
// App launchers + Vim-style arrow keys. No sublayers.
export const SIMPLE_EXAMPLE = [
  {
    description: "Hyper Key (Caps Lock)",
    manipulators: [{
      type: "basic",
      from: { key_code: "caps_lock", modifiers: { optional: ["any"] } },
      to: [{ set_variable: { name: "hyper", value: 1 } }],
      to_if_alone: [{ key_code: "escape" }],
      to_after_key_up: [{ set_variable: { name: "hyper", value: 0 } }]
    }]
  },
  {
    description: "Hyper direct bindings",
    manipulators: [
      {
        type: "basic",
        description: "Hyper + S -> Safari",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "s", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Safari.app'" }]
      },
      {
        type: "basic",
        description: "Hyper + T -> Terminal",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "t", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Terminal.app'" }]
      },
      {
        type: "basic",
        description: "Hyper + C -> Visual Studio Code",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "c", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Visual Studio Code.app'" }]
      },
      {
        type: "basic",
        description: "Hyper + F -> Finder",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "f", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Finder.app'" }]
      },
      {
        type: "basic",
        description: "Hyper + H -> left_arrow",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "h", modifiers: { optional: ["any"] } },
        to: [{ key_code: "left_arrow" }]
      },
      {
        type: "basic",
        description: "Hyper + J -> down_arrow",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "j", modifiers: { optional: ["any"] } },
        to: [{ key_code: "down_arrow" }]
      },
      {
        type: "basic",
        description: "Hyper + K -> up_arrow",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "k", modifiers: { optional: ["any"] } },
        to: [{ key_code: "up_arrow" }]
      },
      {
        type: "basic",
        description: "Hyper + L -> right_arrow",
        conditions: [{ type: "variable_if", name: "hyper", value: 1 }],
        from: { key_code: "l", modifiers: { optional: ["any"] } },
        to: [{ key_code: "right_arrow" }]
      }
    ]
  }
];

// Full example: Multi-sublayer hyper key with mnemonic grouping.
// O = Open Apps, W = Window Management, S = System, V = Vim Navigation.
export const FULL_EXAMPLE = [
  {
    description: "Hyper Key (Caps Lock)",
    manipulators: [{
      type: "basic",
      from: { key_code: "caps_lock", modifiers: { optional: ["any"] } },
      to: [{ set_variable: { name: "hyper", value: 1 } }],
      to_if_alone: [{ key_code: "escape" }],
      to_after_key_up: [{ set_variable: { name: "hyper", value: 0 } }]
    }]
  },

  // --- Sublayer O: Open Apps ---
  {
    description: "Hyper + O sublayer -> Open Apps",
    manipulators: [
      {
        type: "basic",
        description: "Activate sublayer O",
        conditions: [
          { type: "variable_if", name: "hyper", value: 1 },
          { type: "variable_if", name: "hyper_sublayer_w", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_s", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_v", value: 0 }
        ],
        from: { key_code: "o", modifiers: { optional: ["any"] } },
        to: [{ set_variable: { name: "hyper_sublayer_o", value: 1 } }],
        to_after_key_up: [{ set_variable: { name: "hyper_sublayer_o", value: 0 } }]
      },
      {
        type: "basic",
        description: "O + S -> Safari",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "s", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Safari.app'" }]
      },
      {
        type: "basic",
        description: "O + T -> Terminal",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "t", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Terminal.app'" }]
      },
      {
        type: "basic",
        description: "O + C -> Visual Studio Code",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "c", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Visual Studio Code.app'" }]
      },
      {
        type: "basic",
        description: "O + F -> Finder",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "f", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Finder.app'" }]
      },
      {
        type: "basic",
        description: "O + L -> Slack",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "l", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Slack.app'" }]
      },
      {
        type: "basic",
        description: "O + H -> Spotify",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "h", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Spotify.app'" }]
      },
      {
        type: "basic",
        description: "O + M -> Microsoft Teams",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "m", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Microsoft Teams.app'" }]
      },
      {
        type: "basic",
        description: "O + E -> Microsoft Outlook",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "e", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Microsoft Outlook.app'" }]
      },
      {
        type: "basic",
        description: "O + Y -> Messages",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "y", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'Messages.app'" }]
      },
      {
        type: "basic",
        description: "O + G -> ChatGPT",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_o", value: 1 }],
        from: { key_code: "g", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "open -a 'ChatGPT.app'" }]
      }
    ]
  },

  // --- Sublayer W: Window Management (Rectangle shortcuts) ---
  {
    description: "Hyper + W sublayer -> Window Management",
    manipulators: [
      {
        type: "basic",
        description: "Activate sublayer W",
        conditions: [
          { type: "variable_if", name: "hyper", value: 1 },
          { type: "variable_if", name: "hyper_sublayer_o", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_s", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_v", value: 0 }
        ],
        from: { key_code: "w", modifiers: { optional: ["any"] } },
        to: [{ set_variable: { name: "hyper_sublayer_w", value: 1 } }],
        to_after_key_up: [{ set_variable: { name: "hyper_sublayer_w", value: 0 } }]
      },
      {
        type: "basic",
        description: "W + H -> Ctrl+Opt+left_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_w", value: 1 }],
        from: { key_code: "h", modifiers: { optional: ["any"] } },
        to: [{ key_code: "left_arrow", modifiers: ["left_control", "left_option"] }]
      },
      {
        type: "basic",
        description: "W + L -> Ctrl+Opt+right_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_w", value: 1 }],
        from: { key_code: "l", modifiers: { optional: ["any"] } },
        to: [{ key_code: "right_arrow", modifiers: ["left_control", "left_option"] }]
      },
      {
        type: "basic",
        description: "W + K -> Ctrl+Opt+up_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_w", value: 1 }],
        from: { key_code: "k", modifiers: { optional: ["any"] } },
        to: [{ key_code: "up_arrow", modifiers: ["left_control", "left_option"] }]
      },
      {
        type: "basic",
        description: "W + J -> Ctrl+Opt+down_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_w", value: 1 }],
        from: { key_code: "j", modifiers: { optional: ["any"] } },
        to: [{ key_code: "down_arrow", modifiers: ["left_control", "left_option"] }]
      },
      {
        type: "basic",
        description: "W + F -> Ctrl+Opt+return_or_enter",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_w", value: 1 }],
        from: { key_code: "f", modifiers: { optional: ["any"] } },
        to: [{ key_code: "return_or_enter", modifiers: ["left_control", "left_option"] }]
      }
    ]
  },

  // --- Sublayer S: System Controls ---
  {
    description: "Hyper + S sublayer -> System Controls",
    manipulators: [
      {
        type: "basic",
        description: "Activate sublayer S",
        conditions: [
          { type: "variable_if", name: "hyper", value: 1 },
          { type: "variable_if", name: "hyper_sublayer_o", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_w", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_v", value: 0 }
        ],
        from: { key_code: "s", modifiers: { optional: ["any"] } },
        to: [{ set_variable: { name: "hyper_sublayer_s", value: 1 } }],
        to_after_key_up: [{ set_variable: { name: "hyper_sublayer_s", value: 0 } }]
      },
      {
        type: "basic",
        description: "S + U -> Volume Up",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "u", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'set volume output volume ((output volume of (get volume settings)) + 6.25)'" }]
      },
      {
        type: "basic",
        description: "S + D -> Volume Down",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "d", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'set volume output volume ((output volume of (get volume settings)) - 6.25)'" }]
      },
      {
        type: "basic",
        description: "S + M -> Mute",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "m", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'set volume with output muted'" }]
      },
      {
        type: "basic",
        description: "S + P -> Play/Pause (Spotify)",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "p", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'tell application \"Spotify\" to playpause'" }]
      },
      {
        type: "basic",
        description: "S + N -> Next Track (Spotify)",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "n", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'tell application \"Spotify\" to next track'" }]
      },
      {
        type: "basic",
        description: "S + B -> Previous Track (Spotify)",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_s", value: 1 }],
        from: { key_code: "b", modifiers: { optional: ["any"] } },
        to: [{ shell_command: "osascript -e 'tell application \"Spotify\" to previous track'" }]
      }
    ]
  },

  // --- Sublayer V: Vim Navigation ---
  {
    description: "Hyper + V sublayer -> Vim Navigation",
    manipulators: [
      {
        type: "basic",
        description: "Activate sublayer V",
        conditions: [
          { type: "variable_if", name: "hyper", value: 1 },
          { type: "variable_if", name: "hyper_sublayer_o", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_w", value: 0 },
          { type: "variable_if", name: "hyper_sublayer_s", value: 0 }
        ],
        from: { key_code: "v", modifiers: { optional: ["any"] } },
        to: [{ set_variable: { name: "hyper_sublayer_v", value: 1 } }],
        to_after_key_up: [{ set_variable: { name: "hyper_sublayer_v", value: 0 } }]
      },
      {
        type: "basic",
        description: "V + H -> left_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_v", value: 1 }],
        from: { key_code: "h", modifiers: { optional: ["any"] } },
        to: [{ key_code: "left_arrow" }]
      },
      {
        type: "basic",
        description: "V + J -> down_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_v", value: 1 }],
        from: { key_code: "j", modifiers: { optional: ["any"] } },
        to: [{ key_code: "down_arrow" }]
      },
      {
        type: "basic",
        description: "V + K -> up_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_v", value: 1 }],
        from: { key_code: "k", modifiers: { optional: ["any"] } },
        to: [{ key_code: "up_arrow" }]
      },
      {
        type: "basic",
        description: "V + L -> right_arrow",
        conditions: [{ type: "variable_if", name: "hyper_sublayer_v", value: 1 }],
        from: { key_code: "l", modifiers: { optional: ["any"] } },
        to: [{ key_code: "right_arrow" }]
      }
    ]
  }
];

export function getPresetJSON(preset) {
  return JSON.stringify(preset, null, 4);
}
