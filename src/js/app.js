import { store, state, expandedNodes } from './state.js';
import { createDefaultConfig } from './default-config.js';
import { normalizeInput, parseRules } from './parser.js';
import { serializeConfig } from './serializer.js';
import { render } from './renderer.js';
import { closeBindingForm, saveBinding, updateValuePlaceholder, clearModifierCheckboxes, deleteCurrentBinding } from './binding-form.js';
import { showToast } from './dialogs.js';
import { SIMPLE_EXAMPLE, FULL_EXAMPLE, getPresetJSON } from './example-presets.js';

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
    const allManipulators = rules.flatMap(r => r.manipulators);
    const json = JSON.stringify({ description: "Hyper Key Configuration", manipulators: allManipulators }, null, 4);
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

  // Example preset buttons — load directly into editor
  document.getElementById('btn-example-simple').addEventListener('click', () => {
    const config = parseRules(SIMPLE_EXAMPLE);
    store.load(config);
    showEditorView();
  });
  document.getElementById('btn-example-full').addEventListener('click', () => {
    const config = parseRules(FULL_EXAMPLE);
    store.load(config);
    showEditorView();
  });

  // Binding form events
  document.getElementById('btn-save-binding').addEventListener('click', saveBinding);
  document.getElementById('btn-cancel-binding').addEventListener('click', closeBindingForm);
  document.getElementById('btn-delete-binding').addEventListener('click', () => {
    deleteCurrentBinding();
  });
  // Type tab buttons
  for (const tab of document.querySelectorAll('#bf-type-tabs .type-tab')) {
    tab.addEventListener('click', () => {
      for (const t of document.querySelectorAll('#bf-type-tabs .type-tab')) t.classList.remove('active');
      tab.classList.add('active');
      updateValuePlaceholder(tab.dataset.type);
      clearModifierCheckboxes();
    });
  }

  // Enter key in binding form
  document.getElementById('bf-value').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBinding();
  });

}

// Start
init();
