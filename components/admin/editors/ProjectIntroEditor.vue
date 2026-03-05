<script setup lang="ts">
import { onMounted, ref } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"
import AdminField from "@/components/admin/fields/AdminField.vue"
import AdminRepeater from "@/components/admin/fields/AdminRepeater.vue"
import TextareaArray from "@/components/admin/fields/TextareaArray.vue"

const { state, load, save } = usePocketBaseContent("project_intro")
onMounted(load)
const uploadProgress = ref(0)
const isUploading = ref(false)

const emptyInfoCard = { titleZh: "", titleEn: "", contentZh: "", contentEn: "" }

function handlePosterUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert("圖片大小不能超過 5MB")
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  const reader = new FileReader()

  reader.onprogress = function(e) {
    if (e.lengthComputable) {
      uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }
  }

  reader.onload = function (e) {
    state.fields.posterUrl = e.target?.result as string
    isUploading.value = false
    uploadProgress.value = 0
  }

  reader.onerror = function() {
    alert("圖片上傳失敗")
    isUploading.value = false
    uploadProgress.value = 0
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">項目簡介編輯</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <AdminField label="標題（中文）" v-model="state.fields.titleZh" />
      <AdminField label="副標題（中文）" v-model="state.fields.subtitleZh" />
      <AdminField label="標題（英文）" v-model="state.fields.titleEn" />
      <AdminField label="副標題（英文）" v-model="state.fields.subtitleEn" />
      <AdminField label="描述（中文）" v-model="state.fields.descriptionZh" type="textarea" :rows="4" />
      <AdminField label="描述（英文）" v-model="state.fields.descriptionEn" type="textarea" :rows="4" />
      <AdminField label="海報圖片路徑" v-model="state.fields.posterUrl" />
      <div class="mb-4">
        <input type="file" accept="image/*" class="admin-input text-sm" @change="handlePosterUpload" :disabled="isUploading" />
        <div v-if="isUploading" class="mt-2">
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div class="bg-brand-green h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <p class="text-xs text-slate-600 mt-1">上傳中... {{ uploadProgress }}%</p>
        </div>
      </div>
      <AdminRepeater
        v-model="state.fields.infoCards"
        :empty-item="emptyInfoCard"
        add-label="+ 新增卡片"
        label="資訊卡片"
        :min="1"
      >
        <template #item="{ item }">
          <AdminField label="標題（中文）" v-model="item.titleZh" />
          <AdminField label="標題（英文）" v-model="item.titleEn" />
          <AdminField label="內容（中文）" v-model="item.contentZh" />
          <AdminField label="內容（英文）" v-model="item.contentEn" />
        </template>
      </AdminRepeater>
      <TextareaArray v-model="state.fields.eligibilityZh" label="申請資格（中文，每行一項）" :rows="3" />
      <TextareaArray v-model="state.fields.eligibilityEn" label="申請資格（英文，每行一項）" :rows="3" />
      <TextareaArray v-model="state.fields.feeZh" label="費用說明（中文，每行一項）" :rows="2" />
      <TextareaArray v-model="state.fields.feeEn" label="費用說明（英文，每行一項）" :rows="2" />
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
