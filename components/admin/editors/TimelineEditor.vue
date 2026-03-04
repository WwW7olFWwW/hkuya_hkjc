<script setup lang="ts">
import { onMounted, ref } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("timeline")
const formReady = ref(false)

function convertArraysToStrings() {
  if (!state.fields) return
  if (state.fields.steps && Array.isArray(state.fields.steps)) {
    state.fields.steps.forEach(function (step: any) {
      if (step && Array.isArray(step.content)) step.content = step.content.join('\n')
    })
  }
  if (state.fields.notes && Array.isArray(state.fields.notes)) {
    state.fields.notes.forEach(function (note: any) {
      if (note && Array.isArray(note.content)) note.content = note.content.join('\n')
    })
  }
}

onMounted(async function () {
  await load()
  convertArraysToStrings()
  formReady.value = true
})

async function handleSave() {
  try {
    const fieldsToSave = JSON.parse(JSON.stringify(state.fields))
    if (fieldsToSave.steps) {
      fieldsToSave.steps.forEach(function (step: any) {
        if (typeof step.content === 'string') step.content = step.content.split('\n').filter(Boolean)
      })
    }
    if (fieldsToSave.notes) {
      fieldsToSave.notes.forEach(function (note: any) {
        if (typeof note.content === 'string') note.content = note.content.split('\n').filter(Boolean)
      })
    }

    const originalFields = state.fields
    state.fields = fieldsToSave
    await save()
    state.fields = originalFields
  } catch (error) {
    console.error("儲存失敗", error)
  }
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">時間表編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else-if="formReady" type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />

      <FormKit type="list" dynamic name="steps" label="時間步驟"
        add-label="+ 新增步驟" :min="1">
        <FormKit type="text" name="date" label="日期" />
        <FormKit type="textarea" name="content" label="內容（每行一項）" :rows="2" />
        <FormKit type="checkbox" name="highlight" label="重點標示" />
      </FormKit>

      <FormKit type="list" dynamic name="notes" label="備註說明"
        add-label="+ 新增備註" :min="1">
        <FormKit type="text" name="icon" label="圖示" />
        <FormKit type="text" name="title" label="標題" />
        <FormKit type="textarea" name="content" label="內容（每行一項）" :rows="2" />
      </FormKit>
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
