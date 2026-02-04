<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { getSupabaseClient } from "@/lib/supabase/client"
import { defaultContent } from "@/lib/content/defaultContent"
import { fetchFormSchema } from "@/lib/formio/schemaStore"
import { mapSubmissionToContent } from "@/lib/formio/mapSubmission"

type FormInstance = {
  submission?: unknown
  destroy?: { (): void }
}

type FormioFacade = {
  createForm?: {
    (element: HTMLElement, schema: Record<string, unknown>, options: Record<string, unknown>): Promise<unknown>
  }
}

type FormioModule = FormioFacade & {
  Formio?: FormioFacade
  default?: FormioFacade
}

type ContentRecord = {
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

function resolveFormio(module: FormioModule) {
  if (module.Formio) {
    return module.Formio
  }
  if (module.default) {
    return module.default
  }
  return module
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

  const module = await import("@formio/js/dist/formio.full.js")
  const Formio = resolveFormio(module as FormioModule)
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

  const supabase = getSupabaseClient()
  const response = await supabase
    .from("content_blocks")
    .select("fields")
    .eq("slug", slug)
    .maybeSingle()

  if (response.error) {
    throw response.error
  }

  const record = response.data as ContentRecord | null
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

  const supabase = getSupabaseClient()
  const response = await supabase
    .from("content_blocks")
    .upsert({ slug: props.slug, fields: mapped }, { onConflict: "slug" })

  if (response.error) {
    status.value = response.error.message
    return
  }

  status.value = "已儲存：" + props.slug
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
