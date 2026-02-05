<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { getPocketBaseClient } from "@/lib/pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "@/lib/pocketbase/collections"
import { defaultContent } from "@/lib/content/defaultContent"
import { fetchFormSchema } from "@/lib/formio/schemaStore"
import { mapSubmissionToContent } from "@/lib/formio/mapSubmission"
import { resolveFormioFacade } from "@/lib/formio/resolveFormio"
import { applyFormioAssets } from "@/lib/formio/formioAssets"
import { loadFormioModule } from "@/lib/formio/loadFormio"

type FormInstance = {
  submission?: unknown
  destroy?: { (): void }
}

type ContentRecord = {
  id?: string
  fields?: Record<string, unknown> | null
}

const props = defineProps<{
  slug: string
}>()

const formTarget = ref<HTMLElement | null>(null)
const formInstance = ref<FormInstance | null>(null)
const status = ref("")
const isLoading = ref(false)
const templateFields = ref<Record<string, unknown> | null>(null)

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "未知錯誤"
}

function cloneDefaultFields(slug: string) {
  const entry = defaultContent[slug as keyof typeof defaultContent]
  if (!entry) {
    return {}
  }
  return JSON.parse(JSON.stringify(entry.fields)) as Record<string, unknown>
}

function mergeFields(
  baseFields: Record<string, unknown>,
  incomingFields: Record<string, unknown> | null | undefined
) {
  const merged: Record<string, unknown> = {}
  const baseKeys = Object.keys(baseFields)

  for (const key of baseKeys) {
    merged[key] = baseFields[key]
  }

  if (!incomingFields) {
    return merged
  }

  const incomingKeys = Object.keys(incomingFields)
  for (const key of incomingKeys) {
    merged[key] = incomingFields[key]
  }

  return merged
}

function isNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }
  if (!("status" in error)) {
    return false
  }
  return (error as { status?: number }).status === 404
}

function buildSlugFilter(slug: string) {
  const safeSlug = slug.replace(/\"/g, "\\\"")
  return "slug = \"" + safeSlug + "\""
}

async function fetchContentRecord(slug: string) {
  const pocketbase = getPocketBaseClient()
  try {
    const record = await pocketbase
      .collection(POCKETBASE_COLLECTIONS.contentBlocks)
      .getFirstListItem(buildSlugFilter(slug), { fields: "id,slug,fields" })
    return record as ContentRecord
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

async function upsertContentRecord(slug: string, fields: Record<string, unknown>) {
  const pocketbase = getPocketBaseClient()
  const record = await fetchContentRecord(slug)

  if (record && record.id) {
    await pocketbase
      .collection(POCKETBASE_COLLECTIONS.contentBlocks)
      .update(record.id, { slug: slug, fields: fields })
    return
  }

  await pocketbase.collection(POCKETBASE_COLLECTIONS.contentBlocks).create({ slug: slug, fields: fields })
}

async function destroyForm() {
  if (formInstance.value && typeof formInstance.value.destroy === "function") {
    formInstance.value.destroy()
  }
  formInstance.value = null
}

async function mountForm(schema: Record<string, unknown>, data: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return
  }
  if (!formTarget.value) {
    return
  }

  await destroyForm()

  const module = await loadFormioModule()
  const Formio = resolveFormioFacade(module as unknown)

  if (!Formio || typeof Formio.createForm !== "function") {
    throw new Error("Formio.createForm is not available.")
  }

  applyFormioAssets(Formio, import.meta.env.BASE_URL || "/")

  const instance = await Formio.createForm(formTarget.value, schema, {
    noAlerts: true
  })

  instance.submission = {
    data: data
  }

  formInstance.value = instance as FormInstance
}

function extractSubmissionData(submission: unknown) {
  if (submission && typeof submission === "object" && !Array.isArray(submission)) {
    const record = submission as Record<string, unknown>
    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as Record<string, unknown>
    }
  }
  return {}
}

async function loadContentFields(slug: string) {
  const baseFields = cloneDefaultFields(slug)
  templateFields.value = baseFields

  const record = await fetchContentRecord(slug)
  return mergeFields(baseFields, record ? record.fields : null)
}

async function loadEditor() {
  if (!props.slug) {
    return
  }

  isLoading.value = true
  status.value = ""

  try {
    const schemaRecord = await fetchFormSchema(props.slug)
    if (!schemaRecord || !schemaRecord.schema) {
      await destroyForm()
      status.value = "尚未建立 schema"
      return
    }

    const fields = await loadContentFields(props.slug)
    await mountForm(schemaRecord.schema as Record<string, unknown>, fields)
  } catch (error) {
    status.value = formatErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

async function handleSave() {
  if (!props.slug) {
    return
  }
  if (!formInstance.value) {
    return
  }

  status.value = ""
  const submissionData = extractSubmissionData(formInstance.value.submission)
  const template = templateFields.value ? templateFields.value : {}
  const mapped = mapSubmissionToContent(submissionData, template)
  try {
    await upsertContentRecord(props.slug, mapped)
    status.value = "已儲存：" + props.slug
  } catch (error) {
    status.value = formatErrorMessage(error)
  }
}

onMounted(function () {
  loadEditor()
})

watch(
  function () {
    return props.slug
  },
  function () {
    loadEditor()
  }
)

onBeforeUnmount(function () {
  destroyForm()
})
</script>

<template>
  <div class="section-card p-6 space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold">Content Editor</h3>
        <p class="text-sm text-slate-500">目前選擇：{{ props.slug }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-primary" type="button" @click="handleSave" :disabled="isLoading">
          儲存內容
        </button>
      </div>
    </div>

    <p v-if="status" class="text-sm text-slate-600">{{ status }}</p>

    <div ref="formTarget" class="min-h-[420px]" />
  </div>
</template>
