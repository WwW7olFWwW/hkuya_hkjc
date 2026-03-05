<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("positions")
onMounted(load)

const emptyPosition = { companyLines: [], roleLines: [], requirements: [], duties: [] }
const emptyGroup = { location: "", description: "", positions: [JSON.parse(JSON.stringify(emptyPosition))] }
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">實習崗位編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminRepeater
        v-model="state.fields.groups"
        :empty-item="emptyGroup"
        add-label="+ 新增地區"
        label="地區分組"
        :min="1"
      >
        <template #item="{ item: group }">
          <AdminField label="地區" v-model="group.location" />
          <AdminField label="地區描述" v-model="group.description" type="textarea" :rows="2" />
          <AdminRepeater
            v-model="group.positions"
            :empty-item="emptyPosition"
            add-label="+ 新增崗位"
            label="崗位列表"
            :min="1"
          >
            <template #item="{ item: pos }">
              <TextareaArray v-model="pos.companyLines" label="公司名稱（每行一條）" :rows="2" />
              <TextareaArray v-model="pos.roleLines" label="崗位名稱（每行一條）" :rows="2" />
              <TextareaArray v-model="pos.requirements" label="崗位要求（每行一條）" :rows="3" />
              <TextareaArray v-model="pos.duties" label="工作內容（每行一條）" :rows="3" />
            </template>
          </AdminRepeater>
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
