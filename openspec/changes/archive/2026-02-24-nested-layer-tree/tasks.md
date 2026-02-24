## 1. Tree State & Data

- [x] 1.1 Add `expandedNodes` Set and `selectedBinding` variable to the app state alongside existing `selectedSublayer`
- [x] 1.2 Initialize `expandedNodes` with the active trigger key node expanded when a config is loaded or created

## 2. Tree Rendering

- [x] 2.1 Create `renderTree()` function that replaces `renderSublayerPanel()` — renders level-0 trigger key nodes, level-1 sublayer nodes, and level-2 binding leaf nodes as flat `.tree-node` divs with depth-based `padding-left`
- [x] 2.2 Add expand/collapse toggle (chevron icon) to trigger key and sublayer nodes, wired to toggle entries in `expandedNodes`
- [x] 2.3 Render binding leaf nodes showing key badge and action description (reuse `describeAction()`)
- [x] 2.4 Show dimmed "No bindings" placeholder under expanded sublayers that have no bindings
- [x] 2.5 Add "+" button on sublayer nodes to trigger "add binding" mode in the editor panel

## 3. Tree Interaction

- [x] 3.1 Clicking an inactive trigger key node calls `store.setTriggerKey()`, expands it, and collapses the other
- [x] 3.2 Clicking a sublayer node sets `selectedSublayer`, clears `selectedBinding`, and updates the key grid
- [x] 3.3 Clicking a binding leaf node sets both `selectedSublayer` and `selectedBinding`, and opens the binding editor panel
- [x] 3.4 Preserve sublayer actions (rename, delete) — show on hover for sublayer nodes in the tree

## 4. Binding Editor Panel

- [x] 4.1 Replace the `#binding-panel` content: remove binding list rendering, keep only the binding edit form as a dedicated editor panel
- [x] 4.2 Show placeholder message ("Select a binding to edit, or click a key in the grid") when no binding is selected
- [x] 4.3 Wire binding form save/cancel to update `selectedBinding` state and re-render the tree
- [x] 4.4 Add delete binding action in the editor panel that removes the binding and clears selection

## 5. Header Cleanup

- [x] 5.1 Remove `#trigger-select` dropdown and `#tap-action` span from the header
- [x] 5.2 Remove `updateTriggerSelect()` function and its event listener

## 6. CSS

- [x] 6.1 Add tree node styles: `.tree-node` base, `.tree-node--level-0/1/2` indentation, `.tree-node--selected` highlight, `.tree-node--inactive` dimmed state
- [x] 6.2 Add expand/collapse chevron icon styles (CSS triangles or unicode) with rotation transition
- [x] 6.3 Increase `#sublayer-panel` width from 220px to ~280px to accommodate tree indentation
- [x] 6.4 Style the binding editor panel as a dedicated full-height section below the key grid

## 7. Integration & Cleanup

- [x] 7.1 Update `render()` to call `renderTree()` instead of `renderSublayerPanel()` and to conditionally render the binding editor based on `selectedBinding`
- [x] 7.2 Update key grid click handlers to set `selectedBinding` when clicking a bound key, opening the editor panel
- [x] 7.3 Remove old `renderBindingList()` function and associated binding list HTML/CSS
- [x] 7.4 Verify all existing flows work: add/edit/delete sublayer, add/edit/delete binding, trigger key switch, JSON copy, start over
