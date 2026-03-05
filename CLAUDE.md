# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VitePress-based bilingual (中文/English) website for HKUYA HKJC summer internship program with PocketBase backend and FormKit-powered admin interface.

## Development Commands

```bash
# Development
npm run docs:dev          # Start dev server (port 5173)
npm run docs:build        # Build for production
npm run docs:preview      # Preview production build

# Testing
npm test                  # Run all tests with Vitest
npx vitest run <path>     # Run specific test file
npx vitest run --reporter=verbose  # Detailed test output

# Environment
# Requires .env.local with VITE_POCKETBASE_URL and VITE_SUPABASE_* keys
```

## Architecture

### Content Management System

**Data Flow**: PocketBase → normalizeContent → defaultContent fallback → FormKit editors → PocketBase

- **PocketBase**: Backend storage at `http://127.0.0.1:8090` (dev) or `/pb` (production proxy)
- **Content Blocks**: 7 editable sections stored in `content_blocks` collection with `slug` field
- **defaultContent** (`lib/content/defaultContent.ts`): Fallback values for all content fields
- **normalizeContent** (`lib/content/normalizeContent.ts`): Merges PocketBase data with defaults, handles:
  - Null/undefined values → fallback to defaults
  - Image path normalization (bare filenames → `/images/`)
  - String arrays vs textarea conversion
  - Broken character arrays (legacy data cleanup)

### Admin System

**Location**: `/admin.html` route with dedicated layout (no header/footer)

**Editors** (`components/admin/editors/`):
- 7 FormKit-based editors: Contact, Interview, AboutUs, ProjectIntro, Positions, Timeline, SiteSettings
- Each uses `usePocketBaseContent(slug)` composable for load/save/reset
- **Critical**: `ContentEditor.vue` uses `:key="activeSlug"` to force component recreation on switch (prevents state pollution)

**usePocketBaseContent** (`lib/admin/usePocketBaseContent.ts`):
- Initial `loading: true` prevents FormKit rendering before data ready
- `load()`: Fetches from PocketBase, normalizes, updates state
- `save()`: Writes `state.fields` back to PocketBase
- `reset()`: Reverts to original loaded values

**Array Field Handling**:
- PocketBase stores: `string[]`
- FormKit textarea expects: `string` (newline-separated)
- Editors with arrays (Positions, ProjectIntro, Timeline) use `convertArraysToStrings()` in `onMounted`
- Must complete conversion BEFORE setting `formReady = true`

### FormKit Integration

**Setup** (`.vitepress/theme/index.ts`):
- Client-only dynamic import (avoids SSR issues)
- Chinese locale + admin-* class mappings
- Uses `list` type with `dynamic` prop (free version, not `repeater`)

**Styling**: `styles/formkit-admin.css` + `styles/global.css` admin-* classes

### VitePress Configuration

**Base Path**: `/hkjc/` (configured in `.vitepress/config.ts`)

**Environment Variables**:
- `VITE_POCKETBASE_URL`: Injected as `window.__POCKETBASE_URL__` and `import.meta.env.VITE_POCKETBASE_URL`
- Dev proxy: `/pb` → `http://127.0.0.1:8090`

**Admin Route Redirect**: Inline script redirects `/hkjc/admin` → `/hkjc/admin.html` (prevents hydration mismatch)

**SSR Considerations**:
- Admin page excluded from SSR (Layout.vue checks `relativePath === "admin.md"`)
- FormKit loaded client-only
- No global nav/footer on admin page

### Testing

**Framework**: Vitest + @testing-library/vue + happy-dom

**Setup** (`tests/setup/vitepress.ts`):
- Mocks VitePress composables (`useData`, `withBase`)
- Provides test Supabase credentials

**Test Structure**:
- `tests/components/`: Component rendering tests
- `tests/admin/`: Admin composables and editors
- `tests/lib/`: Utility functions
- `tests/content/`: Content normalization logic

**Key Test Pattern**:
```typescript
import { render } from "@testing-library/vue"
import { vi } from "vitest"

// Mock external dependencies
vi.mock("@/lib/pocketbase/client", () => ({
  getPocketBaseClient: vi.fn()
}))
```

## Common Patterns

### Adding New Content Field

1. Update `lib/content/defaultContent.ts` with default value
2. Update `lib/admin/contentTypes.ts` TypeScript interface
3. Add FormKit field to corresponding editor in `components/admin/editors/`
4. If array field: Add to `convertArraysToStrings()` and `handleSave()` conversion
5. If image field: Use file input + Base64 conversion pattern
6. Update `lib/content/normalizeContent.ts` if special handling needed
7. Add test coverage in `tests/content/normalizeContent.test.ts`

### Debugging FormKit Errors

**"Cannot set -1 to non array value: undefined"**:
- Check `defaultContent` has field defined as array
- Verify `normalizeContent` doesn't return null/undefined
- Ensure `loading: true` initial state in composable
- Confirm `:key` attribute on dynamic component
- Check `formReady` flag delays rendering until data ready

### Component State Management

**Critical Rule**: When using dynamic components with `component :is`, always add `:key` to force recreation:
```vue
<component :is="currentEditor" :key="activeSlug" />
```

Without key, Vue reuses component instances causing state pollution between editors.

## Deployment

**Production Path**: `/var/www/hkuya.org/hkjc/`

**Deployment Steps**:
1. `npm run docs:build` (generates `.vitepress/dist/`)
2. Backup: `sudo cp -r /var/www/hkuya.org/hkjc /var/www/hkuya.org/hkjc.bak-$(date +%Y%m%d%H%M%S)`
3. Deploy: `sudo cp -r .vitepress/dist/* /var/www/hkuya.org/hkjc/`
4. Verify: Check PocketBase (`:8090/api/health`), main site, admin page

**Important**: Always deploy built files, not just source code. Browser runs compiled JavaScript from `dist/`.

## Code Style

**Strict Rule**: No arrow functions. Use traditional `function` keyword everywhere:
```javascript
// ✅ Correct
function handleClick() { }
items.map(function(item) { return item.id })

// ❌ Wrong
const handleClick = () => { }
items.map(item => item.id)
```

**Rationale**: Project convention for consistency.
