import { store } from './state.js';
import { showToast } from './dialogs.js';

const MIME = 'application/x-binding-drag';

export function makeBindingDraggable(leaf, triggerKey, sublayerKey, bindingKey) {
  leaf.draggable = true;

  leaf.addEventListener('dragstart', e => {
    e.stopPropagation();
    const data = JSON.stringify({ triggerKey, sublayerKey, bindingKey });
    e.dataTransfer.setData(MIME, data);
    e.dataTransfer.effectAllowed = 'move';
    leaf.classList.add('dragging');
  });

  leaf.addEventListener('dragend', () => {
    leaf.classList.remove('dragging');
    clearAllIndicators();
  });
}

export function makeBindingDropZone(leaf, triggerKey, sublayerKey, bindingKey, getIndex) {
  let enterCount = 0;

  leaf.addEventListener('dragover', e => {
    const raw = e.dataTransfer.types.includes(MIME);
    if (!raw) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = leaf.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    leaf.classList.toggle('drag-over-above', e.clientY < midY);
    leaf.classList.toggle('drag-over-below', e.clientY >= midY);
  });

  leaf.addEventListener('dragenter', e => {
    enterCount++;
    e.preventDefault();
  });

  leaf.addEventListener('dragleave', () => {
    enterCount--;
    if (enterCount <= 0) {
      enterCount = 0;
      leaf.classList.remove('drag-over-above', 'drag-over-below');
    }
  });

  leaf.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    enterCount = 0;
    clearAllIndicators();

    const src = JSON.parse(e.dataTransfer.getData(MIME));
    if (src.triggerKey === triggerKey && src.sublayerKey === sublayerKey && src.bindingKey === bindingKey) return;

    const sameParent = src.triggerKey === triggerKey && src.sublayerKey === sublayerKey;
    if (sameParent) {
      const rect = leaf.getBoundingClientRect();
      const above = e.clientY < rect.top + rect.height / 2;
      let targetIdx = getIndex();
      const bindings = store._getBindings(triggerKey, sublayerKey);
      const srcIdx = bindings.findIndex(b => b.key === src.bindingKey);
      if (srcIdx < targetIdx) targetIdx--;
      if (!above) targetIdx++;
      store.reorderBinding(triggerKey, sublayerKey, src.bindingKey, Math.min(targetIdx, bindings.length - 1));
    } else {
      const ok = store.moveBinding(src.triggerKey, src.sublayerKey, src.bindingKey, triggerKey, sublayerKey);
      if (!ok) {
        showToast(`Key '${src.bindingKey.toUpperCase()}' already exists in target layer`);
      }
    }
  });
}

export function makeParentDropZone(node, triggerKey, sublayerKey) {
  let enterCount = 0;

  node.addEventListener('dragover', e => {
    const raw = e.dataTransfer.types.includes(MIME);
    if (!raw) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  node.addEventListener('dragenter', e => {
    if (!e.dataTransfer.types.includes(MIME)) return;
    enterCount++;
    node.classList.add('drag-over-into');
  });

  node.addEventListener('dragleave', () => {
    enterCount--;
    if (enterCount <= 0) {
      enterCount = 0;
      node.classList.remove('drag-over-into');
    }
  });

  node.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    enterCount = 0;
    clearAllIndicators();

    const src = JSON.parse(e.dataTransfer.getData(MIME));
    if (src.triggerKey === triggerKey && src.sublayerKey === sublayerKey) return;

    const ok = store.moveBinding(src.triggerKey, src.sublayerKey, src.bindingKey, triggerKey, sublayerKey);
    if (!ok) {
      showToast(`Key '${src.bindingKey.toUpperCase()}' already exists in target layer`);
    }
  });
}

function clearAllIndicators() {
  document.querySelectorAll('.drag-over-above, .drag-over-below, .drag-over-into, .dragging').forEach(el => {
    el.classList.remove('drag-over-above', 'drag-over-below', 'drag-over-into', 'dragging');
  });
}
