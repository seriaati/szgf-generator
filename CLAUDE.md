# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SZGF Generator** (<https://szgf.seria.moe>) - A web-based form builder that generates SZGF-compliant YAML guides for Zenless Zone Zero characters. Built with Next.js 16, React 19, and TypeScript.

## Development Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm start

# Run linter
npm run lint
```

## Architecture

### State Management Pattern

**Single Source of Truth**: All form state lives in [app/page.tsx:9-26](app/page.tsx#L9-L26) as a single `formData` object managed by `useState`.

**State Updates**: The form uses **immutable updates with path-based field access**:
- `updateField(path, value)` - Updates nested fields using dot notation (e.g., `"character.name"`)
- `addArrayItem(path, template)` - Appends to arrays with a template object
- `removeArrayItem(path, index)` - Removes from arrays by index
- `updateArrayItem(path, index, field, value)` - Updates specific fields in array items

State flows **down only** through prop drilling (no Context API or state management library):

```
page.tsx (state holder)
    ├─> Header (export/import/clear controls)
    ├─> SZGFForm (form inputs)
    └─> YAMLPreview (real-time output)
```

### YAML Generation

The YAML generation logic in [components/header.tsx:32-48](components/header.tsx#L32-L48) performs two key steps:

1. **Cleaning**: Removes `null`, empty strings, and empty arrays using `JSON.stringify` replacer
2. **Serialization**: Uses `js-yaml` library with these options:
   - `lineWidth: -1` - No line wrapping
   - `noRefs: true` - No YAML references
   - `quotingType: '"'` - Use double quotes

### Form Structure

[components/szgf-form.tsx](components/szgf-form.tsx) is the **main form component (940 lines)** organized as:

- **Accordion-based UI** with 9 collapsible sections
- **Required sections**: Basic Info, Character, Weapons, Skills, Mindscapes
- **Optional sections**: Discs, Stats, Skill Priority, Team, Rotation
- **Array management**: Add/Remove buttons for dynamic lists (weapons, skills, mindscapes, teams, etc.)

Path-based updates enable deep nested modifications without complex logic:

```typescript
updateField("character.name", "Nicole")
updateArrayItem("weapons", 0, "description", "Best weapon for Nicole")
```

### Component Structure

```
app/
  ├─ layout.tsx          - Root layout with metadata, theme provider, Analytics
  ├─ page.tsx           - Main page with state management and layout
  └─ globals.css        - Tailwind imports + CSS variables for theming

components/
  ├─ header.tsx         - Export (download/copy), import (file/paste), clear
  ├─ szgf-form.tsx      - Main form with 9 accordion sections
  ├─ yaml-preview.tsx   - Live YAML preview with useEffect watching formData
  ├─ theme-provider.tsx - next-themes wrapper for dark mode
  └─ ui/               - 60+ shadcn/ui components (Radix UI + Tailwind)

hooks/
  ├─ use-toast.ts       - Custom toast notification system (reducer pattern)
  └─ use-mobile.ts      - Mobile breakpoint detection (<768px)

lib/
  └─ utils.ts          - cn() function (clsx + tailwind-merge)
```

## Key Technologies

- **Next.js 16** - App Router, client-side only (no API routes)
- **React 19** - Latest features, all interactive components use `"use client"`
- **TypeScript** - Strict mode enabled in [tsconfig.json](tsconfig.json)
- **Tailwind CSS v4** - Latest with PostCSS plugin, custom purple gaming theme
- **js-yaml 4.1.1** - YAML parsing and generation
- **Radix UI** - Accessible component primitives (30+ packages)
- **shadcn/ui** - Pre-built components using Radix + Tailwind
- **Lucide React** - Icon library

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

All optional sections can be toggled on/off in the UI, represented as `null` when disabled.

## Important Notes

- **No backend** - Pure client-side React app with no API routes or database
- **No persistence** - Form data exists only in memory (state)
- **Build config** - `next.config.mjs` has `ignoreBuildErrors: true` to allow TypeScript errors during builds
- **Path aliases** - `@/*` maps to project root in [tsconfig.json:26-28](tsconfig.json#L26-L28)
- **Theming** - CSS variables in [app/globals.css](app/globals.css) use oklch color space with purple primary color
- **Immutable updates** - Always spread objects/arrays when updating nested state

## Common Patterns

### Adding a New Form Field

1. Update the `formData` initial state in [app/page.tsx](app/page.tsx)
2. Add UI in [components/szgf-form.tsx](components/szgf-form.tsx) using `updateField()`, `addArrayItem()`, etc.
3. The YAML preview will automatically update (no changes needed)

### Modifying YAML Output

Edit the `generateYAML()` function in [components/header.tsx](components/header.tsx) to adjust cleaning logic or `js-yaml` options.

### Adding New Optional Sections

1. Initialize as `null` in formData
2. Add checkbox to enable/disable the section
3. Set to `null` when disabled (it will be stripped from YAML output)
4. Use template objects when enabling (e.g., `{ four_pieces: [], two_pieces: [] }`)
