<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("site_settings")

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
    <h2 class="text-xl font-semibold mb-4">網站設定編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="number" name="logoHeight" label="Logo 高度（像素）" />

      <FormKit type="repeater" name="headerLinks" label="頁首連結"
        add-label="+ 新增連結" :min="1">
        <FormKit type="text" name="titleZh" label="標題（中文）" />
        <FormKit type="text" name="titleEn" label="標題（英文）" />
        <FormKit type="text" name="href" label="連結" />
        <FormKit type="checkbox" name="primary" label="主要連結" />
      </FormKit>

      <FormKit type="repeater" name="footerQuickLinks" label="頁尾快速連結"
        add-label="+ 新增連結" :min="1">
        <FormKit type="text" name="label" label="標籤" />
        <FormKit type="text" name="href" label="連結" />
        <FormKit type="checkbox" name="primary" label="主要連結" />
      </FormKit>

      <FormKit type="repeater" name="footerSocialLinks" label="頁尾社交連結"
        add-label="+ 新增連結" :min="1">
        <FormKit type="text" name="label" label="標籤" />
        <FormKit type="text" name="href" label="連結" />
        <FormKit type="text" name="icon" label="圖示" />
      </FormKit>
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
