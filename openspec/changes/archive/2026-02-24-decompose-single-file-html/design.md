## Context

KEKE ([HYPER] Key Editor for Karabiner-Elements) is a single-file HTML application (`index.html`, 1,887 lines, ~54KB). It contains inline CSS (lines 7-636), HTML markup (lines 638-731), and JavaScript (lines 735-1888). The JavaScript has clear logical modules: ConfigStore (state management), JSON parser, JSON serializer, UI rendering, binding form management, dialogs, and event wiring.

The file is distributed as a single HTML file that users open directly in a browser — no server required. This distribution model must be preserved.

AI coding agents perform best with files of 200-300 lines. At ~1,900 lines, the current file wastes context window on unrelated code for every edit, leading to imprecise changes and slow iteration.

## Goals / Non-Goals

**Goals:**
- Decompose into focused files (~200-300 lines each) aligned with logical boundaries
- Maintain single-file HTML distribution via automated build
- Provide a dev server with hot reload for local development
- Zero behavioral changes — pure structural refactoring
- File structure and naming optimized for AI agent discoverability

**Non-Goals:**
- Framework adoption (React, Vue, etc.) — stay vanilla JS
- TypeScript migration
- UI/UX changes
- CSS methodology changes (BEM, CSS modules, etc.)
- Test infrastructure

## Decisions

### Decision 1: Build tool — Vite + vite-plugin-singlefile

**Choice**: Vite with vite-plugin-singlefile

**Alternatives considered**:
- **Custom Node.js script**: Simplest, but no HMR, no module resolution, manual maintenance
- **esbuild + glue script**: Fast builds but no built-in HTML handling, requires custom assembly
- **Parcel**: Zero-config but inliner plugin is less maintained, Parcel v2 ecosystem instability

**Rationale**: Vite provides HMR for development, native ES module support, and vite-plugin-singlefile handles the single-HTML bundling. It's the most maintained and widely-used solution for this exact use case. Minimal configuration required for a vanilla JS project.

### Decision 2: File decomposition strategy — by concern within feature domains

**Choice**: Split into ~10 files organized by logical module, not by file type layer.

```
src/
  index.html              (~90 lines — HTML structure only)
  styles/
    variables.css          (~30 lines — CSS custom properties)
    base.css               (~70 lines — resets, buttons, inputs)
    paste-view.css         (~45 lines)
    editor-layout.css      (~40 lines)
    sublayer-panel.css     (~170 lines — tree nodes, panel)
    key-grid.css           (~70 lines — key cells, grid)
    binding-panel.css      (~100 lines — binding editor form)
    dialogs.css            (~50 lines — toast, confirm)
  js/
    config-store.js        (~90 lines — ConfigStore class)
    parser.js              (~200 lines — JSON parsing/normalization)
    serializer.js          (~160 lines — config to Karabiner JSON)
    renderer.js            (~310 lines — UI rendering functions)
    binding-form.js        (~160 lines — binding form management)
    dialogs.js             (~35 lines — toast & confirm)
    app.js                 (~150 lines — init, event wiring, view switching, glue)
```

**Rationale**: This mirrors the existing logical sections identified by comment headers in the source. Each file maps to one clearly-named responsibility. AI agents can identify the right file from the name alone without reading contents. The renderer.js is the largest at ~310 lines — acceptable since rendering logic is tightly coupled and splitting further would create excessive cross-file dependencies.

**Alternatives considered**:
- **Web Components**: Natural encapsulation but requires significant rewrite, not a structural refactoring
- **Split by UI view** (paste-view.js, editor-view.js): Would fragment related logic — parser is used by paste view but conceptually separate from its UI

### Decision 3: Module communication — ES module imports with shared state

**Choice**: Use ES module `import`/`export`. The ConfigStore instance is created in `app.js` and passed to modules that need it via function parameters or module-level imports.

**Rationale**: Native ES modules are supported by Vite out of the box. No need for a state management library — the existing ConfigStore EventTarget pattern works well. Functions that need the store receive it as a parameter from `app.js`.

### Decision 4: CSS handling — separate CSS files imported from JS

**Choice**: CSS files in `src/styles/`, imported via `index.html` `<link>` tags or Vite's CSS import in the entry JS file. Vite inlines them automatically in the build.

**Rationale**: CSS has no module dependencies — simple `<link>` imports in `index.html` are sufficient. Vite handles inlining during build. Splitting CSS by component/view matches the existing comment-delimited sections.

### Decision 5: Distribution artifact location

**Choice**: `dist/index.html` is the built artifact. Root `index.html` is removed after migration; source of truth moves to `src/`.

**Rationale**: Standard Vite convention. The `dist/` directory is gitignored; CI or the developer runs `npm run build` to produce the distributable file.

## Risks / Trade-offs

- **[New dev dependency on Node.js/npm]** → Users must have Node.js installed for development. Mitigated by keeping the build simple (2 dependencies) and documenting setup clearly. End users are unaffected — they still get a single HTML file.
- **[renderer.js exceeds 300 lines]** → Rendering logic is tightly coupled; splitting further would create circular dependencies between render functions. Acceptable at ~310 lines. Can be revisited later if it grows.
- **[vite-plugin-singlefile limitations]** → Only supports single HTML entry point (fine for this project). Public folder assets not auto-inlined (no external assets in this project).
- **[Module import order]** → Functions currently rely on being in a single scope. Refactoring to explicit imports may surface hidden dependencies. Mitigated by careful extraction following the existing logical boundaries.
