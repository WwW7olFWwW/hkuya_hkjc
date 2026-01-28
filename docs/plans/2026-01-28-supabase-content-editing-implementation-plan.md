# Supabase 內容即時編輯 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將現有 VitePress 內容改為可由共用帳號編輯，並即時反映到前端。

**Architecture:** 前端在執行期載入 `content_blocks`，以預設內容作 fallback；後端使用 Supabase（Postgres + Realtime + Storage + Auth），並提供簡化管理頁。前端訂閱 Realtime 更新，必要時以短輪詢回退。

**Tech Stack:** VitePress v2, Vue 3, TypeScript, Tailwind, Supabase JS, Vitest.

---

### Task 1: 建立測試與內容正規化基礎

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/content/defaultContent.ts`
- Create: `lib/content/normalizeContent.ts`
- Test: `tests/content/normalizeContent.test.ts`

**Step 1: 新增 Vitest 與 test script**

Run:
```bash
npm install -D vitest
```

Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "docs:dev": "vitepress dev .",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview ."
  }
}
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"]
  }
})
```

**Step 2: 寫入失敗測試（先紅）**

Create `tests/content/normalizeContent.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { normalizeContent } from "../../lib/content/normalizeContent"
import { defaultContent } from "../../lib/content/defaultContent"

describe("normalizeContent", function () {
  it("fills missing blocks from defaults", function () {
    const input = {
      project_intro: { fields: { titleZh: "更新標題" } }
    }

    const output = normalizeContent(input)

    expect(output.project_intro.fields.titleZh).toBe("更新標題")
    expect(output.timeline).toEqual(defaultContent.timeline)
  })
})
```

**Step 3: 執行測試確認失敗**

Run:
```bash
npm run test
```
Expected: FAIL（找不到 `normalizeContent` 或 `defaultContent`）。

**Step 4: 實作最小內容與正規化邏輯**

Create `lib/content/defaultContent.ts`:
```ts
import { timelineData, projectDetails } from "../../data/timeline"
import { positionGroups } from "../../data/positions"

export const defaultContent = {
  project_intro: {
    fields: {
      titleZh: "\u201c\u5be6\u8df5\u79d1\u5275\u00b7\u63a2\u77e5\u6b77\u53f2\u201d2024-2025",
      subtitleZh: "\u6691\u671f\u5be6\u7fd2\u5718",
      titleEn: "\u201cReimagining History, Innovating Tomorrow\u201d",
      subtitleEn: "Summer Internship Program 2024-2025",
      descriptionZh: "\u201c\u5be6\u8df5\u79d1\u5275\u00b7\u63a2\u77e5\u6b77\u53f2\u201d\u6691\u671f\u5be6\u7fd2\u8a08\u5283\u65e8\u5728\u900f\u904e\u5be6\u7fd2\u8a8d\u8b58\u5275\u79d1\u884c\u696d\uff0c\u9ad4\u9a57\u4e0d\u540c\u4f01\u696d\u7684\u6587\u5316\u80cc\u666f\u53ca\u5275\u65b0\u79d1\u6280\u696d\u754c\u7684\u5de5\u4f5c\uff0c\u540c\u6642\uff0c\u8b93\u5be6\u7fd2\u751f\u5728\u5de5\u4f5c\u4e2d\u5b78\u7fd2\u76f8\u95dc\u7684\u5c08\u696d\u77e5\u8b58\uff0c\u57f9\u990a\u4ed6\u5011\u65e5\u5f8c\u6295\u8eab\u4e0d\u540c\u9818\u57df\u4e8b\u696d\u7684\u8208\u8da3\u3002\u53c3\u8207\u8005\u5c07\u6709\u6a5f\u6703\u5728\u5317\u4eac\u548c\u5927\u7063\u5340\uff08\u5ee3\u5dde\u3001\u6df1\u5733\uff09\u7684\u77e5\u540d\u4f01\u696d\u548c\u6a5f\u69cb\u9032\u884c\u5be6\u7fd2\uff0c\u62d3\u5c55\u8996\u91ce\uff0c\u589e\u5f37\u5c08\u696d\u80fd\u529b\u3002\u8a08\u5283\u4e0d\u50c5\u9f13\u52f5\u4f86\u81ea\u4e0d\u540c\u5b78\u6821\u7684\u9752\u5e74\u5b78\u5b50\u4e92\u76f8\u4ea4\u6d41\u8207\u5408\u4f5c\uff0c\u9084\u8a2d\u6709\u4e00\u7cfb\u5217\u7684\u589e\u503c\u6d3b\u52d5\uff0c\u5305\u62ec\u4f01\u696d\u53c3\u8a2a\u3001\u6587\u5316\u540d\u52dd\u8003\u5bdf\u4ee5\u53ca\u8207\u696d\u754c\u9818\u8896\u53ca\u5927\u5b78\u751f\u7684\u4ea4\u6d41\u5c0d\u8a71\u3002\u9019\u4e9b\u6d3b\u52d5\u5c07\u70ba\u53c3\u8207\u8005\u63d0\u4f9b\u5168\u65b9\u4f4d\u7684\u5b78\u7fd2\u9ad4\u9a57\uff0c\u52a9\u529b\u4ed6\u5011\u5728\u8077\u696d\u767c\u5c55\u4e0a\u9081\u51fa\u5805\u5be6\u6b65\u4f10\u3002",
      descriptionEn: "\u201cReimagining History, Innovating Tomorrow\u201d Summer Internship Program 2025 aims to introduce participants to the innovation and technology industry through internships, allowing them to experience the cultural backgrounds of different companies and work in the innovative tech sector. At the same time, the program provides interns with the opportunity to acquire relevant professional knowledge and develop an interest in pursuing careers in various fields. Participants will have the chance to intern at renowned companies and organizations in Beijing and the Greater Bay Area (Guangzhou, Shenzhen), expanding their horizons and enhancing their professional capabilities. The program encourages young people from different schools to communicate and collaborate and includes a series of value-added activities, such as company visits, cultural heritage tours, and exchanges with industry leaders and university students. These activities will offer participants a comprehensive learning experience, helping them take solid steps in their career development.",
      posterUrl: "/images/poster.webp",
      infoCards: [
        {
          titleZh: "\u5be6\u7fd2\u65e5\u671f",
          titleEn: "Internship Period",
          contentZh: "2025\u5e746\u670822\u65e5\u81f37\u670819\u65e5",
          contentEn: "June 22 - July 19, 2025"
        },
        {
          titleZh: "\u5be6\u7fd2\u5d17\u4f4d\u7bc4\u7587",
          titleEn: "Positions",
          contentZh: "\u79d1\u5275\u7522\u696d",
          contentEn: "Science, Innovation and Technology Industry"
        },
        {
          titleZh: "\u5be6\u7fd2\u5730\u9ede",
          titleEn: "Location",
          contentZh: "\u5317\u4eac\u53ca\u5927\u7063\u5340\uff08\u5ee3\u5dde\u548c\u6df1\u5733\uff09",
          contentEn: "Beijing and Greater Bay Area (Guangzhou, Shenzhen)"
        },
        {
          titleZh: "\u540d\u984d",
          titleEn: "Quota",
          contentZh: "40\u540d",
          contentEn: "40 participants"
        }
      ],
      eligibilityZh: [
        "a. 18 \u6b72\u4ee5\u4e0a\u7684\u5404\u5927\u9662\u6821\u4e4b\u5168\u65e5\u5236\u5b78\u751f\u6216\u61c9\u5c46\u7562\u696d\u751f",
        "b. \uff08i\uff09\u6301\u6709\u6709\u6548\u9999\u6e2f\u6c38\u4e45\u5c45\u6c11\u8eab\u4efd\u8b49 \u6216\uff08ii\uff09\u6301\u6709\u6709\u6548\u9999\u6e2f\u5c45\u6c11\u8eab\u4efd\u8b49\u4e26\u5728\u9999\u6e2f\u5c31\u8b80\u5168\u65e5\u5236\u8ab2\u7a0b"
      ],
      eligibilityEn: [
        "a. Full-time students or recent graduates from various universities who are 18 years of age or older; and",
        "b. (i) Hold a valid Hong Kong Permanent Resident Identity Card, or (ii) Hold a valid Hong Kong Resident Identity Card and are enrolled in a full-time program in Hong Kong."
      ],
      feeZh: [
        "\u5718\u8cbb\uff1a\u5168\u514d\uff08\u5305\u62ec\u4f86\u56de\u4ea4\u901a\u3001\u4f4f\u5bbf\u3001\u4fdd\u96aa\u3001\u4ea4\u6d41\u6d3b\u52d5\u7b49\u8cbb\u7528\uff09",
        "\u6309\u91d1\uff1a\u6e2f\u5e632,500\u5143\u6b63\uff08\u9806\u5229\u5b8c\u6210\u6574\u500b\u5be6\u7fd2\u8a08\u5283\u5f8c\u5168\u6578\u9000\u9084\uff0c\u5305\u62ec\u5b8c\u6210\u5be6\u7fd2\u5de5\u4f5c\u3001\u5be6\u7fd2\u5831\u544a\u53ca\u672c\u6703\u9810\u5148\u6307\u5b9a\u7684\u5b78\u7fd2\u4efb\u52d9\uff09"
      ],
      feeEn: [
        "Fee: Free of Charge (covering accommodation, round-trip transportation, insurance, and breakfast)",
        "Deposits: HKD2,500 (fully refundable upon completion of the exchange and submission of a report and designated tasks)"
      ]
    }
  },
  interview: {
    fields: {
      titleZh: "\u9762\u8a66\u5b89\u6392",
      titleEn: "Interview",
      descriptionZh: "\u672c\u6703\u5c07\u6839\u64da\u5be6\u7fd2\u5d17\u4f4d\u8981\u6c42\u800c\u70ba\u7533\u8acb\u8005\u5b89\u6392\u9762\u8a66\uff08\u5982\u7533\u8acb\u8005\u5c31\u8b80\u4e4b\u5b78\u79d1\u672a\u80fd\u5339\u914d\u5d17\u4f4d\u8981\u6c42\uff0c\u5247\u4e0d\u7372\u9762\u8a66\u8cc7\u683c\uff09\u9762\u8a66\u8a73\u60c5\u5c07\u65bc\u7a0d\u5f8c\u53e6\u884c\u901a\u77e5\u3002",
      descriptionEn: "We will arrange interviews for applicants based on the requirements of the internship position (if the subject studied by the applicant does not match the job requirements, the applicant will not be eligible for the interview). Interview details will be provided later."
    }
  },
  timeline: {
    fields: {
      titleZh: "\u4f5c\u606f\u6642\u7a0b",
      titleEn: "Timeline",
      steps: timelineData,
      notes: projectDetails
    }
  },
  positions: {
    fields: {
      titleZh: "\u5be6\u7fd2\u5d17\u4f4d",
      titleEn: "Job Positions",
      groups: positionGroups
    }
  },
  about_us: {
    fields: {
      titleZh: "\u95dc\u65bc\u6211\u5011",
      titleEn: "About Us"
    }
  },
  contact: {
    fields: {
      titleZh: "\u806f\u7d61\u65b9\u5f0f",
      titleEn: "Contact"
    }
  }
}
```

Create `lib/content/normalizeContent.ts`:
```ts
import { defaultContent } from "./defaultContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

export function normalizeContent(input: ContentMap) {
  const output: ContentMap = {}
  const keys = Object.keys(defaultContent)

  for (const key of keys) {
    const fallback = defaultContent[key as keyof typeof defaultContent]
    const incoming = input[key]

    if (!incoming) {
      output[key] = fallback
      continue
    }

    const mergedFields: Record<string, unknown> = {}
    const fieldKeys = Object.keys(fallback.fields)

    for (const fieldKey of fieldKeys) {
      if (incoming.fields && Object.prototype.hasOwnProperty.call(incoming.fields, fieldKey)) {
        mergedFields[fieldKey] = incoming.fields[fieldKey]
      } else {
        mergedFields[fieldKey] = fallback.fields[fieldKey]
      }
    }

    output[key] = { fields: mergedFields }
  }

  return output
}
```

**Step 5: 執行測試確認通過**

Run:
```bash
npm run test
```
Expected: PASS。

**Step 6: Commit**

```bash
git add package.json vitest.config.ts lib/content/defaultContent.ts lib/content/normalizeContent.ts tests/content/normalizeContent.test.ts

git commit -m "test: add content normalization"
```

---

### Task 2: 建立 Supabase Client 與資料映射

**Files:**
- Modify: `package.json`
- Create: `lib/supabase/client.ts`
- Create: `lib/content/fetchContent.ts`
- Create: `.env.example`
- Test: `tests/content/mapRecords.test.ts`

**Step 1: 新增 Supabase JS**

Run:
```bash
npm install @supabase/supabase-js
```

**Step 2: 寫入失敗測試**

Create `tests/content/mapRecords.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { mapRecordsToContent } from "../../lib/content/fetchContent"

const records = [
  {
    slug: "project_intro",
    fields: { titleZh: "\u66f4\u65b0\u6a19\u984c" }
  }
]

describe("mapRecordsToContent", function () {
  it("maps records into content map", function () {
    const content = mapRecordsToContent(records)

    expect(content.project_intro.fields.titleZh).toBe("\u66f4\u65b0\u6a19\u984c")
  })
})
```

**Step 3: 執行測試確認失敗**

Run:
```bash
npm run test
```
Expected: FAIL（找不到 `mapRecordsToContent`）。

**Step 4: 實作 client 與映射**

Create `lib/supabase/client.ts`:
```ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Create `lib/content/fetchContent.ts`:
```ts
import { supabase } from "../supabase/client"
import { normalizeContent } from "./normalizeContent"

type ContentRecord = {
  slug: string
  fields: Record<string, unknown>
}

type ContentMap = Record<string, { fields: Record<string, unknown> }>

export function mapRecordsToContent(records: ContentRecord[]) {
  const map: ContentMap = {}

  for (const record of records) {
    map[record.slug] = { fields: record.fields }
  }

  return normalizeContent(map)
}

export async function fetchContentBlocks() {
  const response = await supabase.from("content_blocks").select("slug, fields")

  if (response.error) {
    throw response.error
  }

  return mapRecordsToContent(response.data as ContentRecord[])
}
```

Create `.env.example`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Step 5: 執行測試確認通過**

Run:
```bash
npm run test
```
Expected: PASS。

**Step 6: Commit**

```bash
git add package.json lib/supabase/client.ts lib/content/fetchContent.ts tests/content/mapRecords.test.ts .env.example

git commit -m "feat: add supabase content fetcher"
```

---

### Task 3: 建立即時更新工具與內容狀態

**Files:**
- Create: `lib/content/store.ts`
- Create: `lib/content/realtime.ts`
- Test: `tests/content/applyUpdate.test.ts`

**Step 1: 寫入失敗測試**

Create `tests/content/applyUpdate.test.ts`:
```ts
import { describe, it, expect } from "vitest"
import { applyContentUpdate } from "../../lib/content/realtime"
import { defaultContent } from "../../lib/content/defaultContent"

describe("applyContentUpdate", function () {
  it("replaces block fields and keeps other defaults", function () {
    const payload = {
      new: { slug: "project_intro", fields: { titleZh: "\u66f4\u65b0\u6a19\u984c" } }
    }

    const output = applyContentUpdate(defaultContent, payload)

    expect(output.project_intro.fields.titleZh).toBe("\u66f4\u65b0\u6a19\u984c")
    expect(output.timeline).toEqual(defaultContent.timeline)
  })
})
```

**Step 2: 執行測試確認失敗**

Run:
```bash
npm run test
```
Expected: FAIL（找不到 `applyContentUpdate`）。

**Step 3: 實作內容狀態與更新函式**

Create `lib/content/store.ts`:
```ts
import { ref } from "vue"
import { defaultContent } from "./defaultContent"
import { fetchContentBlocks } from "./fetchContent"

const contentState = ref(defaultContent)

export function useContentStore() {
  return {
    contentState,
    async load() {
      const content = await fetchContentBlocks()
      contentState.value = content
    }
  }
}
```

Create `lib/content/realtime.ts`:
```ts
import { supabase } from "../supabase/client"
import { normalizeContent } from "./normalizeContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

type ChangePayload = {
  new: {
    slug: string
    fields: Record<string, unknown>
  }
}

export function applyContentUpdate(current: ContentMap, payload: ChangePayload) {
  const next: ContentMap = {}
  const keys = Object.keys(current)

  for (const key of keys) {
    next[key] = current[key]
  }

  if (payload && payload.new) {
    next[payload.new.slug] = { fields: payload.new.fields }
  }

  return normalizeContent(next)
}

export function subscribeContentChanges(handler: function (payload: ChangePayload) => void) {
  return supabase
    .channel("content_blocks_changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "content_blocks" },
      function (payload) {
        handler(payload as ChangePayload)
      }
    )
    .subscribe()
}
```

**Step 4: 執行測試確認通過**

Run:
```bash
npm run test
```
Expected: PASS。

**Step 5: Commit**

```bash
git add lib/content/store.ts lib/content/realtime.ts tests/content/applyUpdate.test.ts

git commit -m "feat: add content realtime helpers"
```

---

### Task 4: 前端讀取內容（ProjectIntro / Timeline / Positions / Interview / About / Contact）

**Files:**
- Modify: `components/HomePage.vue`
- Modify: `components/sections/ProjectIntro.vue`
- Modify: `components/sections/TimelineSection.vue`
- Modify: `components/sections/PositionsSection.vue`
- Modify: `components/sections/InterviewSection.vue`
- Modify: `components/sections/AboutUsSection.vue`
- Modify: `components/sections/ContactSection.vue`

**Step 1: 在首頁載入內容與訂閱**

Update `components/HomePage.vue`:
```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"
import ProjectIntro from "@/components/sections/ProjectIntro.vue"
import InterviewSection from "@/components/sections/InterviewSection.vue"
import TimelineSection from "@/components/sections/TimelineSection.vue"
import PositionsSection from "@/components/sections/PositionsSection.vue"
import AboutUsSection from "@/components/sections/AboutUsSection.vue"
import ContactSection from "@/components/sections/ContactSection.vue"
import { useContentStore } from "@/lib/content/store"
import { applyContentUpdate, subscribeContentChanges } from "@/lib/content/realtime"

const { contentState, load } = useContentStore()
let subscription: { unsubscribe: function () => void } | null = null

onMounted(async function () {
  await load()
  subscription = subscribeContentChanges(function (payload) {
    contentState.value = applyContentUpdate(contentState.value, payload)
  })
})

onBeforeUnmount(function () {
  if (subscription && typeof subscription.unsubscribe === "function") {
    subscription.unsubscribe()
  }
})
</script>

<template>
  <div>
    <ProjectIntro :content="contentState.project_intro" />
    <InterviewSection :content="contentState.interview" />
    <TimelineSection :content="contentState.timeline" />
    <PositionsSection :content="contentState.positions" />
    <AboutUsSection :content="contentState.about_us" />
    <ContactSection :content="contentState.contact" />
  </div>
</template>
```

**Step 2: ProjectIntro 接收內容 props**

Update `components/sections/ProjectIntro.vue`:
```vue
<script setup lang="ts">
import { withBase } from "vitepress"
import { Calendar, MapPin, Users, User, ZoomIn } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Dialog, DialogTrigger, DialogScrollContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      subtitleZh: string
      titleEn: string
      subtitleEn: string
      descriptionZh: string
      descriptionEn: string
      posterUrl: string
      infoCards: Array<{
        titleZh: string
        titleEn: string
        contentZh: string
        contentEn: string
      }>
      eligibilityZh: string[]
      eligibilityEn: string[]
      feeZh: string[]
      feeEn: string[]
    }
  }
}>()

function resolveAsset(path: string) {
  return withBase(path)
}
</script>

<template>
  <SectionBlock id="project-intro">
    <PageContainer>
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          {{ content.fields.titleZh }}
        </h1>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">
          {{ content.fields.subtitleZh }}
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mt-4">
          {{ content.fields.titleEn }}
        </h2>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">
          {{ content.fields.subtitleEn }}
        </p>
      </div>

      <div class="section-card p-4 sm:p-6 md:p-8 mb-10">
        <div class="grid gap-6 md:grid-cols-[320px_1fr]">
          <Dialog>
            <DialogTrigger as-child>
              <button type="button" class="relative w-full text-left">
                <img
                  :src="resolveAsset(content.fields.posterUrl)"
                  alt="\u5be6\u7fd2\u8a08\u5283\u6d77\u5831"
                  class="w-full rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.02]"
                />
                <span class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-slate-700 shadow">
                  <ZoomIn class="h-4 w-4" />
                  \u653e\u5927\u67e5\u770b
                </span>
              </button>
            </DialogTrigger>
            <DialogScrollContent class="max-w-5xl">
              <img :src="resolveAsset(content.fields.posterUrl)" alt="\u5be6\u7fd2\u8a08\u5283\u6d77\u5831" class="w-full rounded-lg" />
            </DialogScrollContent>
          </Dialog>

          <div class="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
            <p>{{ content.fields.descriptionZh }}</p>
            <p>{{ content.fields.descriptionEn }}</p>
          </div>
        </div>

        <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 mt-8">
          <div
            v-for="item in content.fields.infoCards"
            :key="item.titleZh"
            class="section-card p-4 sm:p-5"
          >
            <div class="flex items-start gap-3">
              <component :is="Calendar" class="h-5 w-5 text-brand-green mt-1" />
              <div class="flex-1">
                <div class="flex items-center justify-between text-sm font-semibold">
                  <span>{{ item.titleZh }}</span>
                  <span class="text-slate-500 font-medium">{{ item.titleEn }}</span>
                </div>
                <div class="mt-2 text-base font-semibold text-slate-900">
                  {{ item.contentZh }}
                </div>
                <div class="text-sm text-slate-500">
                  {{ item.contentEn }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card content-card p-5 sm:p-7 md:p-8">
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-brand-blue">\u53c3\u52a0\u8cc7\u683c / Eligibility</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p v-for="line in content.fields.eligibilityZh" :key="line">{{ line }}</p>
              <p v-for="line in content.fields.eligibilityEn" :key="line">{{ line }}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 class="text-lg font-semibold text-brand-blue">\u8cbb\u7528 / Fee</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p v-for="line in content.fields.feeZh" :key="line">{{ line }}</p>
              <p v-for="line in content.fields.feeEn" :key="line">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
```

**Step 3: 其他區塊改為 props 驅動**

- `components/sections/TimelineSection.vue`：改用 `content.fields.steps` 和 `content.fields.notes`
- `components/sections/PositionsSection.vue`：改用 `content.fields.groups`
- `components/sections/InterviewSection.vue`：改用 `content.fields.descriptionZh/descriptionEn`
- `components/sections/AboutUsSection.vue`：改用 `content.fields.titleZh/titleEn`
- `components/sections/ContactSection.vue`：改用 `content.fields.titleZh/titleEn`

**Step 4: 手動驗證 UI**

Run:
```bash
npm run docs:dev
```
Expected: 原畫面保持一致，文案來源改為 runtime。

**Step 5: Commit**

```bash
git add components/HomePage.vue components/sections/ProjectIntro.vue components/sections/TimelineSection.vue components/sections/PositionsSection.vue components/sections/InterviewSection.vue components/sections/AboutUsSection.vue components/sections/ContactSection.vue

git commit -m "feat: read content from supabase store"
```

---

### Task 5: 建立簡化管理頁（共用帳號）

**Files:**
- Create: `components/admin/AdminPage.vue`
- Create: `components/admin/ContentEditor.vue`
- Create: `admin.md`

**Step 1: 寫入管理頁登入流程**

Create `components/admin/AdminPage.vue`:
```vue
<script setup lang="ts">
import { ref } from "vue"
import { supabase } from "@/lib/supabase/client"
import ContentEditor from "@/components/admin/ContentEditor.vue"

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const sessionReady = ref(false)

async function handleLogin() {
  errorMessage.value = ""
  const response = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (response.error) {
    errorMessage.value = response.error.message
    return
  }

  sessionReady.value = true
}
</script>

<template>
  <div class="section-card content-card p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-slate-900">\u5167\u5bb9\u7de8\u8f2f\u5f8c\u53f0</h1>

    <div v-if="!sessionReady" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">\u5bc6\u78bc</label>
        <input v-model="password" type="password" class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <button type="button" class="btn-primary" @click="handleLogin">\u767b\u5165</button>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <ContentEditor v-else />
  </div>
</template>
```

**Step 2: 建立內容編輯器**

Create `components/admin/ContentEditor.vue`:
```vue
<script setup lang="ts">
import { ref } from "vue"
import { supabase } from "@/lib/supabase/client"
import { defaultContent } from "@/lib/content/defaultContent"

const content = ref(defaultContent)
const status = ref("")

async function loadContent() {
  status.value = ""
  const response = await supabase.from("content_blocks").select("slug, fields")
  if (response.error) {
    status.value = response.error.message
    return
  }

  for (const record of response.data as Array<{ slug: string; fields: Record<string, unknown> }>) {
    content.value[record.slug] = { fields: record.fields }
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

  status.value = "\u5df2\u5132\u5b58\uff1a" + slug
}

loadContent()
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">\u5167\u5bb9\u8a2d\u5b9a</h2>
      <p class="text-sm text-slate-500">\u4fee\u6539\u5f8c\u5c07\u7acb\u5373\u66f4\u65b0\u524d\u7aef\u3002</p>
      <p v-if="status" class="text-sm text-slate-600">{{ status }}</p>
    </div>

    <div v-for="(block, slug) in content" :key="slug" class="section-card p-5 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ slug }}</h3>
        <button class="btn-primary" type="button" @click="saveBlock(String(slug))">\u5132\u5b58</button>
      </div>
      <div class="space-y-3">
        <div v-for="(value, key) in block.fields" :key="key">
          <label class="block text-sm font-medium text-slate-700">{{ key }}</label>
          <textarea
            v-if="Array.isArray(value) || typeof value === 'string'"
            v-model="block.fields[key]"
            class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            rows="3"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Step 3: 新增管理頁路由**

Create `admin.md`:
```md
---
title: Content Admin
---

<AdminPage />
```

**Step 4: 手動驗證管理頁**

Run:
```bash
npm run docs:dev
```
Expected: `/admin.html` 可登入並更新內容。

**Step 5: Commit**

```bash
git add components/admin/AdminPage.vue components/admin/ContentEditor.vue admin.md

git commit -m "feat: add content admin page"
```

---

### Task 6: Supabase 資料表與 RLS 規則

**Files:**
- (Supabase SQL Editor)

**Step 1: 建立資料表**

Run in Supabase SQL Editor:
```sql
create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  fields jsonb not null,
  updated_at timestamptz not null default now()
);
```

**Step 2: 啟用 RLS 並建立政策**

```sql
alter table public.content_blocks enable row level security;

create policy "allow read for all"
  on public.content_blocks
  for select
  using (true);

create policy "allow write for authenticated"
  on public.content_blocks
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

**Step 3: 建立共用帳號**

- 在 Supabase Auth 建立一組 Email/Password 帳號。
- 使用該帳號登入管理頁。

**Step 4: 初始化內容資料**

在管理頁登入後，依序按下每個區塊的「儲存」，寫入預設內容。

---

### Task 7: 文件與風險提示

**Files:**
- Modify: `docs/memory.md`

**Step 1: 更新專案記憶**

Add notes about Supabase content editing, env vars, admin route.

**Step 2: Commit**

```bash
git add docs/memory.md

git commit -m "docs: note supabase content editing"
```

---

### Task 8: 驗證清單

**Step 1: 本地驗證**

Run:
```bash
npm run docs:dev
```
Expected:
- 前端載入 Supabase 內容後更新。
- 管理頁儲存後前端即時刷新。

**Step 2: 斷線情境**

- 停止 Realtime（暫時關閉網路），前端應顯示上次快取內容。

