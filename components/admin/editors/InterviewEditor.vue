<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("interview")

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
    <h2 class="text-xl font-semibold mb-4">面試安排編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />
      <FormKit type="textarea" name="descriptionZh" label="描述（中文）" :rows="3" />
      <FormKit type="textarea" name="descriptionEn" label="描述（英文）" :rows="3" />
      <FormKit type="text" name="firstRoundLabel" label="第一輪面試標籤" />
      <FormKit type="text" name="firstRoundDate" label="第一輪面試日期" />
      <FormKit type="text" name="secondRoundLabel" label="第二輪面試標籤" />
      <FormKit type="text" name="secondRoundDate" label="第二輪面試日期" />
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
