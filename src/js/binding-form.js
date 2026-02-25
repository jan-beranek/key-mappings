import { store, state } from './state.js';
import { renderTree, render } from './renderer.js';
import { showConfirm } from './dialogs.js';

function setBindingTitle(key, isLayer) {
  const container = document.getElementById('binding-panel-title');
  container.innerHTML = '';

  const trigger = state.selectedTrigger === 'caps_lock' ? 'CAPS' : 'TAB';
  const isSublayerContext = state.selectedSublayer !== null || isLayer;

  const triggerBadge = document.createElement('span');
  triggerBadge.className = 'binding-title-key ' + (isSublayerContext ? 'binding-title-key--sublayer' : 'binding-title-key--binding');
  triggerBadge.textContent = trigger;
  container.appendChild(triggerBadge);

  if (state.selectedSublayer !== null) {
    const plus1 = document.createElement('span');
    plus1.className = 'binding-title-plus';
    plus1.textContent = '+';
    container.appendChild(plus1);

    const slBadge = document.createElement('span');
    slBadge.className = 'binding-title-key binding-title-key--sublayer';
    slBadge.textContent = state.selectedSublayer.toUpperCase();
    container.appendChild(slBadge);
  }

  if (key) {
    const plus2 = document.createElement('span');
    plus2.className = 'binding-title-plus';
    plus2.textContent = '+';
    container.appendChild(plus2);

    const keyBadge = document.createElement('span');
    const keyStyle = isLayer ? 'binding-title-key--sublayer' : 'binding-title-key--binding';
    keyBadge.className = 'binding-title-key ' + keyStyle;
    keyBadge.textContent = key.toUpperCase();
    container.appendChild(keyBadge);
  }
}

function resetBindingTitle() {
  const container = document.getElementById('binding-panel-title');
  container.textContent = 'Binding Editor';
}

function getSelectedType() {
  const active = document.querySelector('#bf-type-tabs .type-tab.active');
  return active ? active.dataset.type : 'app';
}

function setSelectedType(type) {
  for (const tab of document.querySelectorAll('#bf-type-tabs .type-tab')) {
    tab.classList.toggle('active', tab.dataset.type === type);
  }
}

function updateLayerOptionVisibility() {
  const layerTab = document.querySelector('#bf-type-tabs .type-tab[data-type="layer"]');
  if (layerTab) layerTab.hidden = state.selectedSublayer !== null;
}

export function openAddBinding(prefilledKey) {
  state.editingBinding = { key: prefilledKey || null, isNew: true };
  state.selectedBinding = null;
  showBindingForm();
  document.getElementById('bf-key').value = prefilledKey || '';
  setSelectedType('app');
  document.getElementById('bf-value').value = '';
  document.getElementById('bf-value').placeholder = 'App name (e.g. Safari)';
  document.getElementById('bf-error').textContent = '';
  document.getElementById('modifier-row').hidden = true;
  document.getElementById('btn-delete-binding').hidden = true;
  setBindingTitle(prefilledKey);
  updateLayerOptionVisibility();
  clearModifierCheckboxes();
  requestAnimationFrame(() => {
    document.getElementById('bf-value').focus();
  });
}

export function openEditSublayer(sublayer) {
  state.editingBinding = { key: sublayer.key, isNew: false, isLayer: true };
  state.selectedBinding = null;
  state.selectedSublayer = null;
  showBindingForm();
  document.getElementById('bf-key').value = sublayer.key;
  setSelectedType('layer');
  document.getElementById('bf-error').textContent = '';
  document.getElementById('btn-delete-binding').hidden = false;
  setBindingTitle(sublayer.key, true);
  updateLayerOptionVisibility();
  updateValuePlaceholder('layer');
  document.getElementById('bf-value').value = sublayer.label;
  document.getElementById('modifier-row').hidden = true;
  clearModifierCheckboxes();

  renderTree();
  requestAnimationFrame(() => {
    document.getElementById('bf-value').focus();
  });
}

export function openEditBinding(binding) {
  state.editingBinding = { key: binding.key, isNew: false };
  state.selectedBinding = binding.key;
  showBindingForm();
  document.getElementById('bf-key').value = binding.key;
  setSelectedType(binding.actionType);
  document.getElementById('bf-error').textContent = '';
  document.getElementById('btn-delete-binding').hidden = false;
  setBindingTitle(binding.key);
  updateLayerOptionVisibility();
  updateValuePlaceholder(binding.actionType);

  if (binding.actionType === 'key') {
    document.getElementById('bf-value').value = binding.value;
    document.getElementById('modifier-row').hidden = false;
    setModifierCheckboxes(binding.modifiers || []);
  } else {
    document.getElementById('bf-value').value = binding.value;
    document.getElementById('modifier-row').hidden = true;
    clearModifierCheckboxes();
  }

  renderTree();
  requestAnimationFrame(() => {
    document.getElementById('bf-value').focus();
  });
}

function showBindingForm() {
  document.getElementById('binding-editor-placeholder').hidden = true;
  document.getElementById('binding-form').hidden = false;
}

export function closeBindingForm() {
  state.editingBinding = null;
  state.selectedBinding = null;
  document.getElementById('binding-form').hidden = true;
  document.getElementById('binding-editor-placeholder').hidden = false;
  document.getElementById('btn-delete-binding').hidden = true;
  resetBindingTitle();
  renderTree();
}

export function saveBinding() {
  const key = document.getElementById('bf-key').value.toLowerCase().trim();
  const actionType = getSelectedType();
  const value = document.getElementById('bf-value').value.trim();
  const errorEl = document.getElementById('bf-error');

  if (!key || key.length !== 1) {
    errorEl.textContent = 'Key must be a single character.';
    return;
  }
  if (!value) {
    errorEl.textContent = (actionType === 'layer' ? 'Label' : 'Value') + ' is required.';
    return;
  }

  // Handle "Activate Layer" type
  if (actionType === 'layer') {
    if (state.editingBinding.isNew) {
      // Check for duplicate sublayer key
      if (store.sublayers(state.selectedTrigger).some(s => s.key === key)) {
        errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already used as a sublayer activator.';
        return;
      }
      // Check for conflicting direct binding
      if (store.directBindings(state.selectedTrigger).some(b => b.key === key)) {
        errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already bound as a direct binding.';
        return;
      }
      const ok = store.addSublayer(state.selectedTrigger, key, value);
      if (!ok) {
        errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already used.';
        return;
      }
    } else {
      // Editing existing sublayer — rename label
      store.renameSublayer(state.selectedTrigger, key, value);
    }

    state.selectedSublayer = null;
    state.selectedBinding = null;
    state.editingBinding = null;
    document.getElementById('binding-form').hidden = true;
    document.getElementById('binding-editor-placeholder').hidden = false;
    document.getElementById('btn-delete-binding').hidden = true;
    resetBindingTitle();
    return;
  }

  // Check if key conflicts with sublayer activator (in direct mode)
  if (state.selectedSublayer === null && store.sublayers(state.selectedTrigger).some(s => s.key === key) && state.editingBinding.isNew) {
    errorEl.textContent = 'Key "' + key + '" is already used as a sublayer activator.';
    return;
  }

  const modifiers = actionType === 'key' ? getModifierCheckboxes() : [];
  const binding = { key, actionType, value, modifiers };

  let ok;
  if (state.editingBinding.isNew) {
    ok = store.addBinding(state.selectedTrigger, state.selectedSublayer, binding);
    if (!ok) {
      errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already bound in this layer.';
      return;
    }
  } else {
    ok = store.updateBinding(state.selectedTrigger, state.selectedSublayer, state.editingBinding.key, binding);
    if (!ok) {
      errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already bound in this layer.';
      return;
    }
  }

  // After save, select the binding and show it in editor
  state.selectedBinding = key;
  state.editingBinding = null;
  document.getElementById('binding-form').hidden = true;
  document.getElementById('binding-editor-placeholder').hidden = false;
  document.getElementById('btn-delete-binding').hidden = true;
  resetBindingTitle();
}

export function deleteCurrentBinding() {
  if (!state.editingBinding || state.editingBinding.isNew) return;

  const actionType = getSelectedType();
  if (actionType === 'layer') {
    const sl = store.sublayers(state.selectedTrigger).find(s => s.key === state.editingBinding.key);
    const label = sl ? sl.label : state.editingBinding.key.toUpperCase();
    showConfirm('Delete sublayer "' + label + '" and all its bindings?', () => {
      store.deleteSublayer(state.selectedTrigger, state.editingBinding.key);
      closeBindingForm();
    });
  } else {
    store.deleteBinding(state.selectedTrigger, state.selectedSublayer, state.editingBinding.key);
    closeBindingForm();
  }
}

export function updateValuePlaceholder(actionType) {
  const input = document.getElementById('bf-value');
  const modRow = document.getElementById('modifier-row');
  const valueLabel = document.getElementById('bf-value-label');
  switch (actionType) {
    case 'app':
      valueLabel.textContent = 'Value';
      input.placeholder = 'App name (e.g. Safari)';
      modRow.hidden = true;
      break;
    case 'shell':
      valueLabel.textContent = 'Value';
      input.placeholder = 'Shell command (e.g. bash ~/script.sh)';
      modRow.hidden = true;
      break;
    case 'key':
      valueLabel.textContent = 'Value';
      input.placeholder = 'Key code (e.g. left_arrow, return_or_enter)';
      modRow.hidden = false;
      break;
    case 'layer':
      valueLabel.textContent = 'Label';
      input.placeholder = 'Layer name (e.g. Open Apps)';
      modRow.hidden = true;
      break;
  }
}

export function clearModifierCheckboxes() {
  for (const id of ['mod-cmd', 'mod-ctrl', 'mod-opt', 'mod-shift']) {
    document.getElementById(id).checked = false;
  }
}

function setModifierCheckboxes(modifiers) {
  const map = {
    'mod-cmd': ['left_command', 'right_command', 'command'],
    'mod-ctrl': ['left_control', 'right_control', 'control'],
    'mod-opt': ['left_option', 'right_option', 'option'],
    'mod-shift': ['left_shift', 'right_shift', 'shift']
  };
  for (const [id, values] of Object.entries(map)) {
    document.getElementById(id).checked = modifiers.some(m => values.includes(m));
  }
}

function getModifierCheckboxes() {
  const mods = [];
  if (document.getElementById('mod-cmd').checked) mods.push('left_command');
  if (document.getElementById('mod-ctrl').checked) mods.push('left_control');
  if (document.getElementById('mod-opt').checked) mods.push('left_option');
  if (document.getElementById('mod-shift').checked) mods.push('left_shift');
  return mods;
}
