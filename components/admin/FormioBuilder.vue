<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import {
  fetchFormHistory,
  fetchFormSchema,
  rollbackSchema,
  saveFormSchema,
  type FormioHistoryRecord
} from "@/lib/formio/schemaStore"
import { buildFormioSchemaFromDefault } from "@/lib/formio/schemaGenerator"

type BuilderInstance = {
  schema?: Record<string, unknown>
  form?: Record<string, unknown>
  destroy?: { (): void }
}

const props = defineProps<{
  slug: string
}>()

const builderTarget = ref<HTMLElement | null>(null)
const builderInstance = ref<BuilderInstance | null>(null)
const history = ref<FormioHistoryRecord[]>([])
const status = ref("")
const isLoading = ref(false)
const hasSavedSchema = ref(false)
const currentSchema = ref<Record<string, unknown>>(buildDefaultSchema(props.slug))

function buildDefaultSchema(slug: string) {
  return {
    title: slug,
    type: "form",
    display: "form",
    components: []
  }
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

async function destroyBuilder() {
  if (builderInstance.value && typeof builderInstance.value.destroy === "function") {
    builderInstance.value.destroy()
  }
  builderInstance.value = null
}

async function mountBuilder(schema: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return
  }
  if (!builderTarget.value) {
    return
  }

  await destroyBuilder()

  const module = await import("@formio/js")
  const Formio = module.Formio
  const instance = await Formio.builder(builderTarget.value, schema, {
    display: "form"
  })

  builderInstance.value = instance as BuilderInstance
}

async function loadHistory() {
  if (!props.slug) {
    history.value = []
    return
  }
  history.value = await fetchFormHistory(props.slug, 7)
}

async function loadSchema() {
  if (!props.slug) {
    return
  }
  isLoading.value = true
  status.value = ""

  try {
    const record = await fetchFormSchema(props.slug)
    hasSavedSchema.value = !!record
    const schema = record && record.schema ? record.schema : buildDefaultSchema(props.slug)
    currentSchema.value = schema
    await mountBuilder(schema)
    await loadHistory()
  } catch (error) {
    status.value = formatErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

function getBuilderSchema() {
  if (builderInstance.value && builderInstance.value.schema) {
    return builderInstance.value.schema
  }
  if (builderInstance.value && builderInstance.value.form) {
    return builderInstance.value.form
  }
  return currentSchema.value
}

async function handleSave() {
  if (!props.slug) {
    return
  }
  status.value = ""
  const schema = getBuilderSchema()
  const version = String(Date.now())

  try {
    await saveFormSchema(props.slug, schema, version)
    status.value = "已儲存 schema：" + props.slug
    await loadHistory()
  } catch (error) {
    status.value = formatErrorMessage(error)
  }
}

async function handleGenerate() {
  if (!props.slug) {
    return
  }
  if (typeof window !== "undefined" && hasSavedSchema.value) {
    if (!window.confirm("已有 schema，重新產生將覆蓋目前 Builder 狀態，是否繼續？")) {
      return
    }
  }

  const schema = buildFormioSchemaFromDefault(props.slug)
  currentSchema.value = schema
  await mountBuilder(schema)
  status.value = "已產生初始 schema，請儲存。"
}

async function handleRollback(entry: FormioHistoryRecord) {
  if (typeof window === "undefined") {
    return
  }
  if (!window.confirm("確定要回滾至版本 " + entry.version + " ?")) {
    return
  }
  if (!window.confirm("回滾後將覆蓋目前 schema，是否再次確認？")) {
    return
  }

  status.value = ""

  try {
    await rollbackSchema(props.slug, entry)
    status.value = "已回滾：" + props.slug
    await loadSchema()
  } catch (error) {
    status.value = formatErrorMessage(error)
  }
}

onMounted(function () {
  loadSchema()
})

watch(
  function () {
    return props.slug
  },
  function () {
    loadSchema()
  }
)

onBeforeUnmount(function () {
  destroyBuilder()
})
</script>

<template>
  <div class="section-card p-6 space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold">Schema Builder</h3>
        <p class="text-sm text-slate-500">管理表單結構並儲存版本。</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          type="button"
          @click="handleGenerate"
          :disabled="isLoading"
        >
          產生初始 schema
        </button>
        <button class="btn-primary" type="button" @click="handleSave" :disabled="isLoading">
          儲存 schema
        </button>
      </div>
    </div>

    <p v-if="status" class="text-sm text-slate-600">{{ status }}</p>

    <div ref="builderTarget" class="min-h-[520px]" />

    <div class="space-y-2">
      <h4 class="text-sm font-semibold text-slate-700">最近版本</h4>
      <div v-if="history.length === 0" class="text-sm text-slate-500">尚無歷史紀錄。</div>
      <ul v-else class="space-y-2">
        <li
          v-for="entry in history"
          :key="entry.id ? entry.id : entry.version"
          class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="text-sm">
            <div class="font-medium">版本：{{ entry.version }}</div>
            <div v-if="entry.created_at" class="text-slate-500">建立時間：{{ entry.created_at }}</div>
          </div>
          <button class="btn-primary" type="button" @click="handleRollback(entry)">回滾</button>
        </li>
      </ul>
    </div>
  </div>
</template>
