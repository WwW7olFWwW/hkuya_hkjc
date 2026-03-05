<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"

const { state, load, save } = usePocketBaseContent("contact")
onMounted(load)
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">聯絡方式編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminField label="電郵" v-model="state.fields.email" />
      <AdminField label="電話" v-model="state.fields.tel" />
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
