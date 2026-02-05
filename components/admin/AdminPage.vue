<script setup lang="ts">
import { ref } from "vue"
import { getPocketBaseClient } from "@/lib/pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "@/lib/pocketbase/collections"
import ContentEditor from "@/components/admin/ContentEditor.vue"

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const sessionReady = ref(false)

async function handleLogin() {
  errorMessage.value = ""
  const pocketbase = getPocketBaseClient()
  try {
    await pocketbase.collection(POCKETBASE_COLLECTIONS.admins).authWithPassword(email.value, password.value)
    sessionReady.value = true
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else if (typeof error === "string") {
      errorMessage.value = error
    } else {
      errorMessage.value = "登入失敗"
    }
  }
}
</script>

<template>
  <div class="section-card content-card p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-slate-900">內容編輯後台</h1>

    <div v-if="!sessionReady" class="space-y-4">
      <div>
        <label for="admin-email" class="block text-sm font-medium text-slate-700">Email</label>
        <input
          id="admin-email"
          v-model="email"
          type="email"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>
      <div>
        <label for="admin-password" class="block text-sm font-medium text-slate-700">密碼</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>
      <button type="button" class="btn-primary" @click="handleLogin">登入</button>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <ContentEditor v-else />
  </div>
</template>
