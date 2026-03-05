<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("timeline")
onMounted(load)

const emptyStep = { date: "", content: [], highlight: false }
const emptyNote = { icon: "", title: "", content: [] }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">時間表編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.steps"
        :empty-item="emptyStep"
        add-label="+ 新增步驟"
        label="時間步驟"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="日期" v-model="item.date" />
          <TextareaArray v-model="item.content" label="內容（每行一項）" :rows="2" />
          <AdminField label="重點標示" v-model="item.highlight" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.notes"
        :empty-item="emptyNote"
        add-label="+ 新增備註"
        label="備註說明"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="圖示" v-model="item.icon" />
          <AdminField label="標題" v-model="item.title" />
          <TextareaArray v-model="item.content" label="內容（每行一項）" :rows="2" />
        </template>
      </AdminRepeater>
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
