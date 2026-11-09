# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SZGF Generator** (<https://szgf.seria.moe>) - A web-based form builder that generates SZGF-compliant YAML guides for Zenless Zone Zero characters. A client-side single-page app built with React 19, Vite 7, and TypeScript.

## Development Commands

```bash
# Development server (hot reload)
pnpm dev

# Type-check (tsc -b) and production build to dist/
pnpm build

# Serve the production build locally
pnpm preview
```

## Architecture

### Entry Points

- [index.html](index.html) - HTML shell; an inline script applies the `dark` class from `localStorage`/`prefers-color-scheme` before React mounts
- [src/main.tsx](src/main.tsx) - Mounts `<App />`
- [src/App.tsx](src/App.tsx) - Holds all state and lays out the page

### State Management Pattern

**Single Source of Truth**: All form state lives in [src/App.tsx](src/App.tsx) as a single `formData` object managed by `useState`. Its type (`FormData`) and initial value (`defaultFormData`) are defined in [lib/form-data.ts](lib/form-data.ts).

**State Updates**: [components/szgf-form.tsx](components/szgf-form.tsx) defines path-based helpers that `structuredClone` the current data and replace it:

- `updateField(path, value)` - Updates nested fields using dot notation (e.g., `"character.name"`)
- `addArrayItem(path, template)` - Appends to arrays with a template object
- `removeArrayItem(path, index)` - Removes from arrays by index
- `updateArrayItem(path, index, field, value)` - Updates specific fields in array items

State flows **down only** through prop drilling (no Context API or state management library):

```
App.tsx (state holder)
    ├─> Header        (ThemeToggle + YAMLActions: export/import/clear/validate)
    ├─> SZGFForm      (form inputs)
    ├─> YAMLPreview   (desktop: live output in right pane)
    └─> YAMLDrawer    (mobile: sheet containing YAMLActions + YAMLPreview)
```

Layout switches on `useIsMobile()` (<768px).

### YAML Generation

`generateYAML()` in [components/yaml-actions.tsx](components/yaml-actions.tsx) performs two steps:

1. **Cleaning**: Removes `null`, empty strings, and empty arrays using a `JSON.stringify` replacer
2. **Serialization**: `js-yaml` with `lineWidth: -1`, `noRefs: true`, `quotingType: '"'`, prefixed with `# yaml-language-server: $schema=../../schema.json`

[components/yaml-preview.tsx](components/yaml-preview.tsx) duplicates the same cleaning and dump options for the live preview. Keep the two in sync when changing output.

### Form Structure

[components/szgf-form.tsx](components/szgf-form.tsx) is the main form component (~1,570 lines):

- **Accordion-based UI** with 10 sections: Basic Information, Character, W-Engines, Discs, Stats, Skill Priority, Skills, Teams, Rotation, Mindscape Cinemas
- **Game data**: On mount, fetches the current ZZZ version and the character, weapon, and drive disc lists from `static.nanoka.cc` (helpers in [lib/utils.ts](lib/utils.ts)) to populate pickers and icons
- **Rich text**: Long text fields use [components/rich-text-editor.tsx](components/rich-text-editor.tsx), a textarea with markdown and skill-tag insertion buttons

### Component Structure

```
index.html              - HTML shell, fonts, favicons, theme bootstrap script
src/
  ├─ main.tsx           - React root
  ├─ App.tsx            - State holder and layout
  └─ globals.css        - Tailwind imports + CSS variables for theming

components/
  ├─ header.tsx         - Title bar with ThemeToggle and YAMLActions
  ├─ yaml-actions.tsx   - Download/copy, import (file/paste), clear, schema validation
  ├─ yaml-preview.tsx   - Live YAML preview
  ├─ yaml-drawer.tsx    - Mobile bottom sheet with actions + preview
  ├─ szgf-form.tsx      - Main form
  ├─ rich-text-editor.tsx
  ├─ theme-toggle.tsx   - Toggles `dark` class on <html>, persists to localStorage
  └─ ui/                - shadcn/ui components (Radix UI + Tailwind), only the ones in use

hooks/
  ├─ use-toast.ts       - Toast notification system (reducer pattern)
  └─ use-mobile.ts      - Mobile breakpoint detection (<768px)

lib/
  ├─ form-data.ts       - FormData types and defaultFormData
  └─ utils.ts           - cn(), getZZZVersion(), nanoka.cc URL helpers
```

## Key Technologies

- **Vite 7** with `@vitejs/plugin-react-swc` - config in [vite.config.ts](vite.config.ts)
- **React 19**
- **TypeScript** - Strict mode; `pnpm build` type-checks before bundling
- **Tailwind CSS v4** - via `@tailwindcss/postcss` ([postcss.config.mjs](postcss.config.mjs)), purple theme
- **js-yaml 4.1.1** - YAML parsing and generation
- **ajv 8** - JSON Schema validation
- **Radix UI** / **shadcn/ui** - UI primitives and components
- **Lucide React** - Icons

## SZGF Format

The **Standardized ZZZ Guide Format** is a YAML structure with these fields:

**Required**:

- `author` - Guide author name
- `last_updated` - ISO date string
- `description` - Multi-line guide overview
- `character` - Object with `name` (string), `rarity` (4 or 5), optional `banner` (URL)
- `weapons` - Array of W-Engine recommendations
- `skills` - Array of skill explanations
- `mindscapes` - Array of M1-M6 descriptions

**Optional**:

- `discs` - Drive disc configurations (four_pieces, two_pieces, extra_sections)
- `stat` - Stat priorities (main_stats by position, sub_stats, baseline, extra_sections)
- `skill_priority` - Upgrade priorities with optional descriptions
- `team` - Team compositions with multiple teams and characters
- `rotation` - Skill rotation guide

### Optional Sections Pattern

Optional sections follow a strict pattern per SZGF Pydantic schema requirements:

1. **Initialization**: Optional sections start as `null` in `defaultFormData`
2. **Enabling**: When user adds the section, it's initialized with a valid template object containing required nested fields
3. **Disabling**: When user removes the section, it's set back to `null`
4. **YAML Output**: During generation, `null` values are converted to `undefined` and omitted from the output

**Critical Rule**: Empty objects `{}` are **not valid** for `discs`, `stat`, or `skill_priority`. These keys must **only appear in YAML when they contain properly filled required fields**. The Pydantic schema enforces:

- `discs` requires `four_pieces` and `two_pieces` arrays
- `stat` requires `main_stats`, `sub_stats`, and `baseline_stats`
- `skill_priority` requires `priorities` array

This is why the `null` → `undefined` → omit pattern is correct.

## YAML Validation

Validation lives in [components/yaml-actions.tsx](components/yaml-actions.tsx):

- **Schema loading**: On mount, fetches `https://raw.githubusercontent.com/seriaati/szgf/refs/heads/main/schema.json` and compiles it with `ajv` (`allErrors: true, strict: false`)
- **`validateFormData()`**: Checks basic required fields (author, last_updated, description, character name/rarity), then runs the compiled schema against the cleaned data. Returns `null` if valid, or an array of error strings
- **Live validation**: A `useEffect` re-validates whenever `formData` or the schema changes, once the basic fields are filled
- **Error reporting**: Errors are passed up via `onValidationChange` to `App`, which hands them to `YAMLPreview` for display
- **Export protection**: Download and Copy are blocked when validation fails

## Important Notes

- **No backend** - Pure client-side app; builds to static files in `dist/`
- **External data** - Schema from GitHub, game data and icons from `static.nanoka.cc`
- **No persistence** - Form data exists only in memory; only the theme choice is saved to `localStorage`
- **Path aliases** - `@/*` maps to the project root (both [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts))
- **Theming** - CSS variables in [src/globals.css](src/globals.css) use oklch with a purple primary color; dark mode is the `dark` class on `<html>`

## Common Patterns

### Adding a New Form Field

1. Add the field to `FormData` and `defaultFormData` in [lib/form-data.ts](lib/form-data.ts)
2. Add UI in [components/szgf-form.tsx](components/szgf-form.tsx) using `updateField()`, `addArrayItem()`, etc.
3. The YAML preview updates automatically

### Modifying YAML Output

Edit `generateYAML()` in [components/yaml-actions.tsx](components/yaml-actions.tsx) and the matching logic in [components/yaml-preview.tsx](components/yaml-preview.tsx).

### Adding New Optional Sections

1. Initialize as `null` in `defaultFormData` ([lib/form-data.ts](lib/form-data.ts))
2. Add an "Add Section" button that sets it to a valid template object with required fields
3. Add a "Remove Section" button that sets it back to `null` (stripped from YAML output)
4. Template objects must include all required nested fields per the Pydantic schema (e.g., `{ four_pieces: [], two_pieces: [], extra_sections: [] }` for discs)
