# Admin 重構實施計劃：移除 FormKit，改用原生 Vue 3

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 移除 FormKit 依賴，用 3 個自建原生 Vue 3 組件重寫全部 7 個 admin 編輯器，從根本消除 `Cannot set -1 to non array value: undefined` 錯誤。

**Architecture:** 創建 TextareaArray（string[] ↔ textarea 轉換）、AdminField（統一 label+input 包裝）、AdminRepeater（動態陣列管理）3 個通用組件。7 個編輯器直接用原生 v-model 綁定 PocketBase 數據，不再需要 formReady / convertArraysToStrings / handleSave 深拷貝等 hack。

**Tech Stack:** Vue 3 Composition API, TypeScript, Tailwind CSS, Vitest

**Design Doc:** `docs/plans/2026-03-04-admin-rewrite-design.md`

---

### Task 1: TextareaArray 組件

**Files:**
- Create: `components/admin/fields/TextareaArray.vue`
- Create: `tests/admin/fields/TextareaArray.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/admin/fields/TextareaArray.test.ts
import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import TextareaArray from "../../../components/admin/fields/TextareaArray.vue"

describe("TextareaArray", function () {
  it("renders string array as newline-separated text", function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: ["line1", "line2", "line3"],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    expect(textarea.element.value).toBe("line1\nline2\nline3")
  })

  it("emits string array on input", async function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: [],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    await textarea.setValue("aaa\nbbb\nccc")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    const lastEmit = emitted[emitted.length - 1][0]
    expect(lastEmit).toEqual(["aaa", "bbb", "ccc"])
  })

  it("filters empty lines on emit", async function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: [],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    await textarea.setValue("aaa\n\nbbb\n")
    const emitted = wrapper.emitted("update:modelValue")
    const lastEmit = emitted[emitted.length - 1][0]
    expect(lastEmit).toEqual(["aaa", "bbb"])
  })

  it("renders label", function () {
    const wrapper = mount(TextareaArray, {
      props: { modelValue: [], label: "公司名稱" }
    })
    expect(wrapper.find("label").text()).toBe("公司名稱")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin/fields/TextareaArray.test.ts`
Expected: FAIL — component does not exist

**Step 3: Write minimal implementation**

```vue
<!-- components/admin/fields/TextareaArray.vue -->
<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  rows?: number
  placeholder?: string
}>(), {
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const displayText = computed(function () {
  return props.modelValue.join("\n")
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const lines = target.value.split("\n")
  const filtered: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed !== "") {
      filtered.push(trimmed)
    }
  }
  emit("update:modelValue", filtered)
}
</script>

<template>
  <div class="mb-4">
    <label class="admin-label">{{ label }}</label>
    <textarea
      class="admin-input w-full"
      :value="displayText"
      :rows="rows"
      :placeholder="placeholder"
      @input="handleInput"
    ></textarea>
  </div>
</template>
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin/fields/TextareaArray.test.ts`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add components/admin/fields/TextareaArray.vue tests/admin/fields/TextareaArray.test.ts
git commit -m "feat: add TextareaArray component - string[] v-model with textarea display"
```

---

### Task 2: AdminField 組件

**Files:**
- Create: `components/admin/fields/AdminField.vue`
- Create: `tests/admin/fields/AdminField.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/admin/fields/AdminField.test.ts
import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import AdminField from "../../../components/admin/fields/AdminField.vue"

describe("AdminField", function () {
  it("renders text input with label", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "hello", label: "名稱" }
    })
    expect(wrapper.find("label").text()).toBe("名稱")
    expect(wrapper.find("input").element.value).toBe("hello")
  })

  it("renders textarea when type is textarea", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "content", label: "描述", type: "textarea", rows: 4 }
    })
    expect(wrapper.find("textarea").exists()).toBe(true)
    expect(wrapper.find("textarea").element.value).toBe("content")
    expect(wrapper.find("textarea").attributes("rows")).toBe("4")
  })

  it("renders number input", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: 48, label: "高度", type: "number" }
    })
    const input = wrapper.find("input")
    expect(input.attributes("type")).toBe("number")
  })

  it("renders checkbox", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: true, label: "主要", type: "checkbox" }
    })
    const input = wrapper.find("input[type='checkbox']")
    expect(input.exists()).toBe(true)
    expect(input.element.checked).toBe(true)
  })

  it("emits update on text input", async function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "", label: "名稱" }
    })
    await wrapper.find("input").setValue("new value")
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe("new value")
  })

  it("emits update on checkbox change", async function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: false, label: "主要", type: "checkbox" }
    })
    await wrapper.find("input[type='checkbox']").setValue(true)
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin/fields/AdminField.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

```vue
<!-- components/admin/fields/AdminField.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number | boolean
  label: string
  type?: "text" | "textarea" | "number" | "checkbox"
  rows?: number
  placeholder?: string
}>(), {
  type: "text",
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === "checkbox") {
    emit("update:modelValue", target.checked)
  } else if (props.type === "number") {
    emit("update:modelValue", Number(target.value))
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>

<template>
  <div class="mb-4" :class="{ 'flex items-center gap-2': type === 'checkbox' }">
    <label class="admin-label">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      class="admin-input w-full"
      :value="String(modelValue)"
      :rows="rows"
      :placeholder="placeholder"
      @input="handleInput"
    ></textarea>
    <input
      v-else-if="type === 'checkbox'"
      type="checkbox"
      :checked="Boolean(modelValue)"
      @change="handleInput"
    />
    <input
      v-else
      class="admin-input w-full"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </div>
</template>
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin/fields/AdminField.test.ts`
Expected: PASS (6 tests)

**Step 5: Commit**

```bash
git add components/admin/fields/AdminField.vue tests/admin/fields/AdminField.test.ts
git commit -m "feat: add AdminField component - unified label+input wrapper"
```

---

### Task 3: AdminRepeater 組件

**Files:**
- Create: `components/admin/fields/AdminRepeater.vue`
- Create: `tests/admin/fields/AdminRepeater.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/admin/fields/AdminRepeater.test.ts
import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import AdminRepeater from "../../../components/admin/fields/AdminRepeater.vue"

describe("AdminRepeater", function () {
  it("renders items from modelValue", function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }, { name: "b" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">{{ params.item.name }}</div>'
      }
    })
    expect(wrapper.findAll(".test-item").length).toBe(2)
  })

  it("adds new item on add button click", async function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    await wrapper.find("[data-test='add-btn']").trigger("click")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveLength(2)
    expect(emitted[0][0][1]).toEqual({ name: "" })
  })

  it("removes item on remove button click", async function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }, { name: "b" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    const removeBtns = wrapper.findAll("[data-test='remove-btn']")
    await removeBtns[0].trigger("click")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveLength(1)
    expect(emitted[0][0][0]).toEqual({ name: "b" })
  })

  it("respects min prop and disables remove", function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }],
        emptyItem: { name: "" },
        min: 1
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    const removeBtn = wrapper.find("[data-test='remove-btn']")
    expect(removeBtn.attributes("disabled")).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/admin/fields/AdminRepeater.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

```vue
<!-- components/admin/fields/AdminRepeater.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any[]
  emptyItem: Record<string, unknown>
  addLabel?: string
  min?: number
  label?: string
}>(), {
  addLabel: "+ 新增",
  min: 0,
  label: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: any[]]
}>()

function addItem() {
  const newItem = JSON.parse(JSON.stringify(props.emptyItem))
  const newList = props.modelValue.slice()
  newList.push(newItem)
  emit("update:modelValue", newList)
}

function removeItem(index: number) {
  if (props.modelValue.length <= props.min) return
  const newList = props.modelValue.slice()
  newList.splice(index, 1)
  emit("update:modelValue", newList)
}
</script>

<template>
  <div class="mb-6">
    <div v-if="label" class="admin-label mb-2">{{ label }}</div>
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="border border-slate-200 rounded-lg p-4 mb-3 relative"
    >
      <slot name="item" :item="item" :index="index"></slot>
      <button
        type="button"
        data-test="remove-btn"
        class="admin-action--subtle text-red-500 text-sm mt-2"
        :disabled="modelValue.length <= min"
        @click="removeItem(index)"
      >
        刪除
      </button>
    </div>
    <button
      type="button"
      data-test="add-btn"
      class="admin-action--secondary text-sm"
      @click="addItem"
    >
      {{ addLabel }}
    </button>
  </div>
</template>
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/admin/fields/AdminRepeater.test.ts`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add components/admin/fields/AdminRepeater.vue tests/admin/fields/AdminRepeater.test.ts
git commit -m "feat: add AdminRepeater component - dynamic array management"
```

---

### Task 4: 移除 FormKit 依賴和配置

**Files:**
- Delete: `lib/admin/formkitConfig.ts`
- Delete: `styles/formkit-admin.css`
- Modify: `.vitepress/theme/index.ts`

**Step 1: Remove FormKit from theme**

Rewrite `.vitepress/theme/index.ts` to:

```typescript
import type { App } from 'vue'
import Layout from './Layout.vue'
import HomePage from '../../components/HomePage.vue'
import AdminPage from '../../components/admin/AdminPage.vue'
import '../../styles/global.css'

function enhanceApp(context: { app: App }) {
  context.app.component('HomePage', HomePage)
  context.app.component('AdminPage', AdminPage)
}

export default {
  Layout: Layout,
  enhanceApp: enhanceApp
}
```

**Step 2: Delete FormKit files**

```bash
rm lib/admin/formkitConfig.ts
rm styles/formkit-admin.css
```

**Step 3: Uninstall FormKit packages**

```bash
npm uninstall @formkit/vue @formkit/i18n
```

**Step 4: Run build to verify no import errors**

Run: `npm run docs:build`
Expected: Build will fail because editors still import FormKit — this is expected, we fix in Tasks 5-11.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove FormKit dependencies and configuration"
```

---

### Task 5: Rewrite ContactEditor (simplest)

**Files:**
- Modify: `components/admin/editors/ContactEditor.vue`
- Modify: `tests/admin/editors/ContactEditor.test.ts`

**Step 1: Rewrite the editor**

```vue
<!-- components/admin/editors/ContactEditor.vue -->
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"

const { state, load, save } = usePocketBaseContent("contact")
onMounted(load)
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">聯絡方式編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminField label="電郵" v-model="state.fields.email" />
      <AdminField label="電話" v-model="state.fields.tel" />
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test to verify it still passes**

Run: `npx vitest run tests/admin/editors/ContactEditor.test.ts`
Expected: PASS — title text "聯絡方式編輯" unchanged

**Step 3: Commit**

```bash
git add components/admin/editors/ContactEditor.vue
git commit -m "refactor: rewrite ContactEditor with native Vue 3 fields"
```

---

### Task 6: Rewrite InterviewEditor

**Files:**
- Modify: `components/admin/editors/InterviewEditor.vue`

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"

const { state, load, save } = usePocketBaseContent("interview")
onMounted(load)
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">面試安排編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminField label="描述（中文）" v-model="state.fields.descriptionZh" type="textarea" :rows="4" />
      <AdminField label="描述（英文）" v-model="state.fields.descriptionEn" type="textarea" :rows="4" />
      <AdminField label="第一輪面試標籤" v-model="state.fields.firstRoundLabel" />
      <AdminField label="第一輪面試日期" v-model="state.fields.firstRoundDate" />
      <AdminField label="第二輪面試標籤" v-model="state.fields.secondRoundLabel" />
      <AdminField label="第二輪面試日期" v-model="state.fields.secondRoundDate" />
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/InterviewEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/InterviewEditor.vue
git commit -m "refactor: rewrite InterviewEditor with native Vue 3 fields"
```

---

### Task 7: Rewrite AboutUsEditor

**Files:**
- Modify: `components/admin/editors/AboutUsEditor.vue`

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"

const { state, load, save } = usePocketBaseContent("about_us")
onMounted(load)

const emptyOrganization = { role: "", name: "", logo: "", url: "" }

function handleLogoUpload(event: Event, item: Record<string, unknown>) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function (e) {
    item.logo = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">關於我們編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.organizations"
        :empty-item="emptyOrganization"
        add-label="+ 新增組織"
        label="組織列表"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="角色" v-model="item.role" />
          <AdminField label="名稱" v-model="item.name" />
          <AdminField label="Logo 路徑" v-model="item.logo" />
          <div class="mb-4">
            <input type="file" accept="image/*" class="admin-input text-sm" @change="handleLogoUpload($event, item)" />
          </div>
          <AdminField label="網址" v-model="item.url" />
        </template>
      </AdminRepeater>
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/AboutUsEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/AboutUsEditor.vue
git commit -m "refactor: rewrite AboutUsEditor with native Vue 3 fields"
```

---

### Task 8: Rewrite ProjectIntroEditor

**Files:**
- Modify: `components/admin/editors/ProjectIntroEditor.vue`

**Key change:** Uses TextareaArray for eligibilityZh/En, feeZh/En — no more convertArraysToStrings or formReady.

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("project_intro")
onMounted(load)

const emptyInfoCard = { titleZh: "", titleEn: "", contentZh: "", contentEn: "" }

function handlePosterUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function (e) {
    state.fields.posterUrl = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">項目簡介編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="副標題（中文）" v-model="state.fields.subtitleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminField label="副標題（英文）" v-model="state.fields.subtitleEn" />
      <AdminField label="描述（中文）" v-model="state.fields.descriptionZh" type="textarea" :rows="4" />
      <AdminField label="描述（英文）" v-model="state.fields.descriptionEn" type="textarea" :rows="4" />
      <AdminField label="海報圖片路徑" v-model="state.fields.posterUrl" />
      <div class="mb-4">
        <input type="file" accept="image/*" class="admin-input text-sm" @change="handlePosterUpload" />
      </div>
      <AdminRepeater
        v-model="state.fields.infoCards"
        :empty-item="emptyInfoCard"
        add-label="+ 新增卡片"
        label="資訊卡片"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標題（中文）" v-model="item.titleZh" />
          <AdminField label="標題（英文）" v-model="item.titleEn" />
          <AdminField label="內容（中文）" v-model="item.contentZh" />
          <AdminField label="內容（英文）" v-model="item.contentEn" />
        </template>
      </AdminRepeater>
      <TextareaArray v-model="state.fields.eligibilityZh" label="申請資格（中文，每行一項）" :rows="3" />
      <TextareaArray v-model="state.fields.eligibilityEn" label="申請資格（英文，每行一項）" :rows="3" />
      <TextareaArray v-model="state.fields.feeZh" label="費用說明（中文，每行一項）" :rows="2" />
      <TextareaArray v-model="state.fields.feeEn" label="費用說明（英文，每行一項）" :rows="2" />
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/ProjectIntroEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/ProjectIntroEditor.vue
git commit -m "refactor: rewrite ProjectIntroEditor - TextareaArray eliminates array conversion hacks"
```

---

### Task 9: Rewrite PositionsEditor (most complex)

**Files:**
- Modify: `components/admin/editors/PositionsEditor.vue`

**Key change:** Two-level nested AdminRepeater + TextareaArray. Zero convertArraysToStrings, zero formReady, zero handleSave deep-copy.

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("positions")
onMounted(load)

const emptyPosition = { companyLines: [], roleLines: [], requirements: [], duties: [] }
const emptyGroup = { location: "", description: "", positions: [JSON.parse(JSON.stringify(emptyPosition))] }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">實習崗位編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.groups"
        :empty-item="emptyGroup"
        add-label="+ 新增地區"
        label="地區分組"
        :min="1"
      >
        <template #item="{ item: group }">
          <AdminField label="地區" v-model="group.location" />
          <AdminField label="地區描述" v-model="group.description" type="textarea" :rows="2" />
          <AdminRepeater
            v-model="group.positions"
            :empty-item="emptyPosition"
            add-label="+ 新增崗位"
            label="崗位列表"
            :min="1"
          >
            <template #item="{ item: pos }">
              <TextareaArray v-model="pos.companyLines" label="公司名稱（每行一條）" :rows="2" />
              <TextareaArray v-model="pos.roleLines" label="崗位名稱（每行一條）" :rows="2" />
              <TextareaArray v-model="pos.requirements" label="崗位要求（每行一條）" :rows="3" />
              <TextareaArray v-model="pos.duties" label="工作內容（每行一條）" :rows="3" />
            </template>
          </AdminRepeater>
        </template>
      </AdminRepeater>
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/PositionsEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/PositionsEditor.vue
git commit -m "refactor: rewrite PositionsEditor - nested repeaters with TextareaArray, zero hacks"
```

---

### Task 10: Rewrite TimelineEditor

**Files:**
- Modify: `components/admin/editors/TimelineEditor.vue`

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("timeline")
onMounted(load)

const emptyStep = { date: "", content: [], highlight: false }
const emptyNote = { icon: "", title: "", content: [] }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">時間表編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.steps"
        :empty-item="emptyStep"
        add-label="+ 新增步驟"
        label="時間步驟"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="日期" v-model="item.date" />
          <TextareaArray v-model="item.content" label="內容（每行一項）" :rows="2" />
          <AdminField label="重點標示" v-model="item.highlight" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.notes"
        :empty-item="emptyNote"
        add-label="+ 新增備註"
        label="備註說明"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="圖示" v-model="item.icon" />
          <AdminField label="標題" v-model="item.title" />
          <TextareaArray v-model="item.content" label="內容（每行一項）" :rows="2" />
        </template>
      </AdminRepeater>
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/TimelineEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/TimelineEditor.vue
git commit -m "refactor: rewrite TimelineEditor with TextareaArray, zero conversion hacks"
```

---

### Task 11: Rewrite SiteSettingsEditor

**Files:**
- Modify: `components/admin/editors/SiteSettingsEditor.vue`

**Step 1: Rewrite the editor**

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"

const { state, load, save } = usePocketBaseContent("site_settings")
onMounted(load)

const emptyHeaderLink = { titleZh: "", titleEn: "", href: "", primary: false }
const emptyFooterQuickLink = { label: "", href: "", primary: false }
const emptyFooterSocialLink = { label: "", href: "", icon: "" }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">網站設定編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="Logo 高度（像素）" v-model="state.fields.logoHeight" type="number" />
      <AdminRepeater
        v-model="state.fields.headerLinks"
        :empty-item="emptyHeaderLink"
        add-label="+ 新增連結"
        label="頁首連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標題（中文）" v-model="item.titleZh" />
          <AdminField label="標題（英文）" v-model="item.titleEn" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="主要連結" v-model="item.primary" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.footerQuickLinks"
        :empty-item="emptyFooterQuickLink"
        add-label="+ 新增連結"
        label="頁尾快速連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標籤" v-model="item.label" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="主要連結" v-model="item.primary" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.footerSocialLinks"
        :empty-item="emptyFooterSocialLink"
        add-label="+ 新增連結"
        label="頁尾社交連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標籤" v-model="item.label" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="圖示" v-model="item.icon" />
        </template>
      </AdminRepeater>
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

**Step 2: Run test**

Run: `npx vitest run tests/admin/editors/SiteSettingsEditor.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add components/admin/editors/SiteSettingsEditor.vue
git commit -m "refactor: rewrite SiteSettingsEditor with native Vue 3 repeaters"
```

---

### Task 12: Full test suite + build verification

**Step 1: Run all tests**

```bash
npm test
```

Expected: All 65+ tests pass (some test counts may change due to new field component tests)

**Step 2: Build for production**

```bash
npm run docs:build
```

Expected: Build succeeds without errors

**Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "refactor: complete admin rewrite - remove FormKit, use native Vue 3 components"
```

---

### Task 13: Deploy and verify

**Step 1: Backup**

```bash
sudo cp -r /var/www/hkuya.org/hkjc /var/www/hkuya.org/hkjc.bak-$(date +%Y%m%d%H%M%S)
```

**Step 2: Deploy**

```bash
sudo cp -r .vitepress/dist/* /var/www/hkuya.org/hkjc/
```

**Step 3: Verify services**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/api/health
curl -s -o /dev/null -w "%{http_code}" https://www.hkuya.org/hkjc/
curl -s -o /dev/null -w "%{http_code}" https://www.hkuya.org/hkjc/admin.html
```

Expected: All return 200

**Step 4: Manual browser test**

Open `https://www.hkuya.org/hkjc/admin.html`, verify:
- No console errors (especially no "Cannot set -1")
- Can switch between all 7 editors without errors
- Can edit and save content
- Array fields (positions, timeline) display correctly as textarea
