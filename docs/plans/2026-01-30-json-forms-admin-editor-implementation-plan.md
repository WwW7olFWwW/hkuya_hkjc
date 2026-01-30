# JSON Forms Admin Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將所有內容區塊改為 JSON Forms 可視化編輯，支援巢狀陣列的新增/刪除，並維持 Supabase `content.fields.*` 作為來源。

**Architecture:** 以 JSON Forms Vue Vanilla 作為渲染核心，透過「每個區塊的 JSON Schema + UI Schema」驅動編輯器；資料從 `defaultContent` 作為 fallback 合併 Supabase，避免缺欄位導致不可編輯。Timeline/Positions 使用明確的 array `detail` UI schema 以確保可新增/刪除。

**Tech Stack:** Vue 3, VitePress, @jsonforms/core, @jsonforms/vue, @jsonforms/vue-vanilla, Vitest, @testing-library/vue.

---

### Task 1: 建立內容區塊 Schema 與 UI Schema 模組

**Files:**
- Create: `lib/content/contentEditorSchemas.ts`
- Test: `tests/lib/contentEditorSchemas.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest"
import { getBlockSchema, getBlockUiSchema } from "../../lib/content/contentEditorSchemas"

describe("contentEditorSchemas", function () {
  it("builds timeline schema with array items", function () {
    const schema = getBlockSchema("timeline")
    expect(schema.type).toBe("object")
    expect(schema.properties).toBeTruthy()
    expect(schema.properties.steps.type).toBe("array")
    expect(schema.properties.steps.items.type).toBe("object")
    expect(schema.properties.steps.items.properties.date.type).toBe("string")
  })

  it("builds positions schema with nested arrays", function () {
    const schema = getBlockSchema("positions")
    expect(schema.properties.groups.type).toBe("array")
    expect(schema.properties.groups.items.properties.positions.type).toBe("array")
    expect(schema.properties.groups.items.properties.positions.items.properties.companyLines.type).toBe("array")
  })

  it("builds timeline ui schema with array detail", function () {
    const uiSchema = getBlockUiSchema("timeline")
    expect(uiSchema.type).toBe("VerticalLayout")
    expect(uiSchema.elements[2].type).toBe("Control")
    expect(uiSchema.elements[2].options.detail.type).toBe("VerticalLayout")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: FAIL (module not found / functions undefined)

**Step 3: Write minimal implementation**

```typescript
import type { JsonSchema, UISchemaElement } from "@jsonforms/core"
import { defaultContent } from "./defaultContent"

type SchemaEntry = {
  schema: JsonSchema
  uischema: UISchemaElement
}

type BlockSchemas = Record<string, SchemaEntry>

function buildStringArraySchema() {
  return {
    type: "array",
    items: { type: "string" }
  }
}

function buildTimelineSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              content: buildStringArraySchema(),
              highlight: { type: "boolean" }
            }
          }
        },
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              icon: { type: "string" },
              title: { type: "string" },
              content: buildStringArraySchema()
            }
          }
        }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        {
          type: "Control",
          scope: "#/properties/steps",
          options: {
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/date" },
                { type: "Control", scope: "#/properties/content" },
                { type: "Control", scope: "#/properties/highlight" }
              ]
            }
          }
        },
        {
          type: "Control",
          scope: "#/properties/notes",
          options: {
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/icon" },
                { type: "Control", scope: "#/properties/title" },
                { type: "Control", scope: "#/properties/content" }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildPositionsSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              location: { type: "string" },
              description: { type: "string" },
              positions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    companyLines: buildStringArraySchema(),
                    roleLines: buildStringArraySchema(),
                    requirements: buildStringArraySchema(),
                    duties: buildStringArraySchema()
                  }
                }
              }
            }
          }
        }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        {
          type: "Control",
          scope: "#/properties/groups",
          options: {
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/location" },
                { type: "Control", scope: "#/properties/description" },
                {
                  type: "Control",
                  scope: "#/properties/positions",
                  options: {
                    detail: {
                      type: "VerticalLayout",
                      elements: [
                        { type: "Control", scope: "#/properties/companyLines" },
                        { type: "Control", scope: "#/properties/roleLines" },
                        { type: "Control", scope: "#/properties/requirements" },
                        { type: "Control", scope: "#/properties/duties" }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildGenericSchema(slug: string): SchemaEntry {
  const block = defaultContent[slug as keyof typeof defaultContent]
  const properties: Record<string, JsonSchema> = {}
  const elements: UISchemaElement[] = []

  for (const key of Object.keys(block.fields)) {
    const value = block.fields[key as keyof typeof block.fields]
    if (Array.isArray(value)) {
      properties[key] = buildStringArraySchema()
    } else {
      properties[key] = { type: "string" }
    }
    elements.push({ type: "Control", scope: "#/properties/" + key })
  }

  return {
    schema: {
      type: "object",
      properties: properties
    },
    uischema: {
      type: "VerticalLayout",
      elements: elements
    }
  }
}

const blockSchemas: BlockSchemas = {
  timeline: buildTimelineSchema(),
  positions: buildPositionsSchema()
}

export function getBlockSchema(slug: string) {
  if (blockSchemas[slug]) {
    return blockSchemas[slug].schema
  }
  return buildGenericSchema(slug).schema
}

export function getBlockUiSchema(slug: string) {
  if (blockSchemas[slug]) {
    return blockSchemas[slug].uischema
  }
  return buildGenericSchema(slug).uischema
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/content/contentEditorSchemas.ts tests/lib/contentEditorSchemas.test.ts
git commit -m "feat: add json forms schemas for content blocks"
```

---

### Task 2: 安裝 JSON Forms 依賴與引入樣式

**Files:**
- Modify: `package.json`
- Modify: `styles/global.css`

**Step 1: Write the failing test**

```typescript
import { render, screen } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import ContentEditor from "../../components/admin/ContentEditor.vue"

const select = vi.hoisted(function () {
  return vi.fn()
})
const upsert = vi.hoisted(function () {
  return vi.fn()
})
const from = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/supabase/client", function () {
  return {
    supabase: {
      from: from
    }
  }
})

vi.mock("@jsonforms/vue", function () {
  return {
    JsonForms: {
      name: "JsonForms",
      props: ["data", "schema", "uischema", "renderers"],
      template: "<div data-testid=\"jsonforms-stub\"></div>"
    }
  }
})

beforeEach(function () {
  select.mockReset()
  upsert.mockReset()
  from.mockReset()

  from.mockImplementation(function () {
    return {
      select: select,
      upsert: upsert
    }
  })

  select.mockResolvedValue({
    data: [
      {
        slug: "project_intro",
        fields: { titleZh: "更新標題" }
      }
    ]
  })

  upsert.mockResolvedValue({ error: null })
})

afterEach(function () {
  document.body.innerHTML = ""
})

describe("ContentEditor JSON Forms", function () {
  it("renders json forms for blocks", async function () {
    render(ContentEditor)
    expect(await screen.findByText("project_intro")).toBeTruthy()
    expect(await screen.findByTestId("jsonforms-stub")).toBeTruthy()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: FAIL (ContentEditor 尚未使用 JsonForms)

**Step 3: Write minimal implementation**

- 安裝依賴（依官方建議）并新增樣式 import。

```bash
npm i --save @jsonforms/core @jsonforms/vue @jsonforms/vue-vanilla
```

```css
@import "@jsonforms/vue-vanilla/vanilla.css";
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: FAIL（仍未修改 ContentEditor）

**Step 5: Commit**

```bash
git add package.json styles/global.css package-lock.json
git commit -m "chore: add json forms dependencies"
```

---

### Task 3: 用 JSON Forms 替換 ContentEditor 的 textarea

**Files:**
- Modify: `components/admin/ContentEditor.vue`
- Modify: `tests/components/ContentEditor.test.ts`
- Modify: `lib/content/contentEditorSchemas.ts`

**Step 1: Write the failing test**

```typescript
import { render, screen, fireEvent } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import ContentEditor from "../../components/admin/ContentEditor.vue"

const select = vi.hoisted(function () {
  return vi.fn()
})
const upsert = vi.hoisted(function () {
  return vi.fn()
})
const from = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/supabase/client", function () {
  return {
    supabase: {
      from: from
    }
  }
})

vi.mock("@jsonforms/vue", function () {
  return {
    JsonForms: {
      name: "JsonForms",
      props: ["data", "schema", "uischema", "renderers"],
      emits: ["change"],
      template: "<button data-testid=\"jsonforms-change\" @click=\"$emit('change', { data: { titleZh: '新標題' } })\">change</button>"
    }
  }
})

beforeEach(function () {
  select.mockReset()
  upsert.mockReset()
  from.mockReset()

  from.mockImplementation(function () {
    return {
      select: select,
      upsert: upsert
    }
  })

  select.mockResolvedValue({
    data: [
      {
        slug: "project_intro",
        fields: { titleZh: "更新標題" }
      }
    ]
  })

  upsert.mockResolvedValue({ error: null })
})

afterEach(function () {
  document.body.innerHTML = ""
})

describe("ContentEditor JSON Forms", function () {
  it("saves updated data from JsonForms", async function () {
    render(ContentEditor)

    await screen.findByText("project_intro")
    await fireEvent.click(await screen.findByTestId("jsonforms-change"))
    await fireEvent.click(screen.getAllByText("儲存")[0])

    expect(upsert).toHaveBeenCalled()
    const args = upsert.mock.calls[0][0]
    expect(args.fields.titleZh).toBe("新標題")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: FAIL（ContentEditor 尚未處理 JsonForms change）

**Step 3: Write minimal implementation**

```vue
<script setup lang="ts">
import { ref } from "vue"
import { JsonForms } from "@jsonforms/vue"
import { vanillaRenderers } from "@jsonforms/vue-vanilla"
import { supabase } from "@/lib/supabase/client"
import { defaultContent } from "@/lib/content/defaultContent"
import { getBlockSchema, getBlockUiSchema } from "@/lib/content/contentEditorSchemas"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

type ChangeEvent = {
  data: Record<string, unknown>
}

const renderers = Object.freeze(vanillaRenderers)
const content = ref(defaultContent as ContentMap)
const status = ref("")

function cloneContent() {
  return JSON.parse(JSON.stringify(defaultContent)) as ContentMap
}

function mergeContent(slug: string, fields: Record<string, unknown>) {
  if (content.value[slug]) {
    content.value[slug] = {
      fields: {
        ...content.value[slug].fields,
        ...fields
      }
    }
  } else {
    content.value[slug] = { fields: fields }
  }
}

function handleChange(slug: string, event: ChangeEvent) {
  content.value[slug] = { fields: event.data }
}

async function loadContent() {
  status.value = ""
  const response = await supabase.from("content_blocks").select("slug, fields")
  if (response.error) {
    status.value = response.error.message
    return
  }

  const records = (response.data || []) as Array<{ slug: string; fields: Record<string, unknown> }>
  content.value = cloneContent()

  for (const record of records) {
    mergeContent(record.slug, record.fields)
  }
}

async function saveBlock(slug: string) {
  status.value = ""
  const payload = content.value[slug]

  const response = await supabase
    .from("content_blocks")
    .upsert({ slug: slug, fields: payload.fields }, { onConflict: "slug" })

  if (response.error) {
    status.value = response.error.message
    return
  }

  status.value = "已儲存：" + slug
}

loadContent()
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">內容設定</h2>
      <p class="text-sm text-slate-500">修改後將立即更新前端。</p>
      <p v-if="status" class="text-sm text-slate-600">{{ status }}</p>
    </div>

    <div v-for="(block, slug) in content" :key="slug" class="section-card p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ slug }}</h3>
        <button class="btn-primary" type="button" @click="saveBlock(String(slug))">儲存</button>
      </div>
      <JsonForms
        :data="block.fields"
        :schema="getBlockSchema(String(slug))"
        :uischema="getBlockUiSchema(String(slug))"
        :renderers="renderers"
        @change="handleChange(String(slug), $event)"
      />
    </div>
  </div>
</template>
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add components/admin/ContentEditor.vue tests/components/ContentEditor.test.ts lib/content/contentEditorSchemas.ts
git commit -m "feat: switch content editor to json forms"
```

---

### Task 4: 補齊全區塊可編輯性與資料合併測試

**Files:**
- Modify: `tests/components/ContentEditor.test.ts`
- Modify: `lib/content/contentEditorSchemas.ts`

**Step 1: Write the failing test**

```typescript
it("merges default fields for timeline", async function () {
  select.mockResolvedValue({
    data: [
      {
        slug: "timeline",
        fields: { titleZh: "更新標題" }
      }
    ]
  })

  render(ContentEditor)

  await screen.findByText("timeline")
  await fireEvent.click(screen.getAllByText("儲存")[0])

  const args = upsert.mock.calls[0][0]
  expect(args.fields.titleZh).toBe("更新標題")
  expect(Array.isArray(args.fields.steps)).toBe(true)
  expect(Array.isArray(args.fields.notes)).toBe(true)
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: FAIL（尚未確保 merge 後保存完整欄位）

**Step 3: Write minimal implementation**

- 確保 `loadContent()` 在 merge 後不覆蓋掉 fallback 欄位。
- 如有需要，補強 `getBlockSchema` 的 generic 分支，避免未知欄位導致空 schema。

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/ContentEditor.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/components/ContentEditor.test.ts lib/content/contentEditorSchemas.ts components/admin/ContentEditor.vue
git commit -m "fix: keep default fields when saving content"
```

---

### Task 5: 更新記憶文件與驗證

**Files:**
- Modify: `docs/memory.md`

**Step 1: Write the failing test**

（此任務為文件更新，無測試）

**Step 2: Update documentation**

在 `docs/memory.md` 新增：
- 已改用 JSON Forms 管理後台
- 依賴 `@jsonforms/core`、`@jsonforms/vue`、`@jsonforms/vue-vanilla`
- 編輯器支援巢狀陣列新增/刪除（timeline/positions）

**Step 3: Commit**

```bash
git add docs/memory.md
git commit -m "docs: record json forms admin editor"
```

---

## Manual Verification Checklist

1. `npm run docs:dev` 開啟 `/admin.html`。
2. timeline/positions 看到可新增/刪除的陣列項目。
3. 更新後儲存成功並刷新前台，所有 section 內容更新。

---

Plan complete and saved to `docs/plans/2026-01-30-json-forms-admin-editor-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
