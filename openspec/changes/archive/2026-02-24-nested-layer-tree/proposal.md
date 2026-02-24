## Why

The current UI separates trigger key selection (dropdown in header), sublayer navigation (flat list on the left), and binding editing (split between key grid and binding panel at the bottom). This scatters related concepts across different UI areas. By restructuring the left panel into a nested tree, the trigger key, sublayers, and individual bindings all live in one navigable hierarchy, freeing the main area for a dedicated binding editor.

## What Changes

- The flat sublayer list on the left becomes a **nested tree** with three levels: trigger key > sublayer > binding
- **Trigger key selector** (currently a dropdown in the header) is removed and replaced by the top-level tree nodes: one node for "Tab" bindings, one for "Caps Lock" bindings (the active trigger key's node is the one displayed/expanded)
- **Binding list** (currently shown in the lower-right panel) moves into the tree as leaf nodes under each sublayer
- Selecting a binding leaf node in the tree opens its **full editing UI** in the main content area (the lower portion of the screen currently occupied by the binding list)
- The key grid remains for visual overview; the binding panel below it becomes the dedicated editing area for the selected binding

## Capabilities

### New Capabilities
- `nested-layer-tree`: Hierarchical tree navigation with three levels (trigger key > sublayer > binding) replacing the flat sublayer list, with expand/collapse behavior and selection state management

### Modified Capabilities
- `hyper-key-config`: Trigger key selection moves from a header dropdown to top-level tree nodes in the left panel
- `sublayer-editor`: Sublayer list display and binding list display move into the nested tree structure; binding editing gets a dedicated full panel instead of sharing space with the binding list

## Impact

- `index.html`: Major restructuring of the left panel HTML, removal of trigger key dropdown from header, removal of binding list panel, addition of tree component and dedicated binding editor panel
- `renderSublayerPanel()`: Replaced by new tree rendering logic
- `renderBindingList()`: Replaced by inline tree leaf rendering + dedicated editor panel
- `selectedSublayer` state: Extended to also track selected binding within the tree
- CSS: New styles for tree indentation, expand/collapse icons, tree node selection states
