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
const content = ref(cloneContent())
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
