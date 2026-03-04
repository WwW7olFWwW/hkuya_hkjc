<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("positions")

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
    <h2 class="text-xl font-semibold mb-4">實習崗位編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />

      <FormKit type="repeater" name="groups" label="地區分組"
        add-label="+ 新增地區" :min="1">
        <FormKit type="text" name="location" label="地區" />
        <FormKit type="textarea" name="description" label="地區描述" :rows="2" />

        <FormKit type="repeater" name="positions" label="崗位列表"
          add-label="+ 新增崗位" :min="1">
          <FormKit type="textarea" name="companyLines"
            label="公司名稱（每行一條）" :rows="2"
            help="每行輸入一條公司名稱" />
          <FormKit type="textarea" name="roleLines"
            label="崗位名稱（每行一條）" :rows="2"
            help="每行輸入一條崗位名稱" />
          <FormKit type="textarea" name="requirements"
            label="崗位要求（每行一條）" :rows="3"
            help="每行輸入一條要求" />
          <FormKit type="textarea" name="duties"
            label="工作內容（每行一條）" :rows="3"
            help="每行輸入一條工作內容" />
        </FormKit>
      </FormKit>
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
