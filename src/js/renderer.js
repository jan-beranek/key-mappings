import { store, state, expandedNodes, KEY_ROWS } from './state.js';
import { describeAction } from './serializer.js';
import { openAddBinding, openEditBinding, openEditSublayer, closeBindingForm } from './binding-form.js';

export function render() {
  renderTree();
  renderKeyGrid();
  renderBindingEditor();
}

export function renderTree() {
  const container = document.getElementById('sublayer-list');
  container.innerHTML = '';

  const triggers = [
    { key: 'tab', label: 'Tab', badge: 'TAB' },
    { key: 'caps_lock', label: 'Caps Lock', badge: 'CAPS' }
  ];

  for (const trigger of triggers) {
    const triggerId = 'trigger:' + trigger.key;
    const isExpanded = expandedNodes.has(triggerId);
    const triggerData = store.getTrigger(trigger.key);

    const isTriggerActiveLayout = state.selectedTrigger === trigger.key && state.selectedSublayer === null;
    const triggerNode = document.createElement('div');
    triggerNode.className = 'tree-node tree-node--level-0' + (isTriggerActiveLayout ? ' tree-node--active-layout' : '');

    const badge = document.createElement('span');
    let badgeClass = 'tree-trigger-key';
    if (state.selectedTrigger === trigger.key && state.editingBinding) {
      if (state.selectedSublayer !== null || (state.editingBinding.isLayer)) {
        badgeClass += ' tree-trigger-key--sublayer';
      } else {
        badgeClass += ' tree-trigger-key--bound';
      }
    }
    badge.className = badgeClass;
    badge.textContent = trigger.badge;
    triggerNode.appendChild(badge);

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

    // "+" add direct binding button on trigger node
    const addDirectBtn = document.createElement('button');
    addDirectBtn.className = 'tree-add-btn';
    addDirectBtn.textContent = '+';
    addDirectBtn.title = 'Add direct binding';
    addDirectBtn.onclick = e => {
      e.stopPropagation();
      state.selectedTrigger = trigger.key;
      state.selectedSublayer = null;
      if (!expandedNodes.has(triggerId)) expandedNodes.add(triggerId);
      openAddBinding('');
      render();
    };
    triggerNode.appendChild(addDirectBtn);

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

    const isActiveTrigger = state.selectedTrigger === trigger.key;

    // Level 1: Direct bindings as leaf nodes
    for (const b of triggerData.directBindings) {
      const leaf = document.createElement('div');
      const isLeafEditing = state.editingBinding && state.editingBinding.key === b.key && state.selectedSublayer === null && state.selectedTrigger === trigger.key;
      leaf.className = 'tree-node tree-node--level-1 tree-node--binding';

      const bKey = document.createElement('span');
      let bKeyClass = 'tree-binding-key';
      if (isLeafEditing) bKeyClass += ' tree-binding-key--selected';
      else if (!isLeafEditing) bKeyClass += ' tree-binding-key--inactive';
      bKey.className = bKeyClass;
      bKey.textContent = b.key.toUpperCase();
      leaf.appendChild(bKey);

      const bDesc = document.createElement('span');
      bDesc.className = 'tree-binding-desc';
      bDesc.textContent = describeAction(b);
      leaf.appendChild(bDesc);

      leaf.onclick = () => {
        state.selectedTrigger = trigger.key;
        state.selectedSublayer = null;
        state.selectedBinding = b.key;
        openEditBinding(b);
        render();
      };

      container.appendChild(leaf);
    }

    // Level 1: Sublayers
    for (const sl of triggerData.sublayers) {
      renderSublayerNode(container, trigger.key, sl.key, sl.label, sl.bindings, isActiveTrigger);
    }
  }
}

function renderSublayerNode(container, triggerKey, sublayerKey, label, bindings, isActiveTrigger) {
  const nodeId = 'sublayer:' + triggerKey + ':' + (sublayerKey || '_direct');
  const isExpanded = expandedNodes.has(nodeId);
  const isEditingThisLayer = state.editingBinding && state.editingBinding.isLayer && state.editingBinding.key === sublayerKey && state.selectedTrigger === triggerKey;
  const isActiveLayout = state.selectedTrigger === triggerKey && state.selectedSublayer === sublayerKey;

  const node = document.createElement('div');
  let nodeClass = 'tree-node tree-node--level-1';
  if (isActiveLayout) nodeClass += ' tree-node--active-layout';
  node.className = nodeClass;

  // Key badge first (for vertical alignment with binding keys)
  if (sublayerKey !== null) {
    const keyEl = document.createElement('span');
    let keyClass = 'tree-key';
    if (isEditingThisLayer) keyClass += ' tree-key--selected';
    else if (!isActiveLayout && !isEditingThisLayer) keyClass += ' tree-key--inactive';
    keyEl.className = keyClass;
    keyEl.textContent = sublayerKey;
    node.appendChild(keyEl);
  }

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

  // Label
  const labelEl = document.createElement('span');
  labelEl.className = 'tree-label';
  labelEl.textContent = label;
  node.appendChild(labelEl);

  // Count
  const countEl = document.createElement('span');
  countEl.className = 'tree-count';
  countEl.textContent = bindings.length;
  node.appendChild(countEl);

  // "Open" button to navigate into sublayer's keyboard layout
  const openBtn = document.createElement('button');
  openBtn.className = 'tree-add-btn';
  openBtn.textContent = 'Open';
  openBtn.title = 'Open layer keyboard layout';
  openBtn.onclick = e => {
    e.stopPropagation();
    state.selectedTrigger = triggerKey;
    state.selectedSublayer = sublayerKey;
    state.selectedBinding = null;
    closeBindingForm();
    if (!expandedNodes.has(nodeId)) expandedNodes.add(nodeId);
    render();
  };
  node.appendChild(openBtn);

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

  // Click handler: open sublayer in binding editor
  node.onclick = () => {
    state.selectedTrigger = triggerKey;
    const sl = store.sublayers(triggerKey).find(s => s.key === sublayerKey);
    if (sl) openEditSublayer(sl);
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
        const isLeafEditing = state.editingBinding && state.editingBinding.key === b.key && state.selectedSublayer === sublayerKey && state.selectedTrigger === triggerKey;
        leaf.className = 'tree-node tree-node--level-2';

        const bKey = document.createElement('span');
        let bKeyClass = 'tree-binding-key';
        if (isLeafEditing) bKeyClass += ' tree-binding-key--selected';
        else bKeyClass += ' tree-binding-key--inactive';
        bKey.className = bKeyClass;
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
      const isEditing = state.editingBinding && state.editingBinding.key === k;
      if (isEditing) cell.classList.add('selected');

      if (binding) {
        cell.classList.add('bound');
        const actionSpan = document.createElement('span');
        actionSpan.className = 'key-action';
        actionSpan.textContent = describeAction(binding);
        cell.appendChild(actionSpan);
        cell.onclick = () => {
          state.selectedBinding = binding.key;
          openEditBinding(binding);
          renderKeyGrid();
        };
      } else if (isSublayerActivator) {
        cell.classList.add('sublayer-activator');
        const sl = store.sublayers(state.selectedTrigger).find(s => s.key === k);
        const actionSpan = document.createElement('span');
        actionSpan.className = 'key-action';
        actionSpan.textContent = sl?.label || '';
        cell.appendChild(actionSpan);
        cell.onclick = () => { if (sl) openEditSublayer(sl); render(); };
      } else {
        cell.onclick = () => { openAddBinding(k); renderKeyGrid(); };
      }

      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
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
