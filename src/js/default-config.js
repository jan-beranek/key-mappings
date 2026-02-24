export function createDefaultConfig() {
  return {
    triggers: {
      caps_lock: { tapAction: 'escape', sublayers: [], directBindings: [], ruleSlots: [{ type: 'hyper' }, { type: 'direct' }] },
      tab: { tapAction: 'tab', sublayers: [], directBindings: [], ruleSlots: [{ type: 'hyper' }, { type: 'direct' }] }
    },
    passThroughRules: []
  };
}

export function hyperVarName(triggerKey) {
  return triggerKey === 'caps_lock' ? 'hyper' : 'hyper_' + triggerKey;
}

export function sublayerVarPrefix(triggerKey) {
  return hyperVarName(triggerKey) + '_sublayer_';
}
