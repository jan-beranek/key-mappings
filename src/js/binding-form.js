import { store, state } from './state.js';
import { renderTree } from './renderer.js';

export function openAddBinding(prefilledKey) {
  state.editingBinding = { key: null, isNew: true };
  state.selectedBinding = null;
  showBindingForm();
  document.getElementById('bf-key').value = prefilledKey || '';
  document.getElementById('bf-key').disabled = false;
  document.getElementById('bf-type').value = 'app';
  document.getElementById('bf-value').value = '';
  document.getElementById('bf-value').placeholder = 'App name (e.g. Safari)';
  document.getElementById('bf-error').textContent = '';
  document.getElementById('modifier-row').hidden = true;
  document.getElementById('btn-delete-binding').hidden = true;
  document.getElementById('binding-panel-title').textContent = 'New Binding';
  clearModifierCheckboxes();
  requestAnimationFrame(() => {
    if (!prefilledKey) document.getElementById('bf-key').focus();
    else document.getElementById('bf-value').focus();
  });
}

export function openEditBinding(binding) {
  state.editingBinding = { key: binding.key, isNew: false };
  state.selectedBinding = binding.key;
  showBindingForm();
  document.getElementById('bf-key').value = binding.key;
  document.getElementById('bf-key').disabled = true;
  document.getElementById('bf-type').value = binding.actionType;
  document.getElementById('bf-error').textContent = '';
  document.getElementById('btn-delete-binding').hidden = false;
  document.getElementById('binding-panel-title').textContent = 'Edit Binding — ' + binding.key.toUpperCase();
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
  document.getElementById('binding-panel-title').textContent = 'Binding Editor';
  renderTree();
}

export function saveBinding() {
  const key = document.getElementById('bf-key').value.toLowerCase().trim();
  const actionType = document.getElementById('bf-type').value;
  const value = document.getElementById('bf-value').value.trim();
  const errorEl = document.getElementById('bf-error');

  if (!key || key.length !== 1) {
    errorEl.textContent = 'Key must be a single character.';
    return;
  }
  if (!value) {
    errorEl.textContent = 'Value is required.';
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
  document.getElementById('binding-panel-title').textContent = 'Binding Editor';
}

export function updateValuePlaceholder(actionType) {
  const input = document.getElementById('bf-value');
  const modRow = document.getElementById('modifier-row');
  switch (actionType) {
    case 'app':
      input.placeholder = 'App name (e.g. Safari)';
      modRow.hidden = true;
      break;
    case 'shell':
      input.placeholder = 'Shell command (e.g. bash ~/script.sh)';
      modRow.hidden = true;
      break;
    case 'key':
      input.placeholder = 'Key code (e.g. left_arrow, return_or_enter)';
      modRow.hidden = false;
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
