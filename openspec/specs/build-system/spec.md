## ADDED Requirements

### Requirement: Dev server with hot reload
The build system SHALL provide a development server that serves the multi-file source with hot module replacement, so developers can edit individual files and see changes immediately without full page reload.

#### Scenario: Start dev server
- **WHEN** developer runs `npm run dev`
- **THEN** a local development server starts and serves the application from `src/`

#### Scenario: Hot reload on CSS change
- **WHEN** a CSS file in `src/styles/` is modified while the dev server is running
- **THEN** the browser updates styles without a full page reload

#### Scenario: Hot reload on JS change
- **WHEN** a JS file in `src/js/` is modified while the dev server is running
- **THEN** the browser reloads to reflect the updated logic

### Requirement: Single-file production build
The build system SHALL produce a single self-contained HTML file at `dist/index.html` that includes all CSS and JavaScript inlined, with no external dependencies or asset references.

#### Scenario: Build produces single HTML file
- **WHEN** developer runs `npm run build`
- **THEN** `dist/index.html` is created containing all CSS inlined in `<style>` tags and all JavaScript inlined in `<script>` tags

#### Scenario: Build output is self-contained
- **WHEN** `dist/index.html` is opened directly in a browser (file:// protocol)
- **THEN** the application loads and functions identically to the original single-file `index.html`

#### Scenario: No external references in build output
- **WHEN** `dist/index.html` is inspected
- **THEN** it contains no `<link>` tags referencing external stylesheets and no `<script src="...">` tags referencing external scripts

### Requirement: Minimal build configuration
The build system SHALL require minimal configuration — only a `vite.config.js` and `package.json` with two dev dependencies (vite, vite-plugin-singlefile).

#### Scenario: Install and build from clean checkout
- **WHEN** a developer clones the repository and runs `npm install && npm run build`
- **THEN** the build completes successfully and produces `dist/index.html`

### Requirement: Source file size limit
Each source file in `src/` SHALL be under 350 lines to optimize for AI coding agent context windows.

#### Scenario: All source files within size limit
- **WHEN** the decomposition is complete
- **THEN** every `.html`, `.css`, and `.js` file in `src/` is under 350 lines
