# Formio Admin Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace JSON Forms in the admin with formio.js v5.2.2 (including Form Builder), store form schemas in Supabase with per-slug 7-version history, support rollback with confirmation, and export schemas to `lib/forms/formio/{slug}.json` while keeping content submission mapped to existing `content_blocks`.

**Architecture:** Admin UI will have two views: Builder (edit schema) and Editor (render schema + map submission). Schemas live in `formio_forms` with append-only `formio_forms_history` for the latest 7 per slug, versioned by timestamp. Export writes repo JSON and also inserts a history row.

**Tech Stack:** Vue 3 + VitePress, formio.js v5.2.2, Supabase JS, Tailwind, Vitest.

### Task 1: Add Supabase schema tables and history policy

**Files:**
- Create: `docs/plans/sql/formio_forms.sql`

**Step 1: Write the failing test**

```sql
-- Verify table does not exist (should fail before migration)
select * from formio_forms limit 1;
```

**Step 2: Run test to verify it fails**

Run: `psql <docs/plans/sql/formio_forms.sql`
Expected: FAIL with "relation \"formio_forms\" does not exist" before applying migration.

**Step 3: Write minimal implementation**

```sql
create table if not exists formio_forms (
  slug text primary key,
  schema jsonb not null,
  version text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists formio_forms_history (
  id bigserial primary key,
  slug text not null,
  schema jsonb not null,
  version text not null,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists formio_forms_history_slug_created
  on formio_forms_history (slug, created_at desc);
```

**Step 4: Run test to verify it passes**

Run: `psql <docs/plans/sql/formio_forms.sql`
Expected: PASS, tables created.

**Step 5: Commit**

```bash
git add docs/plans/sql/formio_forms.sql
git commit -m "docs: add formio schema sql"
```

### Task 2: Add formio.js dependency and base assets

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `styles/global.css`

**Step 1: Write the failing test**

```ts
// tests/formio/formioDependency.test.ts
import { describe, it, expect } from "vitest";

describe("formio dependency", function () {
  it("loads formiojs", function () {
    const module = require("formiojs");
    expect(module).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/formioDependency.test.ts`
Expected: FAIL with module not found.

**Step 3: Write minimal implementation**

- Add `formiojs@5.2.2` to dependencies.
- Import Formio CSS into `styles/global.css` (or a dedicated admin CSS).

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/formioDependency.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json package-lock.json styles/global.css tests/formio/formioDependency.test.ts
git commit -m "chore: add formiojs dependency"
```

### Task 3: Build schema store (Supabase) with per-slug history trim

**Files:**
- Create: `lib/formio/schemaStore.ts`
- Create: `lib/formio/schemaHistory.ts`
- Test: `tests/formio/schemaHistory.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { trimHistoryForSlug } from "../../lib/formio/schemaHistory";

describe("trimHistoryForSlug", function () {
  it("keeps latest 7 entries per slug", function () {
    const items = [] as Array<{ slug: string; created_at: string }>;
    for (let index = 0; index < 9; index += 1) {
      items.push({ slug: "positions", created_at: "2026-01-" + (index + 1) });
    }
    const trimmed = trimHistoryForSlug(items, "positions", 7);
    expect(trimmed.length).toBe(7);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/schemaHistory.test.ts`
Expected: FAIL with function not found.

**Step 3: Write minimal implementation**

```ts
export function trimHistoryForSlug(
  items: Array<{ slug: string; created_at: string }>,
  slug: string,
  keep: number
) {
  const filtered = items.filter(function (item) {
    return item.slug === slug;
  });
  const sorted = filtered.sort(function (a, b) {
    return a.created_at < b.created_at ? 1 : -1;
  });
  return sorted.slice(0, keep);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/schemaHistory.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add lib/formio/schemaHistory.ts tests/formio/schemaHistory.test.ts
 git commit -m "feat: add formio history trim helper"
```

### Task 4: Builder UI (schema edit, save, rollback with confirm)

**Files:**
- Create: `components/admin/FormioBuilder.vue`
- Modify: `components/admin/AdminPage.vue`
- Modify: `components/admin/ContentEditor.vue` (replace with Formio editor entry point)
- Create: `lib/formio/schemaStore.ts`

**Step 1: Write the failing test**

```ts
// tests/components/FormioBuilder.test.ts
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FormioBuilder from "../../components/admin/FormioBuilder.vue";

describe("FormioBuilder", function () {
  it("renders builder shell", function () {
    const wrapper = mount(FormioBuilder);
    expect(wrapper.text()).toContain("Schema Builder");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/FormioBuilder.test.ts`
Expected: FAIL with component not found.

**Step 3: Write minimal implementation**

- Create a client-only builder component that:
  - Loads schema by slug from Supabase.
  - Saves schema with version = `String(Date.now())`.
  - Writes history entry and trims to latest 7 for the slug.
  - Adds rollback list (latest 7) and confirmation dialog before overwrite.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/FormioBuilder.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/admin/FormioBuilder.vue components/admin/AdminPage.vue components/admin/ContentEditor.vue lib/formio/schemaStore.ts tests/components/FormioBuilder.test.ts
 git commit -m "feat: add formio schema builder"
```

### Task 5: Form renderer + submission mapping to content_blocks

**Files:**
- Create: `components/admin/FormioEditor.vue`
- Create: `lib/formio/mapSubmission.ts`
- Test: `tests/formio/mapSubmission.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { mapSubmissionToContent } from "../../lib/formio/mapSubmission";

describe("mapSubmissionToContent", function () {
  it("maps multiline textarea to string array", function () {
    const result = mapSubmissionToContent({ duties: "a\n\n b" });
    expect(result.duties).toEqual(["a", "b"]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/mapSubmission.test.ts`
Expected: FAIL with function not found.

**Step 3: Write minimal implementation**

```ts
export function mapSubmissionToContent(data: Record<string, unknown>) {
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (typeof value === "string" && value.indexOf("\n") !== -1) {
      const lines = value.split(/\r?\n/);
      const cleaned: string[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          cleaned.push(trimmed);
        }
      }
      output[key] = cleaned;
    } else {
      output[key] = value;
    }
  }
  return output;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/mapSubmission.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/admin/FormioEditor.vue lib/formio/mapSubmission.ts tests/formio/mapSubmission.test.ts
 git commit -m "feat: add formio submission mapper"
```

### Task 6: Export schema to repo + history backup

**Files:**
- Create: `scripts/export-formio-schema.ts`
- Modify: `package.json`
- Test: `tests/formio/exportSchema.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { buildExportPath } from "../../scripts/export-formio-schema";

describe("buildExportPath", function () {
  it("creates repo path for slug", function () {
    expect(buildExportPath("positions")).toContain("lib/forms/formio/positions.json");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/exportSchema.test.ts`
Expected: FAIL with function not found.

**Step 3: Write minimal implementation**

```ts
export function buildExportPath(slug: string) {
  return "lib/forms/formio/" + slug + ".json";
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/exportSchema.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add scripts/export-formio-schema.ts package.json tests/formio/exportSchema.test.ts
 git commit -m "feat: add formio schema export script"
```

### Task 7: Docs + verification

**Files:**
- Modify: `docs/memory.md`
- Create: `docs/plans/2026-01-31-formio-admin-migration.md`

**Step 1: Write the failing test**

```txt
Check that /admin.html can open Builder and Editor views and save schema.
```

**Step 2: Run test to verify it fails**

Run: `npm run docs:dev` then open `/admin.html`
Expected: Builder missing.

**Step 3: Write minimal implementation**

- Update `docs/memory.md` with Formio admin notes.
- Keep this plan file in repo.

**Step 4: Run test to verify it passes**

Run: `npm run docs:dev` then open `/admin.html`
Expected: Builder, rollback, export, and editor all visible and functional.

**Step 5: Commit**

```bash
git add docs/memory.md docs/plans/2026-01-31-formio-admin-migration.md
 git commit -m "docs: add formio admin migration plan"
```
