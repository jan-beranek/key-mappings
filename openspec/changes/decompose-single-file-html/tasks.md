## 1. Build System Setup

- [x] 1.1 Create `package.json` with `dev` and `build` scripts, add `vite` and `vite-plugin-singlefile` as dev dependencies
- [x] 1.2 Create `vite.config.js` configuring vite-plugin-singlefile with `src/index.html` as entry
- [x] 1.3 Add `node_modules/` and `dist/` to `.gitignore`

## 2. Source Directory Structure

- [x] 2.1 Create `src/` directory with subdirectories `src/styles/` and `src/js/`
- [x] 2.2 Create `src/index.html` — extract HTML markup (lines 638-733) with `<link>` tags for CSS files and `<script type="module">` for the JS entry point

## 3. Extract CSS Files

- [x] 3.1 Extract `src/styles/variables.css` — CSS custom properties (lines 8-30)
- [x] 3.2 Extract `src/styles/base.css` — global resets, button variants, input styles (lines 32-99)
- [x] 3.3 Extract `src/styles/paste-view.css` — paste view styles (lines 101-144)
- [x] 3.4 Extract `src/styles/editor-layout.css` — editor view layout, header, body (lines 146-184)
- [x] 3.5 Extract `src/styles/sublayer-panel.css` — sublayer panel, tree nodes (lines 185-385)
- [x] 3.6 Extract `src/styles/key-grid.css` — key grid, key cells (lines 387-485)
- [x] 3.7 Extract `src/styles/binding-panel.css` — binding editor panel and form (lines 487-584)
- [x] 3.8 Extract `src/styles/dialogs.css` — toast notifications, confirm dialog (lines 586-635)

## 4. Extract JavaScript Modules

- [x] 4.1 Extract `src/js/config-store.js` — ConfigStore class (lines 736-828) with `export`
- [x] 4.2 Extract `src/js/default-config.js` — `createDefaultConfig()` function (lines 830-842) with `export`
- [x] 4.3 Extract `src/js/parser.js` — `normalizeInput()`, `parseRules()`, and helper functions (lines 844-1047) with `export`
- [x] 4.4 Extract `src/js/serializer.js` — `serializeConfig()` and all serialization helpers (lines 1049-1205) with `export`
- [x] 4.5 Extract `src/js/renderer.js` — `render()`, `renderTree()`, `renderSublayerNode()`, `renderKeyGrid()`, `renderBindingEditor()`, `getCurrentBindings()` (lines 1207-1538) with `export`, importing from config-store and serializer as needed
- [x] 4.6 Extract `src/js/binding-form.js` — `openAddBinding()`, `openEditBinding()`, `showBindingForm()`, `closeBindingForm()`, `saveBinding()`, modifier helpers (lines 1540-1699) with `export`
- [x] 4.7 Extract `src/js/dialogs.js` — `showToast()`, `showConfirm()` (lines 1701-1736) with `export`
- [x] 4.8 Extract `src/js/app.js` — UI state variables, KEY_ROWS constant, view switching, `init()` with event wiring (lines 1207-1227, 1738-1887), importing all other modules

## 5. Wiring and Integration

- [x] 5.1 Resolve cross-module dependencies — ensure all shared state (store, selectedSublayer, selectedBinding, etc.) is properly exported/imported across modules
- [x] 5.2 Update `src/index.html` to import all CSS files via `<link>` tags and load `src/js/app.js` as `<script type="module">`

## 6. Verification

- [x] 6.1 Run `npm run build` and verify `dist/index.html` is a single self-contained file with no external references
- [x] 6.2 Open `dist/index.html` via file:// protocol and verify all functionality works identically to the original (load JSON, edit bindings, copy JSON output)
- [x] 6.3 Run `npm run dev` and verify hot reload works for CSS and JS changes
- [x] 6.4 Verify all source files in `src/` are under 350 lines
- [x] 6.5 Remove the original root `index.html` after confirming `dist/index.html` is equivalent
