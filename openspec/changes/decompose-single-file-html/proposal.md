## Why

The single `index.html` file is 1,887 lines (~54KB) containing all CSS, HTML, and JavaScript. This makes AI coding agents (Claude Code, Cursor, etc.) struggle with targeted edits — they must load the entire file into context for even small changes, leading to wasted context window, imprecise edits, and frequent merge conflicts. Decomposing into focused files (~200-300 lines each) while maintaining single-file distribution via a build step will dramatically improve AI-assisted development velocity.

## What Changes

- Split `index.html` into ~10 focused source files organized by concern (CSS, HTML template, JS modules)
- Introduce a build system that bundles all source files back into a single `dist/index.html` for distribution
- Add `package.json` with build/dev scripts
- Add `.gitignore` for build artifacts
- The distributed artifact remains a single self-contained HTML file — no behavioral changes

## Capabilities

### New Capabilities
- `build-system`: Build pipeline that bundles multi-file source into a single distributable HTML file, with dev server for local development

### Modified Capabilities

(none — no behavioral changes to existing capabilities, only structural refactoring of the source code)

## Impact

- **Code**: `index.html` replaced by `src/` directory with ~10 files + build config
- **Dependencies**: New dev dependency on build tooling (Vite + vite-plugin-singlefile recommended)
- **Distribution**: Output `dist/index.html` replaces root `index.html` as the distributable artifact
- **Workflow**: Developers run `npm run dev` for local development, `npm run build` to produce the single-file output
- **Git**: `.gitignore` updated for `node_modules/` and `dist/`
