<script setup lang="ts">
import { ref } from "vue"
import { defaultContent } from "@/lib/content/defaultContent"
import FormioBuilder from "@/components/admin/FormioBuilder.vue"
import FormioEditor from "@/components/admin/FormioEditor.vue"

const slugs = Object.keys(defaultContent)
const activeSlug = ref(slugs.length > 0 ? slugs[0] : "")
const viewMode = ref<"editor" | "builder">("editor")

function setViewMode(mode: "editor" | "builder") {
  viewMode.value = mode
}

function isActive(mode: "editor" | "builder") {
  return viewMode.value === mode
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
    </div>

    <FormioEditor v-if="viewMode === 'editor'" :slug="activeSlug" />
    <FormioBuilder v-else :slug="activeSlug" />
  </div>
</template>
