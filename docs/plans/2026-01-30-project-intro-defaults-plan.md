# Project Intro Defaults & Schema Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修正 ProjectIntro runtime 錯誤（posterUrl 為 undefined），並補齊可編輯欄位與 JSON Forms schema，確保後台可視化編輯。

**Architecture:** 以 `defaultContent` 作為 fallback 補齊 project_intro 必要欄位；更新 JSON Forms schema/uischema 讓 infoCards/eligibility/fee 等結構可編輯；增加 normalizeContent 測試防止回歸。

**Tech Stack:** Vue 3, VitePress, JSON Forms Vue Vanilla, Vitest, @testing-library/vue.

---

### Task 1: 為 normalizeContent 增加 ProjectIntro fallback 測試

**Files:**
- Modify: `tests/content/normalizeContent.test.ts`

**Step 1: Write the failing test**

```typescript
it("fills project_intro posterUrl and infoCards from defaults", function () {
  const input = {
    project_intro: { fields: { titleZh: "更新標題" } }
  }

  const output = normalizeContent(input)

  expect(output.project_intro.fields.titleZh).toBe("更新標題")
  expect(typeof output.project_intro.fields.posterUrl).toBe("string")
  expect(Array.isArray(output.project_intro.fields.infoCards)).toBe(true)
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/content/normalizeContent.test.ts`
Expected: FAIL（posterUrl/infoCards 尚未存在）

---

### Task 2: 補齊 defaultContent.project_intro 欄位

**Files:**
- Modify: `lib/content/defaultContent.ts`
- Test: `tests/content/normalizeContent.test.ts`

**Step 1: Write minimal implementation**

```typescript
project_intro: {
  fields: {
    titleZh: "港澳青年內地實習計劃",
    subtitleZh: "暑期實習團",
    titleEn: "HKUYA Internship Program",
    subtitleEn: "Summer Internship",
    descriptionZh: "...",
    descriptionEn: "...",
    posterUrl: "/images/poster.webp",
    infoCards: [
      { titleZh: "項目類型", titleEn: "Program", contentZh: "內地實習", contentEn: "Mainland Internship" },
      { titleZh: "名額", titleEn: "Quota", contentZh: "約 100 名", contentEn: "Around 100" },
      { titleZh: "地點", titleEn: "Location", contentZh: "內地", contentEn: "Mainland China" },
      { titleZh: "時期", titleEn: "Period", contentZh: "約四星期", contentEn: "Around 4 weeks" }
    ],
    eligibilityZh: ["..."],
    eligibilityEn: ["..."],
    feeZh: ["..."],
    feeEn: ["..."]
  }
}
```

**Step 2: Run test to verify it passes**

Run: `npm run test -- tests/content/normalizeContent.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add lib/content/defaultContent.ts tests/content/normalizeContent.test.ts
git commit -m "fix: add project intro defaults"
```

---

### Task 3: 補齊 ProjectIntro JSON Forms schema/uischema

**Files:**
- Modify: `lib/content/contentEditorSchemas.ts`
- Modify: `tests/lib/contentEditorSchemas.test.ts`

**Step 1: Write the failing test**

```typescript
it("builds project_intro schema with infoCards array", function () {
  const schema = getBlockSchema("project_intro")
  expect(schema.properties.infoCards.type).toBe("array")
  expect(schema.properties.infoCards.items.type).toBe("object")
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: FAIL（尚未定義 project_intro schema）

**Step 3: Write minimal implementation**

```typescript
function buildProjectIntroSchema(): SchemaEntry {
  return {
    schema: {
      type: "object",
      properties: {
        titleZh: { type: "string" },
        subtitleZh: { type: "string" },
        titleEn: { type: "string" },
        subtitleEn: { type: "string" },
        descriptionZh: { type: "string" },
        descriptionEn: { type: "string" },
        posterUrl: { type: "string" },
        infoCards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              titleZh: { type: "string" },
              titleEn: { type: "string" },
              contentZh: { type: "string" },
              contentEn: { type: "string" }
            }
          }
        },
        eligibilityZh: { type: "array", items: { type: "string" } },
        eligibilityEn: { type: "array", items: { type: "string" } },
        feeZh: { type: "array", items: { type: "string" } },
        feeEn: { type: "array", items: { type: "string" } }
      }
    },
    uischema: {
      type: "VerticalLayout",
      elements: [
        { type: "Control", scope: "#/properties/titleZh" },
        { type: "Control", scope: "#/properties/subtitleZh" },
        { type: "Control", scope: "#/properties/titleEn" },
        { type: "Control", scope: "#/properties/subtitleEn" },
        { type: "Control", scope: "#/properties/descriptionZh" },
        { type: "Control", scope: "#/properties/descriptionEn" },
        { type: "Control", scope: "#/properties/posterUrl" },
        {
          type: "Control",
          scope: "#/properties/infoCards",
          options: {
            childLabelProp: "titleZh",
            detail: {
              type: "VerticalLayout",
              elements: [
                { type: "Control", scope: "#/properties/titleZh" },
                { type: "Control", scope: "#/properties/titleEn" },
                { type: "Control", scope: "#/properties/contentZh" },
                { type: "Control", scope: "#/properties/contentEn" }
              ]
            }
          }
        },
        { type: "Control", scope: "#/properties/eligibilityZh" },
        { type: "Control", scope: "#/properties/eligibilityEn" },
        { type: "Control", scope: "#/properties/feeZh" },
        { type: "Control", scope: "#/properties/feeEn" }
      ]
    }
  }
}

// blockSchemas 加上 project_intro
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/lib/contentEditorSchemas.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/content/contentEditorSchemas.ts tests/lib/contentEditorSchemas.test.ts
git commit -m "feat: add project intro admin schema"
```

---

Plan complete and saved to `docs/plans/2026-01-30-project-intro-defaults-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
