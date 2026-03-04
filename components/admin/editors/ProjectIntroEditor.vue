<script setup lang="ts">
import { onMounted, ref } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("project_intro")
const formReady = ref(false)

function convertArraysToStrings() {
  if (!state.fields) return
  if (Array.isArray(state.fields.eligibilityZh)) state.fields.eligibilityZh = state.fields.eligibilityZh.join('\n')
  if (Array.isArray(state.fields.eligibilityEn)) state.fields.eligibilityEn = state.fields.eligibilityEn.join('\n')
  if (Array.isArray(state.fields.feeZh)) state.fields.feeZh = state.fields.feeZh.join('\n')
  if (Array.isArray(state.fields.feeEn)) state.fields.feeEn = state.fields.feeEn.join('\n')
}

onMounted(async function () {
  await load()
  convertArraysToStrings()
  formReady.value = true
})

async function handleSave() {
  try {
    const fieldsToSave = JSON.parse(JSON.stringify(state.fields))
    if (typeof fieldsToSave.eligibilityZh === 'string') fieldsToSave.eligibilityZh = fieldsToSave.eligibilityZh.split('\n').filter(Boolean)
    if (typeof fieldsToSave.eligibilityEn === 'string') fieldsToSave.eligibilityEn = fieldsToSave.eligibilityEn.split('\n').filter(Boolean)
    if (typeof fieldsToSave.feeZh === 'string') fieldsToSave.feeZh = fieldsToSave.feeZh.split('\n').filter(Boolean)
    if (typeof fieldsToSave.feeEn === 'string') fieldsToSave.feeEn = fieldsToSave.feeEn.split('\n').filter(Boolean)

    const originalFields = state.fields
    state.fields = fieldsToSave
    await save()
    state.fields = originalFields
  } catch (error) {
    console.error("儲存失敗", error)
  }
}

function handlePosterUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = function (e) {
    const dataUrl = e.target?.result as string
    state.fields.posterUrl = dataUrl
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">項目簡介編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else-if="formReady" type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="subtitleZh" label="副標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />
      <FormKit type="text" name="subtitleEn" label="副標題（英文）" />
      <FormKit type="textarea" name="descriptionZh" label="描述（中文）" :rows="4" />
      <FormKit type="textarea" name="descriptionEn" label="描述（英文）" :rows="4" />
      <div class="space-y-2">
        <FormKit type="text" name="posterUrl" label="海報圖片路徑或 Base64" />
        <input type="file" accept="image/*" @change="handlePosterUpload" class="admin-input text-sm" />
      </div>

      <FormKit type="list" dynamic name="infoCards" label="資訊卡片"
        add-label="+ 新增卡片" :min="1">
        <FormKit type="text" name="titleZh" label="標題（中文）" />
        <FormKit type="text" name="titleEn" label="標題（英文）" />
        <FormKit type="text" name="contentZh" label="內容（中文）" />
        <FormKit type="text" name="contentEn" label="內容（英文）" />
      </FormKit>

      <FormKit type="textarea" name="eligibilityZh" label="申請資格（中文，每行一項）" :rows="3" />
      <FormKit type="textarea" name="eligibilityEn" label="申請資格（英文，每行一項）" :rows="3" />
      <FormKit type="textarea" name="feeZh" label="費用說明（中文，每行一項）" :rows="2" />
      <FormKit type="textarea" name="feeEn" label="費用說明（英文，每行一項）" :rows="2" />
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
