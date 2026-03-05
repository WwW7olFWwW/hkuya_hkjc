<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"

const { state, load, save } = usePocketBaseContent("site_settings")
onMounted(load)

const emptyHeaderLink = { titleZh: "", titleEn: "", href: "", primary: false }
const emptyFooterQuickLink = { label: "", href: "", primary: false }
const emptyFooterSocialLink = { label: "", href: "", icon: "" }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">網站設定編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="Logo 高度（像素）" v-model="state.fields.logoHeight" type="number" />
      <AdminRepeater
        v-model="state.fields.headerLinks"
        :empty-item="emptyHeaderLink"
        add-label="+ 新增連結"
        label="頁首連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標題（中文）" v-model="item.titleZh" />
          <AdminField label="標題（英文）" v-model="item.titleEn" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="主要連結" v-model="item.primary" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.footerQuickLinks"
        :empty-item="emptyFooterQuickLink"
        add-label="+ 新增連結"
        label="頁尾快速連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標籤" v-model="item.label" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="主要連結" v-model="item.primary" type="checkbox" />
        </template>
      </AdminRepeater>
      <AdminRepeater
        v-model="state.fields.footerSocialLinks"
        :empty-item="emptyFooterSocialLink"
        add-label="+ 新增連結"
        label="頁尾社交連結"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標籤" v-model="item.label" />
          <AdminField label="連結" v-model="item.href" />
          <AdminField label="圖示" v-model="item.icon" />
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
