<script setup lang="ts">
import { ref } from "vue"
import { defaultContent } from "@/lib/content/defaultContent"
import { fetchAllFormSchemas, saveFormSchema } from "@/lib/formio/schemaStore"
import { buildAllFormioSchemasFromDefault } from "@/lib/formio/schemaGenerator"
import { enhanceSchemaForAdmin } from "@/lib/formio/enhanceSchemaForAdmin"
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
      const enhancedSchema = enhanceSchemaForAdmin(entry.slug, entry.schema as Record<string, unknown>)
      await saveFormSchema(entry.slug, enhancedSchema as Record<string, unknown>, version)
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
  <div class="space-y-5">
    <section class="section-card admin-subcard p-5">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-900">內容設定</h2>
        <p class="max-w-3xl text-sm leading-7 text-slate-600">
          左側設定區塊與模式，右側直接編輯內容或 schema。儲存後前台會同步更新。
        </p>
      </div>
    </section>

    <section class="admin-workspace section-card admin-card p-4">
      <div class="admin-workspace-grid">
        <aside class="admin-workspace-side space-y-4">
          <div class="admin-side-block space-y-2">
            <label for="content-slug" class="admin-label">內容區塊</label>
            <select id="content-slug" v-model="activeSlug" class="admin-input w-full text-sm">
              <option v-for="slug in slugs" :key="slug" :value="slug">{{ slug }}</option>
            </select>
            <p class="admin-status-chip text-sm">
              目前區塊：<span class="font-semibold text-slate-800">{{ activeSlug }}</span>
            </p>
          </div>

          <div class="admin-side-block space-y-2">
            <p class="admin-side-title">工作模式</p>
            <div class="admin-tabs admin-tabs--stack">
              <button
                type="button"
                class="h-11 w-full"
                :class="isActive('editor') ? 'admin-tab admin-tab--active' : 'admin-tab'"
                @click="setViewMode('editor')"
              >
                Content Editor
              </button>
              <button
                type="button"
                class="h-11 w-full"
                :class="isActive('builder') ? 'admin-tab admin-tab--active' : 'admin-tab'"
                @click="setViewMode('builder')"
              >
                Schema Builder
              </button>
            </div>
          </div>

          <div class="admin-side-block space-y-2">
            <p class="admin-side-title">Schema 工具</p>
            <button
              type="button"
              class="admin-action admin-action--secondary w-full"
              :disabled="isBatchSaving"
              @click="handleGenerateAllSchemas('all')"
            >
              批次產生並儲存
            </button>
            <button
              type="button"
              class="admin-action admin-action--subtle w-full"
              :disabled="isBatchSaving"
              @click="handleGenerateAllSchemas('missing')"
            >
              只建立缺少的
            </button>
          </div>

          <p v-if="batchStatus" class="admin-feedback" aria-live="polite">{{ batchStatus }}</p>
        </aside>

        <section class="admin-workspace-main space-y-4">
          <div class="admin-main-head">
            <h3 class="text-base font-semibold text-slate-900">
              {{ isActive('editor') ? "Content Editor" : "Schema Builder" }}
            </h3>
            <p class="text-sm text-slate-500">
              {{ isActive('editor') ? "編輯並儲存內容資料。" : "管理表單結構與歷史版本。" }}
            </p>
          </div>

          <FormioEditor v-if="viewMode === 'editor'" :slug="activeSlug" />
          <FormioBuilder v-else :slug="activeSlug" />
        </section>
      </div>
    </section>
  </div>
</template>
