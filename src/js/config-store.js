export class ConfigStore extends EventTarget {
  constructor() {
    super();
    this.config = null;
  }

  load(config) {
    this.config = config;
    this._emit();
  }

  get triggers() { return this.config?.triggers || {}; }
  get passThroughRules() { return this.config?.passThroughRules || []; }

  getTrigger(triggerKey) {
    return this.triggers[triggerKey] || { tapAction: '', sublayers: [], directBindings: [], ruleSlots: [] };
  }

  sublayers(triggerKey) { return this.getTrigger(triggerKey).sublayers; }
  directBindings(triggerKey) { return this.getTrigger(triggerKey).directBindings; }

  addSublayer(triggerKey, key, label) {
    key = key.toLowerCase();
    const t = this.triggers[triggerKey];
    if (!t) return false;
    if (t.sublayers.some(s => s.key === key)) return false;
    t.sublayers.push({ key, label, bindings: [] });
    const ptIdx = t.ruleSlots.findIndex(s => s.type === 'passthrough');
    const slot = { type: 'sublayer', key };
    if (ptIdx >= 0) t.ruleSlots.splice(ptIdx, 0, slot);
    else t.ruleSlots.push(slot);
    this._emit();
    return true;
  }

  deleteSublayer(triggerKey, key) {
    const t = this.triggers[triggerKey];
    if (!t) return;
    t.sublayers = t.sublayers.filter(s => s.key !== key);
    t.ruleSlots = t.ruleSlots.filter(s => !(s.type === 'sublayer' && s.key === key));
    this._emit();
  }

  renameSublayer(triggerKey, key, label) {
    const sl = this.sublayers(triggerKey).find(s => s.key === key);
    if (sl) { sl.label = label; this._emit(); }
  }

  _getBindings(triggerKey, sublayerKey) {
    if (sublayerKey === null) return this.directBindings(triggerKey);
    const sl = this.sublayers(triggerKey).find(s => s.key === sublayerKey);
    return sl ? sl.bindings : [];
  }

  addBinding(triggerKey, sublayerKey, binding) {
    const bindings = this._getBindings(triggerKey, sublayerKey);
    if (bindings.some(b => b.key === binding.key)) return false;
    bindings.push(binding);
    this._emit();
    return true;
  }

  updateBinding(triggerKey, sublayerKey, oldKey, binding) {
    const bindings = this._getBindings(triggerKey, sublayerKey);
    const idx = bindings.findIndex(b => b.key === oldKey);
    if (idx >= 0) {
      if (binding.key !== oldKey && bindings.some(b => b.key === binding.key)) return false;
      bindings[idx] = binding;
      this._emit();
      return true;
    }
    return false;
  }

  reorderBinding(triggerKey, sublayerKey, bindingKey, newIndex) {
    const bindings = this._getBindings(triggerKey, sublayerKey);
    const oldIndex = bindings.findIndex(b => b.key === bindingKey);
    if (oldIndex < 0 || oldIndex === newIndex) return;
    const [binding] = bindings.splice(oldIndex, 1);
    bindings.splice(newIndex, 0, binding);
    this._emit();
  }

  moveBinding(fromTrigger, fromSublayer, bindingKey, toTrigger, toSublayer) {
    const srcBindings = this._getBindings(fromTrigger, fromSublayer);
    const idx = srcBindings.findIndex(b => b.key === bindingKey);
    if (idx < 0) return false;
    const destBindings = this._getBindings(toTrigger, toSublayer);
    if (destBindings.some(b => b.key === bindingKey)) return false;
    const [binding] = srcBindings.splice(idx, 1);
    destBindings.push(binding);
    this._emit();
    return true;
  }

  deleteBinding(triggerKey, sublayerKey, bindingKey) {
    if (sublayerKey === null) {
      const t = this.triggers[triggerKey];
      if (t) t.directBindings = t.directBindings.filter(b => b.key !== bindingKey);
    } else {
      const sl = this.sublayers(triggerKey).find(s => s.key === sublayerKey);
      if (sl) sl.bindings = sl.bindings.filter(b => b.key !== bindingKey);
    }
    this._emit();
  }

  _emit() {
    this.dispatchEvent(new Event('change'));
  }
}
