<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("project_intro")

onMounted(function () {
  load()
})

async function handleSave() {
  try {
    await save()
  } catch (error) {
    console.error("儲存失敗", error)
  }
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">項目簡介編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="subtitleZh" label="副標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />
      <FormKit type="text" name="subtitleEn" label="副標題（英文）" />
      <FormKit type="textarea" name="descriptionZh" label="描述（中文）" :rows="4" />
      <FormKit type="textarea" name="descriptionEn" label="描述（英文）" :rows="4" />
      <FormKit type="text" name="posterUrl" label="海報圖片路徑" />

      <FormKit type="repeater" name="infoCards" label="資訊卡片"
        add-label="+ 新增卡片" :min="1">
        <FormKit type="text" name="titleZh" label="標題（中文）" />
        <FormKit type="text" name="titleEn" label="標題（英文）" />
        <FormKit type="text" name="contentZh" label="內容（中文）" />
        <FormKit type="text" name="contentEn" label="內容（英文）" />
      </FormKit>
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
