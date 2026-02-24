import { hyperVarName, sublayerVarPrefix } from './default-config.js';

export function serializeConfig(config) {
  const rules = [];

  for (const triggerKey of ['caps_lock', 'tab']) {
    const t = config.triggers[triggerKey];
    if (!t) continue;
    const hVar = hyperVarName(triggerKey);
    const slPrefix = sublayerVarPrefix(triggerKey);
    const hasData = t.sublayers.length > 0 || t.directBindings.length > 0;

    for (const slot of t.ruleSlots) {
      switch (slot.type) {
        case 'hyper':
          if (hasData) rules.push(serializeHyperKey(triggerKey, t.tapAction, hVar));
          break;
        case 'sublayer': {
          const sl = t.sublayers.find(s => s.key === slot.key);
          if (sl) rules.push(serializeSublayer(sl, t.sublayers, hVar, slPrefix));
          break;
        }
        case 'direct':
          if (t.directBindings.length > 0) {
            rules.push(serializeDirectBindings(t.directBindings, hVar));
          }
          break;
      }
    }
  }

  for (const ptr of config.passThroughRules) {
    rules.push(ptr);
  }

  return rules;
}

function serializeHyperKey(triggerKey, tapAction, hVar) {
  const label = triggerKey === 'caps_lock' ? 'Caps Lock' : 'Tab';
  return {
    description: 'Hyper Key (' + label + ')',
    manipulators: [{
      type: 'basic',
      from: {
        key_code: triggerKey,
        modifiers: { optional: ['any'] }
      },
      to: [{ set_variable: { name: hVar, value: 1 } }],
      to_if_alone: [{ key_code: tapAction }],
      to_after_key_up: [{ set_variable: { name: hVar, value: 0 } }]
    }]
  };
}

function serializeSublayer(sublayer, allSublayers, hVar, slPrefix) {
  const varName = slPrefix + sublayer.key;

  const conditions = [{ type: 'variable_if', name: hVar, value: 1 }];
  for (const other of allSublayers) {
    if (other.key !== sublayer.key) {
      conditions.push({ type: 'variable_if', name: slPrefix + other.key, value: 0 });
    }
  }

  const manipulators = [];

  manipulators.push({
    type: 'basic',
    description: 'Activate sublayer ' + sublayer.key.toUpperCase(),
    conditions,
    from: {
      key_code: sublayer.key,
      modifiers: { optional: ['any'] }
    },
    to: [{ set_variable: { name: varName, value: 1 } }],
    to_after_key_up: [{ set_variable: { name: varName, value: 0 } }]
  });

  for (const binding of sublayer.bindings) {
    manipulators.push({
      type: 'basic',
      description: sublayer.key.toUpperCase() + ' + ' + binding.key.toUpperCase() + ' -> ' + describeAction(binding),
      conditions: [{ type: 'variable_if', name: varName, value: 1 }],
      from: {
        key_code: binding.key,
        modifiers: { optional: ['any'] }
      },
      to: [serializeAction(binding)]
    });
  }

  return {
    description: 'Hyper + ' + sublayer.key.toUpperCase() + ' sublayer -> ' + sublayer.label,
    manipulators
  };
}

function serializeDirectBindings(bindings, hVar) {
  const manipulators = bindings.map(binding => ({
    type: 'basic',
    description: 'Hyper + ' + binding.key.toUpperCase() + ' -> ' + describeAction(binding),
    conditions: [{ type: 'variable_if', name: hVar, value: 1 }],
    from: {
      key_code: binding.key,
      modifiers: { optional: ['any'] }
    },
    to: [serializeAction(binding)]
  }));

  return {
    description: 'Hyper direct bindings',
    manipulators
  };
}

function serializeAction(binding) {
  switch (binding.actionType) {
    case 'app': {
      const name = binding.value.endsWith('.app') ? binding.value : binding.value + '.app';
      return { shell_command: "open -a '" + name + "'" };
    }
    case 'shell':
      return { shell_command: binding.value };
    case 'key': {
      const result = { key_code: binding.value };
      if (binding.modifiers?.length) result.modifiers = [...binding.modifiers];
      return result;
    }
    default:
      return { shell_command: binding.value };
  }
}

export function describeAction(binding) {
  switch (binding.actionType) {
    case 'app': return binding.value;
    case 'shell': return binding.value;
    case 'key': {
      const mods = (binding.modifiers || []).map(formatModifier).filter(Boolean);
      const parts = [...mods, binding.value];
      return parts.join('+');
    }
    default: return binding.value;
  }
}

function formatModifier(mod) {
  const map = {
    left_command: 'Cmd', right_command: 'Cmd', command: 'Cmd',
    left_control: 'Ctrl', right_control: 'Ctrl', control: 'Ctrl',
    left_option: 'Opt', right_option: 'Opt', option: 'Opt',
    left_shift: 'Shift', right_shift: 'Shift', shift: 'Shift'
  };
  return map[mod] || mod;
}

export function formatActionType(type) {
  return { app: 'Open App', shell: 'Shell Cmd', key: 'Key Combo' }[type] || type;
}
