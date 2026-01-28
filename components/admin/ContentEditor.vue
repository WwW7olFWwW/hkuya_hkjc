<script setup lang="ts">
import { ref } from "vue"
import { supabase } from "@/lib/supabase/client"
import { defaultContent } from "@/lib/content/defaultContent"

type ContentMap = Record<string, { fields: Record<string, unknown> }>

const content = ref(defaultContent as ContentMap)
const status = ref("")

async function loadContent() {
  status.value = ""
  const response = await supabase.from("content_blocks").select("slug, fields")
  if (response.error) {
    status.value = response.error.message
    return
  }

  const records = (response.data || []) as Array<{ slug: string; fields: Record<string, unknown> }>

  for (const record of records) {
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
