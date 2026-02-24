import { store, state, expandedNodes, KEY_ROWS } from './state.js';
import { describeAction } from './serializer.js';
import { openAddBinding, openEditBinding, closeBindingForm } from './binding-form.js';
import { showConfirm } from './dialogs.js';

export function render() {
  renderTree();
  renderKeyGrid();
  renderBindingEditor();
}

export function renderTree() {
  const container = document.getElementById('sublayer-list');
  container.innerHTML = '';

  const triggers = [
    { key: 'caps_lock', label: 'Caps Lock' },
    { key: 'tab', label: 'Tab' }
  ];

  for (const trigger of triggers) {
    const triggerId = 'trigger:' + trigger.key;
    const isExpanded = expandedNodes.has(triggerId);
    const triggerData = store.getTrigger(trigger.key);

    const isTriggerSelected = state.selectedTrigger === trigger.key && state.selectedSublayer === null && state.selectedBinding === null;
    const triggerNode = document.createElement('div');
    triggerNode.className = 'tree-node tree-node--level-0' + (isTriggerSelected ? ' tree-node--selected' : '');

    const chevron = document.createElement('span');
    chevron.className = 'tree-chevron' + (isExpanded ? ' tree-chevron--expanded' : '');
    chevron.textContent = '\u25B6';
    chevron.onclick = e => {
      e.stopPropagation();
      if (isExpanded) expandedNodes.delete(triggerId);
      else expandedNodes.add(triggerId);
      renderTree();
    };
    triggerNode.appendChild(chevron);

    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'tree-label';
    triggerLabel.textContent = trigger.label;
    triggerNode.appendChild(triggerLabel);

    triggerNode.onclick = () => {
      state.selectedTrigger = trigger.key;
      state.selectedSublayer = null;
      state.selectedBinding = null;
      closeBindingForm();
      if (!isExpanded) expandedNodes.add(triggerId);
      render();
    };

    container.appendChild(triggerNode);

    if (!isExpanded) continue;

    // Level 1: Direct pseudo-sublayer
    renderSublayerNode(container, trigger.key, null, 'Direct', triggerData.directBindings);

    // Level 1: Sublayers
    for (const sl of triggerData.sublayers) {
      renderSublayerNode(container, trigger.key, sl.key, sl.label, sl.bindings);
    }
  }
}

function renderSublayerNode(container, triggerKey, sublayerKey, label, bindings) {
  const nodeId = 'sublayer:' + triggerKey + ':' + (sublayerKey || '_direct');
  const isExpanded = expandedNodes.has(nodeId);
  const isSelected = state.selectedTrigger === triggerKey && state.selectedSublayer === sublayerKey && state.selectedBinding === null;

  const node = document.createElement('div');
  node.className = 'tree-node tree-node--level-1' + (isSelected ? ' tree-node--selected' : '');

  // Chevron
  const chevron = document.createElement('span');
  chevron.className = 'tree-chevron' + (isExpanded ? ' tree-chevron--expanded' : '');
  chevron.textContent = '\u25B6';
  chevron.onclick = e => {
    e.stopPropagation();
    if (isExpanded) expandedNodes.delete(nodeId);
    else expandedNodes.add(nodeId);
    renderTree();
  };
  node.appendChild(chevron);

  // Key badge (for real sublayers)
  if (sublayerKey !== null) {
    const keyEl = document.createElement('span');
    keyEl.className = 'tree-key';
    keyEl.textContent = sublayerKey;
    node.appendChild(keyEl);
  }

  // Label (or rename input)
  if (state.renamingSublayer === sublayerKey && sublayerKey !== null) {
    const input = document.createElement('input');
    input.className = 'rename-input';
    input.value = label;
    input.style.flex = '1';
    input.style.minWidth = '0';
    input.onclick = e => e.stopPropagation();
    input.onkeydown = e => {
      if (e.key === 'Enter') {
        store.renameSublayer(triggerKey, sublayerKey, input.value);
        state.renamingSublayer = null;
      } else if (e.key === 'Escape') {
        state.renamingSublayer = null;
        render();
      }
    };
    input.onblur = () => {
      store.renameSublayer(triggerKey, sublayerKey, input.value);
      state.renamingSublayer = null;
    };
    node.appendChild(input);
    requestAnimationFrame(() => { input.focus(); input.select(); });
  } else {
    const labelEl = document.createElement('span');
    labelEl.className = 'tree-label';
    labelEl.textContent = label;
    node.appendChild(labelEl);
  }

  // Count
  const countEl = document.createElement('span');
  countEl.className = 'tree-count';
  countEl.textContent = bindings.length;
  node.appendChild(countEl);

  // Actions (rename, delete) for real sublayers
  if (sublayerKey !== null) {
    const actions = document.createElement('span');
    actions.className = 'tree-actions';

    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.onclick = e => { e.stopPropagation(); state.renamingSublayer = sublayerKey; render(); };
    actions.appendChild(renameBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = 'Del';
    delBtn.onclick = e => {
      e.stopPropagation();
      showConfirm('Delete sublayer "' + label + '" and all its bindings?', () => {
        if (state.selectedTrigger === triggerKey && state.selectedSublayer === sublayerKey) { state.selectedSublayer = null; state.selectedBinding = null; }
        expandedNodes.delete(nodeId);
        store.deleteSublayer(triggerKey, sublayerKey);
      });
    };
    actions.appendChild(delBtn);

    node.appendChild(actions);
  }

  // "+" add binding button
  const addBtn = document.createElement('button');
  addBtn.className = 'tree-add-btn';
  addBtn.textContent = '+';
  addBtn.title = 'Add binding';
  addBtn.onclick = e => {
    e.stopPropagation();
    state.selectedTrigger = triggerKey;
    state.selectedSublayer = sublayerKey;
    if (!expandedNodes.has(nodeId)) expandedNodes.add(nodeId);
    openAddBinding('');
    render();
  };
  node.appendChild(addBtn);

  // Click handler: select sublayer
  node.onclick = () => {
    state.selectedTrigger = triggerKey;
    state.selectedSublayer = sublayerKey;
    state.selectedBinding = null;
    closeBindingForm();
    if (!expandedNodes.has(nodeId)) expandedNodes.add(nodeId);
    render();
  };

  container.appendChild(node);

  // Level 2: Binding leaves (if expanded)
  if (isExpanded) {
    if (bindings.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'tree-empty';
      empty.textContent = 'No bindings';
      container.appendChild(empty);
    } else {
      for (const b of bindings) {
        const leaf = document.createElement('div');
        const isLeafSelected = state.selectedTrigger === triggerKey && state.selectedSublayer === sublayerKey && state.selectedBinding === b.key;
        leaf.className = 'tree-node tree-node--level-2' + (isLeafSelected ? ' tree-node--selected' : '');

        const bKey = document.createElement('span');
        bKey.className = 'tree-binding-key';
        bKey.textContent = b.key.toUpperCase();
        leaf.appendChild(bKey);

        const bDesc = document.createElement('span');
        bDesc.className = 'tree-binding-desc';
        bDesc.textContent = describeAction(b);
        leaf.appendChild(bDesc);

        leaf.onclick = () => {
          state.selectedTrigger = triggerKey;
          state.selectedSublayer = sublayerKey;
          state.selectedBinding = b.key;
          openEditBinding(b);
          render();
        };

        container.appendChild(leaf);
      }
    }
  }
}

export function renderKeyGrid() {
  const container = document.getElementById('key-grid-rows');
  container.innerHTML = '';

  const bindings = getCurrentBindings();
  const bindingMap = new Map(bindings.map(b => [b.key, b]));
  const sublayerKeys = new Set(store.sublayers(state.selectedTrigger).map(s => s.key));
  const isDirect = state.selectedSublayer === null;

  for (const row of KEY_ROWS) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'key-row';
    for (const k of row) {
      const cell = document.createElement('button');
      cell.className = 'key-cell';
      cell.dataset.key = k;

      const letterSpan = document.createElement('span');
      letterSpan.className = 'key-letter';
      letterSpan.textContent = k.toUpperCase();
      cell.appendChild(letterSpan);

      const binding = bindingMap.get(k);
      const isSublayerActivator = isDirect && sublayerKeys.has(k);

      if (binding) {
        cell.classList.add('bound');
        const actionSpan = document.createElement('span');
        actionSpan.className = 'key-action';
        actionSpan.textContent = describeAction(binding);
        cell.appendChild(actionSpan);
        cell.onclick = () => {
          state.selectedBinding = binding.key;
          openEditBinding(binding);
        };
      } else if (isSublayerActivator) {
        cell.classList.add('sublayer-activator');
        const sl = store.sublayers(state.selectedTrigger).find(s => s.key === k);
        const actionSpan = document.createElement('span');
        actionSpan.className = 'key-action';
        actionSpan.textContent = sl?.label || '';
        cell.appendChild(actionSpan);
        cell.onclick = () => { state.selectedSublayer = k; state.selectedBinding = null; closeBindingForm(); render(); };
      } else {
        cell.onclick = () => openAddBinding(k);
      }

      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }

  // Update grid title
  const title = document.getElementById('key-grid-title');
  const triggerLabel = state.selectedTrigger === 'caps_lock' ? 'Caps Lock' : 'Tab';
  if (isDirect) {
    title.textContent = triggerLabel + ' + Key (Direct Bindings)';
  } else {
    const sl = store.sublayers(state.selectedTrigger).find(s => s.key === state.selectedSublayer);
    title.textContent = sl ? triggerLabel + ' + ' + sl.key.toUpperCase() + ' + Key (' + sl.label + ')' : 'Key Bindings';
  }
}

function renderBindingEditor() {
  if (state.selectedBinding !== null && state.editingBinding === null) {
    const bindings = getCurrentBindings();
    const binding = bindings.find(b => b.key === state.selectedBinding);
    if (binding) {
      openEditBinding(binding);
    } else {
      state.selectedBinding = null;
      closeBindingForm();
    }
  }
}

export function getCurrentBindings() {
  if (state.selectedSublayer === null) return store.directBindings(state.selectedTrigger);
  const sl = store.sublayers(state.selectedTrigger).find(s => s.key === state.selectedSublayer);
  return sl ? sl.bindings : [];
}
