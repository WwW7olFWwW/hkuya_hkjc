<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("about_us")

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

function handleLogoUpload(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = function (e) {
    const dataUrl = e.target?.result as string
    if (state.fields.organizations && state.fields.organizations[index]) {
      state.fields.organizations[index].logo = dataUrl
    }
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">關於我們編輯</h2>

    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>

    <FormKit v-else type="form" v-model="state.fields" @submit="handleSave">
      <FormKit type="text" name="titleZh" label="標題（中文）" />
      <FormKit type="text" name="titleEn" label="標題（英文）" />

      <FormKit type="list" dynamic name="organizations" label="機構列表"
        add-label="+ 新增機構" :min="1">
        <FormKit type="text" name="role" label="角色" />
        <FormKit type="text" name="name" label="名稱" />
        <div class="space-y-2">
          <FormKit type="text" name="logo" label="Logo 路徑或 Base64" />
          <input type="file" accept="image/*" @change="handleLogoUpload($event, $index)" class="admin-input text-sm" />
        </div>
        <FormKit type="url" name="url" label="網址" />
      </FormKit>
    </FormKit>

    <div class="mt-4 flex gap-3">
      <button type="button" @click="handleSave" :disabled="state.saving" class="admin-action">
        {{ state.saving ? "儲存中..." : "儲存" }}
      </button>
    </div>
  </div>
</template>
