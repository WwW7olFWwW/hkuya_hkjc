# Site Settings Logo + Glass Bar Design

**Goal:** Add a `site_settings` content block so admin can control logo height, and give header/footer a subtle frosted glass effect.

**Architecture:** Introduce a new `site_settings` entry in `defaultContent` with a numeric `logoHeight` field. `normalizeContent` will keep using `defaultContent` as fallback. The admin Form.io schemas are generated from `defaultContent`, so the new slug appears automatically and can be saved to `content_blocks`. `NavBar` reads `contentState.site_settings.fields.logoHeight` and applies it to the logo image height with safe fallback. Header and footer share a new `glass-bar` style that overlays a transparent gradient and blur.

**Tech Stack:** Vue 3 (VitePress), Form.io, Tailwind CSS + global CSS, Vitest, @testing-library/vue.

## Data Model

- New slug: `site_settings`
- Fields:
  - `logoHeight` (number, px)

Default values:
- `logoHeight: 48`

## UI / UX

- Admin:
  - New `site_settings` entry appears in the content dropdown.
  - Form.io editor shows a numeric input for `logoHeight`.
- Frontend:
  - `NavBar` logo height uses `logoHeight` (px), with `max-height` capped by `--site-header-height`.
  - Header + Footer receive a light frosted glass style.

## Styling

Add a `glass-bar` class in `styles/global.css`:
- Semi-transparent gradient background
- `backdrop-filter: blur(...)`
- Subtle shadow to keep text readable

Apply `glass-bar` to both `NavBar` header and `FooterBar`.

## Error Handling

- If `logoHeight` is missing/invalid, fall back to `48`.
- `normalizeContent` continues to merge defaults to keep `site_settings` present.

## Tests

- `tests/content/normalizeContent.test.ts`: ensures missing `site_settings` is filled from defaults.
- `tests/lib/contentEditorSchemas.test.ts`: ensures `site_settings.logoHeight` schema is a number.
- `tests/formio/schemaGenerator.test.ts`: ensures Form.io schema includes `logoHeight` number component.
- `tests/components/NavBar.test.ts`: ensures logo height is applied in rendered markup.
