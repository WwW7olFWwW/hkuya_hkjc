<script setup lang="ts">
import { ref } from "vue"
import { defaultContent } from "@/lib/content/defaultContent"
import { fetchAllFormSchemas, saveFormSchema } from "@/lib/formio/schemaStore"
import { buildAllFormioSchemasFromDefault } from "@/lib/formio/schemaGenerator"
import FormioBuilder from "@/components/admin/FormioBuilder.vue"
import FormioEditor from "@/components/admin/FormioEditor.vue"

const slugs = Object.keys(defaultContent)
const activeSlug = ref(slugs.length > 0 ? slugs[0] : "")
const viewMode = ref<"editor" | "builder">("editor")
const batchStatus = ref("")
const isBatchSaving = ref(false)

function setViewMode(mode: "editor" | "builder") {
  viewMode.value = mode
}

function isActive(mode: "editor" | "builder") {
  return viewMode.value === mode
}

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "未知錯誤"
}

async function handleGenerateAllSchemas(mode: "all" | "missing") {
  if (isBatchSaving.value) {
    return
  }

  if (typeof window !== "undefined") {
    const confirmed =
      mode === "missing"
        ? window.confirm("只建立缺少的 schema，是否繼續？")
        : window.confirm("將為所有區塊產生並儲存 schema（可能覆蓋現有版本），是否繼續？")
    if (!confirmed) {
      return
    }
  }

  const entries = buildAllFormioSchemasFromDefault()
  if (entries.length === 0) {
    batchStatus.value = "沒有可產生的 schema。"
    return
  }

  let targets = entries
  if (mode === "missing") {
    const existing = await fetchAllFormSchemas()
    const existingSlugs = new Set<string>()
    for (const row of existing) {
      if (row && row.slug) {
        existingSlugs.add(row.slug)
      }
    }
    targets = []
    for (const entry of entries) {
      if (!existingSlugs.has(entry.slug)) {
        targets.push(entry)
      }
    }
  }

  if (targets.length === 0) {
    batchStatus.value = mode === "missing" ? "沒有缺少的 schema。" : "沒有可產生的 schema。"
    return
  }

  isBatchSaving.value = true
  batchStatus.value = ""
  let savedCount = 0
  const errors: string[] = []

  for (const entry of targets) {
    const version = String(Date.now())
    try {
      await saveFormSchema(entry.slug, entry.schema as Record<string, unknown>, version)
      savedCount += 1
      batchStatus.value = "已儲存 " + savedCount + " / " + targets.length
    } catch (error) {
      errors.push(entry.slug + ": " + formatErrorMessage(error))
    }
  }

  if (errors.length > 0) {
    batchStatus.value = "完成，但有錯誤：" + errors.join("; ")
  } else {
    batchStatus.value = "已完成，全部 " + targets.length + " 個 schema"
  }

  isBatchSaving.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-lg font-semibold">內容設定</h2>
      <p class="text-sm text-slate-500">修改後將立即更新前端。</p>
    </div>

    <div class="section-card p-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label for="content-slug" class="text-sm font-medium text-slate-700">內容區塊</label>
          <select
            id="content-slug"
            v-model="activeSlug"
            class="rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option v-for="slug in slugs" :key="slug" :value="slug">{{ slug }}</option>
          </select>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            :disabled="isBatchSaving"
            @click="handleGenerateAllSchemas('all')"
          >
            批次產生並儲存
          </button>
          <button
            type="button"
            class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            :disabled="isBatchSaving"
            @click="handleGenerateAllSchemas('missing')"
          >
            只建立缺少的
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-2 text-sm font-medium transition"
            :class="
              isActive('editor')
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            "
            @click="setViewMode('editor')"
          >
            Content Editor
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-2 text-sm font-medium transition"
            :class="
              isActive('builder')
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            "
            @click="setViewMode('builder')"
          >
            Schema Builder
          </button>
        </div>
      </div>
      <p v-if="batchStatus" class="mt-3 text-sm text-slate-600">{{ batchStatus }}</p>
    </div>

    <FormioEditor v-if="viewMode === 'editor'" :slug="activeSlug" />
    <FormioBuilder v-else :slug="activeSlug" />
  </div>
</template>
