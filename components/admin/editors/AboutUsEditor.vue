<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"

const { state, load, save } = usePocketBaseContent("about_us")
onMounted(load)

const emptyOrganization = { role: "", name: "", logo: "", url: "" }

function handleLogoUpload(event: Event, item: Record<string, unknown>) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function (e) {
    item.logo = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">關於我們編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.organizations"
        :empty-item="emptyOrganization"
        add-label="+ 新增組織"
        label="組織列表"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="角色" v-model="item.role" />
          <AdminField label="名稱" v-model="item.name" />
          <AdminField label="Logo 路徑" v-model="item.logo" />
          <div class="mb-4">
            <input type="file" accept="image/*" class="admin-input text-sm" @change="handleLogoUpload($event, item)" />
          </div>
          <AdminField label="網址" v-model="item.url" />
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
