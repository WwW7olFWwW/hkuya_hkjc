# JSON Forms Admin Fields Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 讓 JSON Forms 陣列項目顯示語意化標籤（不再是 0/1/2），並讓 About Us / Contact 的圖片、文字、email、tel 透過後台可編輯。

**Architecture:** 使用 JSON Forms Vanilla 內建 `childLabelProp` 取代索引標籤；About Us/Contact 欄位改由 `content.fields` 提供，並在 `defaultContent` 補齊欄位作為 fallback。

**Tech Stack:** Vue 3, VitePress, JSON Forms Vue Vanilla, Vitest, @testing-library/vue.

---

### Task 1: 補齊 JSON Forms Schema/UiSchema（含 childLabelProp）

**Files:**
- Modify: `lib/content/contentEditorSchemas.ts`
- Modify: `tests/lib/contentEditorSchemas.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest"
import { getBlockSchema, getBlockUiSchema } from "../../lib/content/contentEditorSchemas"

describe("contentEditorSchemas", function () {
  it("builds about_us schema with organizations array", function () {
    const schema = getBlockSchema("about_us")
    expect(schema.properties.organizations.type).toBe("array")
    expect(schema.properties.organizations.items.type).toBe("object")
  })

  it("builds contact schema with email and tel", function () {
    const schema = getBlockSchema("contact")
    expect(schema.properties.email.type).toBe("string")
    expect(schema.properties.tel.type).toBe("string")
  })

  it("adds childLabelProp for timeline steps", function () {
    const uiSchema = getBlockUiSchema("timeline")
    const steps = uiSchema.elements[2]
    expect(steps.options.childLabelProp).toBe("date")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: FAIL（schema/uischema 未包含 about_us/contact 與 childLabelProp）

**Step 3: Write minimal implementation**

```typescript
function buildAboutUsSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        organizations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string" },
              name: { type: "string" },
              logo: { type: "string" },
              url: { type: "string" }
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
          scope: "#/properties/organizations",
          options: {
            childLabelProp: "role",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/role" },
                { type: "Control", scope: "#/properties/name" },
                { type: "Control", scope: "#/properties/logo" },
                { type: "Control", scope: "#/properties/url" }
              ]
            }
          }
        }
      ]
    }
  }
}

function buildContactSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        titleEn: { type: "string" },
        email: { type: "string" },
        tel: { type: "string" }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        { type: "Control", scope: "#/properties/email" },
        { type: "Control", scope: "#/properties/tel" }
      ]
    }
  }
}

// timeline/positions 的 array control options 加 childLabelProp
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/content/contentEditorSchemas.ts tests/lib/contentEditorSchemas.test.ts
git commit -m "feat: add admin schemas for about/contact and array labels"
```

---

### Task 2: AboutUs/Contact 改為可編輯欄位 + 更新預設內容

**Files:**
- Modify: `lib/content/defaultContent.ts`
- Modify: `components/sections/AboutUsSection.vue`
- Modify: `components/sections/ContactSection.vue`
- Modify: `tests/components/AboutUsSection.test.ts`
- Modify: `tests/components/ContactSection.test.ts`

**Step 1: Write the failing tests**

```typescript
// tests/components/AboutUsSection.test.ts
function buildContent() {
  return {
    fields: {
      titleZh: "關於我們測試",
      titleEn: "About Us Test",
      organizations: [
        { role: "主辦單位", name: "測試單位", logo: "/images/logo.png", url: "https://example.com" }
      ]
    }
  }
}

it("renders organizations from content", function () {
  render(AboutUsSection, { props: { content: buildContent() } })
  expect(screen.getByText("主辦單位")).toBeTruthy()
  expect(screen.getByText("測試單位")).toBeTruthy()
})
```

```typescript
// tests/components/ContactSection.test.ts
function buildContent() {
  return {
    fields: {
      titleZh: "聯絡我們測試",
      titleEn: "Contact Test",
      email: "test@example.com",
      tel: "1234 5678"
    }
  }
}

it("renders email and tel from content", function () {
  render(ContactSection, { props: { content: buildContent() } })
  expect(screen.getByText(/test@example.com/)).toBeTruthy()
  expect(screen.getByText(/1234 5678/)).toBeTruthy()
})
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/components/AboutUsSection.test.ts tests/components/ContactSection.test.ts`
Expected: FAIL（尚未使用新欄位）

**Step 3: Write minimal implementation**

```typescript
// lib/content/defaultContent.ts
about_us: {
  fields: {
    titleZh: "關於我們",
    titleEn: "About Us",
    organizations: [
      { role: "承辦單位 Organizer", name: "", logo: "/images/logo.png", url: "https://www.hkuya.org.hk/" },
      { role: "贊助單位 Sponsor", name: "", logo: "/images/hkjc_140_bi_tc_logo_cmyk_coated_full_colour_ol.png", url: "https://www.hkjc.com/" },
      { role: "支持單位 Support Unit", name: "中央政府駐港聯絡辦青年工作部", logo: "", url: "" }
    ]
  }
},
contact: {
  fields: {
    titleZh: "聯絡方式",
    titleEn: "Contact",
    email: "mail@hkuya.org.hk",
    tel: "2598 9385"
  }
}
```

```vue
<!-- components/sections/AboutUsSection.vue -->
const props = defineProps<...>()
function getOrganizations() {
  return props.content.fields.organizations || []
}
```

```vue
<!-- components/sections/ContactSection.vue -->
function buildMailto(email: string) {
  return "mailto:" + email
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/components/AboutUsSection.test.ts tests/components/ContactSection.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/content/defaultContent.ts components/sections/AboutUsSection.vue components/sections/ContactSection.vue tests/components/AboutUsSection.test.ts tests/components/ContactSection.test.ts
git commit -m "feat: make about/contact editable"
```

---

### Task 3: 記憶文件更新（可選）

**Files:**
- Modify: `docs/memory.md`

**Step 1: Update documentation**

新增一條：About Us/Contact 已改為可在後台編輯（organization/email/tel）。

**Step 2: Commit**

```bash
git add docs/memory.md
git commit -m "docs: note editable about/contact"
```

---

Plan complete and saved to `docs/plans/2026-01-30-json-forms-admin-fields-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
