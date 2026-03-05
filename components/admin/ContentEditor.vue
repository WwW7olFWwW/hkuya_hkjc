<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { defaultContent } from "@/lib/content/defaultContent"
import ContactEditor from "@/components/admin/editors/ContactEditor.vue"
import InterviewEditor from "@/components/admin/editors/InterviewEditor.vue"
import AboutUsEditor from "@/components/admin/editors/AboutUsEditor.vue"
import ProjectIntroEditor from "@/components/admin/editors/ProjectIntroEditor.vue"
import PositionsEditor from "@/components/admin/editors/PositionsEditor.vue"
import TimelineEditor from "@/components/admin/editors/TimelineEditor.vue"
import SiteSettingsEditor from "@/components/admin/editors/SiteSettingsEditor.vue"

const slugs = Object.keys(defaultContent)
const activeSlug = ref(slugs.length > 0 ? slugs[0] : "")
const pendingSlug = ref(activeSlug.value)

watch(pendingSlug, async function(newSlug) {
  if (newSlug !== activeSlug.value) {
    if (confirm("切換內容區塊可能會丟失未保存的更改，確定要繼續嗎？")) {
      activeSlug.value = newSlug
    } else {
      pendingSlug.value = activeSlug.value
    }
  }
})

const editorMap = {
  contact: ContactEditor,
  interview: InterviewEditor,
  about_us: AboutUsEditor,
  project_intro: ProjectIntroEditor,
  positions: PositionsEditor,
  timeline: TimelineEditor,
  site_settings: SiteSettingsEditor
}

const currentEditor = computed(function () {
  return editorMap[activeSlug.value as keyof typeof editorMap]
})
</script>

<template>
  <div class="space-y-5">
    <section class="section-card admin-subcard p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-900">內容編輯</h2>
        <p class="max-w-3xl text-sm leading-7 text-slate-600">
          選擇內容區塊，直接編輯並儲存。
        </p>
        </div>
        <a href="/" target="_blank" class="admin-action-secondary text-sm whitespace-nowrap">
          在新標籤頁預覽
        </a>
      </div>
    </section>

    <section class="admin-workspace section-card admin-card p-4">
      <div class="space-y-4">
        <div class="admin-side-block space-y-2">
          <label for="content-slug" class="admin-label">內容區塊</label>
          <select id="content-slug" v-model="pendingSlug" class="admin-input w-full text-sm">
            <option v-for="slug in slugs" :key="slug" :value="slug">{{ slug }}</option>
          </select>
        </div>

        <component :is="currentEditor" :key="activeSlug" v-if="currentEditor" />
        <div v-else class="admin-feedback admin-feedback--error">
          找不到對應的編輯器
        </div>
      </div>
    </section>
  </div>
</template>
