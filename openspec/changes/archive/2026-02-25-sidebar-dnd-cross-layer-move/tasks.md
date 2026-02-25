## 1. Config Store — Move and Reorder Methods

- [x] 1.1 Add `reorderBinding(triggerKey, sublayerKey, bindingKey, newIndex)` method to `ConfigStore` that reorders a binding within its current array and emits `change`
- [x] 1.2 Add `moveBinding(fromTrigger, fromSublayer, bindingKey, toTrigger, toSublayer)` method to `ConfigStore` that removes the binding from the source array, validates no key conflict at destination, inserts into the destination array, and emits `change`. Return false on conflict.

## 2. Drag Setup — Make Binding Leaves Draggable

- [x] 2.1 In `renderTree()`, set `draggable="true"` on direct binding leaf nodes (level 1) and add `dragstart`/`dragend` handlers that encode `{ triggerKey, sublayerKey, bindingKey }` in `dataTransfer` and toggle `.dragging` class
- [x] 2.2 In `renderSublayerNode()`, set `draggable="true"` on sublayer binding leaf nodes (level 2) and add the same `dragstart`/`dragend` handlers

## 3. Drop Zones — Reorder Within Same Parent

- [x] 3.1 Add `dragover`/`drop` handlers on binding leaf nodes that detect top/bottom half of the target, show `.drag-over-above` or `.drag-over-below` insertion indicator, and on drop call `store.reorderBinding()` for same-parent drops
- [x] 3.2 Add `dragenter`/`dragleave` handlers on binding leaf nodes with reference-counting or `relatedTarget` checks to prevent flickering indicators on child elements

## 4. Drop Zones — Reparent to Different Layer

- [x] 4.1 Add `dragover`/`dragenter`/`dragleave`/`drop` handlers on trigger key nodes (level 0) that show `.drag-over-into` highlight and on drop call `store.moveBinding()` to move the binding into direct bindings
- [x] 4.2 Add `dragover`/`dragenter`/`dragleave`/`drop` handlers on sublayer nodes (level 1) that show `.drag-over-into` highlight and on drop call `store.moveBinding()` to move the binding into that sublayer
- [x] 4.3 On `moveBinding()` failure (key conflict), show a toast error "Key 'X' already exists in target layer" using the existing `showToast()` dialog utility

## 5. CSS — Drop Indicator Styles

- [x] 5.1 Add `.dragging` style to `sublayer-panel.css` that dims the source node during drag (e.g., `opacity: 0.4`)
- [x] 5.2 Add `.drag-over-above` and `.drag-over-below` styles that show a 2px accent-colored horizontal line at the top/bottom edge of the binding node
- [x] 5.3 Add `.drag-over-into` style that highlights trigger/sublayer nodes as valid drop targets (e.g., background tint or border accent)

## 6. Edge Cases and Polish

- [x] 6.1 Ensure click interactions on binding leaves still work normally (click without drag opens the binding editor) — verify `dragstart` only fires after sufficient mouse movement
- [x] 6.2 Clear all drag indicator classes on `dragend` and `drop` events to prevent stale visual state
- [x] 6.3 Prevent dropping a binding onto itself or its own current parent (no-op instead of error)
