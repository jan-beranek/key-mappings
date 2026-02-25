import { createDefaultConfig, hyperVarName, sublayerVarPrefix } from './default-config.js';

export function normalizeInput(text) {
  const trimmed = text.trim();
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }

  // Full karabiner.json
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    if (parsed.profiles && Array.isArray(parsed.profiles)) {
      const profile = parsed.profiles[0];
      if (profile?.complex_modifications?.rules) {
        return profile.complex_modifications.rules;
      }
    }
    // Single rule object
    if (parsed.manipulators) return [parsed];
    throw new Error('Could not find rules in the JSON. Expected a rules array or a full karabiner.json.');
  }

  if (Array.isArray(parsed)) return parsed;

  throw new Error('Expected a JSON array of rules or a karabiner.json object.');
}

export function parseRules(rules) {
  const config = createDefaultConfig();

  // Flatten single-rule-with-mixed-manipulators into logical rules
  const expanded = rules.flatMap(splitFlatRule);

  // Track which trigger key each hyper variable belongs to
  const hyperVarToTrigger = new Map();

  for (const rule of expanded) {
    if (!rule.manipulators || !Array.isArray(rule.manipulators)) {
      config.passThroughRules.push(rule);
      continue;
    }

    let ruleType = null;
    let detectedTrigger = null;
    let sublayerKey = null;
    let sublayerVarName = null;
    let sublayerLabel = '';
    let hyperVar = null;

    // First pass: identify rule type by scanning manipulators
    for (const m of rule.manipulators) {
      const setVars = getSetVariables(m);
      for (const sv of setVars) {
        // Hyper activator: sets a hyper* variable to 1 and has from.key_code
        if (sv.name.match(/^hyper(_\w+)?$/) && sv.value === 1) {
          const fromKey = m.from?.key_code;
          if (fromKey === 'caps_lock' || fromKey === 'tab') {
            ruleType = 'hyper';
            detectedTrigger = fromKey;
            hyperVar = sv.name;
            break;
          }
        }
        // Sublayer activator
        const slMatch = sv.name.match(/^(hyper(?:_\w+)?)_sublayer_(.+)$/);
        if (slMatch && sv.value === 1) {
          ruleType = 'sublayer';
          hyperVar = slMatch[1];
          sublayerVarName = sv.name;
          sublayerKey = m.from?.key_code || slMatch[2];
          sublayerLabel = extractSublayerLabel(rule.description || m.description || '', sublayerKey);
          break;
        }
      }
      if (ruleType) break;
    }

    // Check for direct hyper bindings
    if (!ruleType) {
      for (const [hVar] of hyperVarToTrigger) {
        const hasCond = rule.manipulators.some(m => hasCondition(m, hVar, 1));
        if (hasCond) {
          ruleType = 'direct';
          hyperVar = hVar;
          break;
        }
      }
      // Fallback: check for generic 'hyper' condition
      if (!ruleType) {
        const hasCond = rule.manipulators.some(m => hasCondition(m, 'hyper', 1));
        if (hasCond) { ruleType = 'direct'; hyperVar = 'hyper'; }
      }
    }

    if (ruleType === 'hyper') {
      const activator = rule.manipulators.find(m =>
        getSetVariables(m).some(sv => sv.name === hyperVar && sv.value === 1)
      );
      if (activator) {
        let tapAction = detectedTrigger === 'tab' ? 'tab' : 'escape';
        if (activator.to_if_alone?.length) {
          tapAction = activator.to_if_alone[0].key_code || tapAction;
        }
        config.triggers[detectedTrigger].tapAction = tapAction;
        hyperVarToTrigger.set(hyperVar, detectedTrigger);
        const t = config.triggers[detectedTrigger];
        if (!t.ruleSlots.some(s => s.type === 'hyper')) {
          t.ruleSlots.unshift({ type: 'hyper' });
        }
      }

    } else if (ruleType === 'sublayer') {
      const triggerKey = hyperVarToTrigger.get(hyperVar) || (hyperVar === 'hyper' ? 'caps_lock' : 'tab');
      const t = config.triggers[triggerKey];

      const bindings = [];
      for (const m of rule.manipulators) {
        if (getSetVariables(m).some(sv => sv.name === sublayerVarName && sv.value === 1)) continue;
        if (hasCondition(m, sublayerVarName, 1)) {
          const binding = parseBinding(m);
          if (binding) bindings.push(binding);
        }
      }
      const sublayer = { key: sublayerKey, label: sublayerLabel, bindings };
      t.sublayers.push(sublayer);
      t.ruleSlots.push({ type: 'sublayer', key: sublayerKey });

    } else if (ruleType === 'direct') {
      const triggerKey = hyperVarToTrigger.get(hyperVar) || (hyperVar === 'hyper' ? 'caps_lock' : 'tab');
      const t = config.triggers[triggerKey];

      for (const m of rule.manipulators) {
        if (hasCondition(m, hyperVar, 1)) {
          const binding = parseBinding(m);
          if (binding) t.directBindings.push(binding);
        }
      }
      if (!t.ruleSlots.some(s => s.type === 'direct')) {
        t.ruleSlots.push({ type: 'direct' });
      }

    } else {
      config.passThroughRules.push(rule);
    }
  }

  // Ensure each trigger has hyper and direct slots
  for (const tk of ['caps_lock', 'tab']) {
    const t = config.triggers[tk];
    if (!t.ruleSlots.some(s => s.type === 'hyper')) t.ruleSlots.unshift({ type: 'hyper' });
    if (!t.ruleSlots.some(s => s.type === 'direct')) t.ruleSlots.push({ type: 'direct' });
  }

  return config;
}

function splitFlatRule(rule) {
  const manips = rule.manipulators;
  if (!manips || manips.length <= 1) return [rule];

  // Check if this rule mixes different types (hyper activator + bindings)
  const hyperManips = [];
  const sublayerGroups = new Map(); // sublayerVar -> { activator, bindings }
  const directManips = [];

  for (const m of manips) {
    const setVars = getSetVariables(m);
    let classified = false;

    for (const sv of setVars) {
      if (/^hyper(_\w+)?$/.test(sv.name) && sv.value === 1) {
        const fromKey = m.from?.key_code;
        if (fromKey === 'caps_lock' || fromKey === 'tab') {
          hyperManips.push(m);
          classified = true;
          break;
        }
      }
      const slMatch = sv.name.match(/^(hyper(?:_\w+)?)_sublayer_(.+)$/);
      if (slMatch && sv.value === 1) {
        if (!sublayerGroups.has(sv.name)) sublayerGroups.set(sv.name, { activator: null, bindings: [] });
        sublayerGroups.get(sv.name).activator = m;
        classified = true;
        break;
      }
    }
    if (classified) continue;

    // Check if it's a sublayer binding (has sublayer condition)
    let isSublayerBinding = false;
    for (const c of (m.conditions || [])) {
      if (c.type === 'variable_if') {
        const slMatch = c.name.match(/^(hyper(?:_\w+)?)_sublayer_(.+)$/);
        if (slMatch && c.value === 1) {
          if (!sublayerGroups.has(c.name)) sublayerGroups.set(c.name, { activator: null, bindings: [] });
          sublayerGroups.get(c.name).bindings.push(m);
          isSublayerBinding = true;
          break;
        }
      }
    }
    if (!isSublayerBinding) directManips.push(m);
  }

  // If nothing was split, return the original rule as-is
  if (hyperManips.length === 0 && sublayerGroups.size === 0) return [rule];

  const result = [];
  for (const m of hyperManips) {
    result.push({ description: m.description || rule.description || 'Hyper Key', manipulators: [m] });
  }
  for (const [, group] of sublayerGroups) {
    const grouped = [];
    if (group.activator) grouped.push(group.activator);
    grouped.push(...group.bindings);
    if (grouped.length > 0) {
      const desc = group.activator?.description || rule.description || 'Sublayer';
      result.push({ description: desc, manipulators: grouped });
    }
  }
  if (directManips.length > 0) {
    result.push({ description: 'Direct bindings', manipulators: directManips });
  }
  return result.length > 0 ? result : [rule];
}

function getSetVariables(manipulator) {
  const results = [];
  for (const target of ['to', 'to_if_alone', 'to_if_held_down']) {
    const arr = manipulator[target];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (item.set_variable) results.push(item.set_variable);
    }
  }
  return results;
}

function hasCondition(manipulator, varName, value) {
  if (!Array.isArray(manipulator.conditions)) return false;
  return manipulator.conditions.some(
    c => c.type === 'variable_if' && c.name === varName && c.value === value
  );
}

function extractSublayerLabel(description, key) {
  const arrowMatch = description.match(/->\s*(.+)$/i);
  if (arrowMatch) return arrowMatch[1].trim();
  const colonMatch = description.match(/:\s*(.+)$/i);
  if (colonMatch) return colonMatch[1].trim();
  if (description && !description.toLowerCase().includes('sublayer') && !description.toLowerCase().includes('hyper')) {
    return description.trim();
  }
  return key.toUpperCase();
}

function parseBinding(manipulator) {
  const key = manipulator.from?.key_code;
  if (!key) return null;

  const toArr = manipulator.to;
  if (!Array.isArray(toArr) || toArr.length === 0) return null;

  const to = toArr[0];

  if (to.shell_command) {
    const appMatch = to.shell_command.match(/^open\s+-a\s+'?(.+?)(?:\.app)?'?\s*$/);
    if (appMatch) {
      return { key, actionType: 'app', value: appMatch[1], modifiers: [] };
    }
    return { key, actionType: 'shell', value: to.shell_command, modifiers: [] };
  }

  if (to.key_code) {
    return { key, actionType: 'key', value: to.key_code, modifiers: to.modifiers || [] };
  }

  if (to.consumer_key_code) {
    return { key, actionType: 'key', value: to.consumer_key_code, modifiers: [] };
  }

  // Fallback: store raw
  return { key, actionType: 'shell', value: JSON.stringify(to), modifiers: [] };
}
