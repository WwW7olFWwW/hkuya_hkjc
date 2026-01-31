# Formio Admin Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace JSON Forms in the admin with @formio/js v5.2.2 (including Form Builder), store form schemas in Supabase with per-slug 7-version history, support rollback with a double-confirm dialog, and export schemas to `lib/forms/formio/{slug}.json` while keeping content submission mapped to existing `content_blocks`.

**Architecture:** Admin UI will have two views: Builder (edit schema) and Editor (render schema + map submission). Schemas live in `formio_forms` with append-only `formio_forms_history` for the latest 7 per slug, versioned by timestamp. Export writes repo JSON and also inserts a history row; history is written even if repo export fails.

**Tech Stack:** Vue 3 + VitePress, @formio/js v5.2.2, Supabase JS, Tailwind, Vitest.

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
  it("loads @formio/js", function () {
    const module = require("@formio/js");
    expect(module).toBeTruthy();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/formioDependency.test.ts`
Expected: FAIL with module not found.

**Step 3: Write minimal implementation**

- Add `@formio/js@5.2.2` to dependencies.
- Import Formio CSS into `styles/global.css`.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/formioDependency.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json package-lock.json styles/global.css tests/formio/formioDependency.test.ts
git commit -m "chore: add formio js dependency"
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
 git commit -m "feat: add formio schema history helper"
```

### Task 4: Builder UI (schema edit, save, rollback with confirm)

**Files:**
- Create: `components/admin/FormioBuilder.vue`
- Modify: `components/admin/AdminPage.vue`
- Modify: `components/admin/ContentEditor.vue` (replace with Formio editor entry point)
- Modify: `lib/formio/schemaStore.ts`

**Step 1: Write the failing test**

```ts
// tests/components/FormioBuilder.test.ts
import { render, screen } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import FormioBuilder from "../../components/admin/FormioBuilder.vue";

describe("FormioBuilder", function () {
  it("renders builder shell", async function () {
    render(FormioBuilder, { props: { slug: "project_intro" } });
    expect(await screen.findByText("Schema Builder")).toBeTruthy();
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
  - Adds rollback list (latest 7) and double-confirm dialog before overwrite.

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
- Test: `tests/components/FormioEditor.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { mapSubmissionToContent } from "../../lib/formio/mapSubmission";

describe("mapSubmissionToContent", function () {
  it("converts multiline string to array when template is string array", function () {
    const result = mapSubmissionToContent({ duties: "a\n\n b" }, { duties: [""] });
    expect(result.duties).toEqual(["a", "b"]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/formio/mapSubmission.test.ts`
Expected: FAIL with function not found.

**Step 3: Write minimal implementation**

```ts
export function mapSubmissionToContent(
  data: Record<string, unknown>,
  template?: Record<string, unknown>
) {
  // Use template (from defaultContent) to decide which fields should split into arrays.
  // Multiline strings only become arrays when the template field is a string[].
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/formio/mapSubmission.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/admin/FormioEditor.vue lib/formio/mapSubmission.ts tests/formio/mapSubmission.test.ts tests/components/FormioEditor.test.ts
 git commit -m "feat: add formio editor mapping"
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
git add scripts/export-formio-schema.ts package.json package-lock.json tests/formio/exportSchema.test.ts
git commit -m "feat: add formio schema export script"
```

**Notes:**
- Export flow must write a history record first, then attempt repo export.
- Repo export failure must not delete or skip the history entry.

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
Expected: Builder、rollback、editor 可操作；匯出透過 CLI `npm run formio:export -- --slug <slug>` 可產生 `lib/forms/formio/{slug}.json`。

**Step 5: Commit**

```bash
git add docs/memory.md docs/plans/2026-01-31-formio-admin-migration.md
 git commit -m "docs: add formio admin migration plan"
```
