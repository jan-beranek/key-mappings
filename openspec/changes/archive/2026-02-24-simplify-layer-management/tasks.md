## 1. Add "Activate Layer" binding type to the form

- [x] 1.1 Add `<option value="layer">Activate Layer</option>` to `#bf-type` select in `src/index.html`
- [x] 1.2 Update `updateValuePlaceholder()` in `binding-form.js` to handle `layer` type — change label to "Label", placeholder to "Layer name (e.g. Open Apps)", hide modifier row
- [x] 1.3 Update `saveBinding()` in `binding-form.js` to branch on `layer` type — call `store.addSublayer()` for new, `store.renameSublayer()` for edit, instead of `store.addBinding()`/`store.updateBinding()`
- [x] 1.4 Handle delete in binding form for `layer` type — call `store.deleteSublayer()` with confirmation dialog
- [x] 1.5 Hide "Activate Layer" option when `selectedSublayer !== null` (prevent nesting layers)

## 2. Make sublayer activators editable via binding form

- [x] 2.1 Update key grid click handler for sublayer activator keys — open binding form pre-filled with type "layer", key (disabled), and sublayer label
- [x] 2.2 Add edit action to sublayer nodes in the tree — clicking a sublayer node (or an edit icon) opens the binding form for that sublayer activator

## 3. Remove "Direct" pseudo-layer from tree

- [x] 3.1 Remove the `renderSublayerNode(container, trigger.key, null, 'Direct', ...)` call from `renderTree()` in `renderer.js`
- [x] 3.2 Add rendering of direct bindings as level-1 leaf nodes directly under the trigger node (between trigger and sublayer nodes)
- [x] 3.3 Wire click handlers on direct binding leaves to set `selectedSublayer = null` and open the binding editor
- [x] 3.4 Add a "+" button to trigger nodes for adding direct bindings (replaces the "+" that was on the Direct pseudo-layer)
- [x] 3.5 Update key grid title to show "Caps Lock + Key" (remove "(Direct Bindings)" suffix) when `selectedSublayer === null`

## 4. Remove "+ Add Sublayer" UI

- [x] 4.1 Remove `#add-sublayer-area` section (button, form, inputs) from `src/index.html`
- [x] 4.2 Remove "Add Sublayer" event listeners and handlers from `app.js`
- [x] 4.3 Clean up any related CSS styles that are no longer used

## 5. Validation and edge cases

- [x] 5.1 Ensure creating an "Activate Layer" binding validates against duplicate sublayer keys and existing direct binding keys
- [x] 5.2 Ensure the key grid correctly shows sublayer activators as clickable/editable (opening binding form, not navigating into sublayer)
- [x] 5.3 Verify that selecting a trigger node in the tree still correctly shows direct bindings in the key grid
- [x] 5.4 Test full round-trip: load JSON → edit layers via binding form → copy JSON produces valid Karabiner config
