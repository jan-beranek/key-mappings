import { store, state, expandedNodes } from './state.js';
import { createDefaultConfig } from './default-config.js';
import { normalizeInput, parseRules } from './parser.js';
import { serializeConfig } from './serializer.js';
import { render } from './renderer.js';
import { closeBindingForm, saveBinding, updateValuePlaceholder, clearModifierCheckboxes } from './binding-form.js';
import { showToast } from './dialogs.js';

function showPasteView() {
  document.getElementById('paste-view').hidden = false;
  document.getElementById('editor-view').hidden = true;
}

function showEditorView() {
  document.getElementById('paste-view').hidden = true;
  document.getElementById('editor-view').hidden = false;
  state.selectedTrigger = 'caps_lock';
  state.selectedSublayer = null;
  state.selectedBinding = null;
  closeBindingForm();
  expandedNodes.clear();
  expandedNodes.add('trigger:caps_lock');
  expandedNodes.add('trigger:tab');
  render();
}

function closeAddSublayerForm() {
  document.getElementById('btn-show-add-sl').hidden = false;
  document.getElementById('add-sublayer-form').hidden = true;
}

function init() {
  // Store change listener
  store.addEventListener('change', render);

  // Load button
  document.getElementById('btn-load').addEventListener('click', () => {
    const text = document.getElementById('json-input').value;
    const errorEl = document.getElementById('paste-error');
    try {
      const rules = normalizeInput(text);
      const config = parseRules(rules);
      store.load(config);
      errorEl.textContent = '';
      showEditorView();
    } catch (e) {
      errorEl.textContent = e.message;
    }
  });

  // New config button
  document.getElementById('btn-new').addEventListener('click', () => {
    store.load(createDefaultConfig());
    showEditorView();
  });

  // Copy JSON button
  document.getElementById('btn-copy').addEventListener('click', () => {
    const rules = serializeConfig(store.config);
    const json = JSON.stringify(rules, null, 4);
    navigator.clipboard.writeText(json).then(() => {
      showToast('JSON copied to clipboard!');
    }).catch(() => {
      // Fallback for file:// protocol where clipboard API may not work
      const ta = document.createElement('textarea');
      ta.value = json;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('JSON copied to clipboard!');
    });
  });

  // Start over button
  document.getElementById('btn-start-over').addEventListener('click', () => {
    showPasteView();
  });

  // Add sublayer UI
  document.getElementById('btn-show-add-sl').addEventListener('click', () => {
    document.getElementById('btn-show-add-sl').hidden = true;
    document.getElementById('add-sublayer-form').hidden = false;
    document.getElementById('sl-key-input').value = '';
    document.getElementById('sl-label-input').value = '';
    document.getElementById('add-sl-error').textContent = '';
    document.getElementById('sl-key-input').focus();
  });

  document.getElementById('btn-cancel-sl').addEventListener('click', closeAddSublayerForm);

  document.getElementById('btn-create-sl').addEventListener('click', () => {
    const key = document.getElementById('sl-key-input').value.toLowerCase().trim();
    const label = document.getElementById('sl-label-input').value.trim();
    const errorEl = document.getElementById('add-sl-error');

    if (!key || key.length !== 1) {
      errorEl.textContent = 'Key must be a single character.';
      return;
    }
    if (!label) {
      errorEl.textContent = 'Label is required.';
      return;
    }

    const ok = store.addSublayer(state.selectedTrigger, key, label);
    if (!ok) {
      errorEl.textContent = 'Key "' + key.toUpperCase() + '" is already used.';
      return;
    }

    state.selectedSublayer = key;
    closeAddSublayerForm();
  });

  // Binding form events
  document.getElementById('btn-save-binding').addEventListener('click', saveBinding);
  document.getElementById('btn-cancel-binding').addEventListener('click', closeBindingForm);
  document.getElementById('btn-delete-binding').addEventListener('click', () => {
    if (state.editingBinding && !state.editingBinding.isNew) {
      store.deleteBinding(state.selectedTrigger, state.selectedSublayer, state.editingBinding.key);
      closeBindingForm();
    }
  });
  document.getElementById('bf-type').addEventListener('change', (e) => {
    updateValuePlaceholder(e.target.value);
    clearModifierCheckboxes();
  });

  // Enter key in binding form
  document.getElementById('bf-value').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBinding();
  });
  document.getElementById('bf-key').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('bf-value').focus();
  });

  // Enter key in add sublayer form
  document.getElementById('sl-label-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-create-sl').click();
  });
  document.getElementById('sl-key-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('sl-label-input').focus();
  });
}

// Start
init();
