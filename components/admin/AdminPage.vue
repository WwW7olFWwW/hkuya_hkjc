<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getPocketBaseClient } from "@/lib/pocketbase/client"
import { POCKETBASE_COLLECTIONS } from "@/lib/pocketbase/collections"
import ContentEditor from "@/components/admin/ContentEditor.vue"

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const sessionReady = ref(false)
const clientReady = ref(false)
const isLoggingIn = ref(false)

onMounted(function () {
  clientReady.value = true
})

async function handleLogin() {
  if (isLoggingIn.value) {
    return
  }
  errorMessage.value = ""
  isLoggingIn.value = true
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
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<template>
  <div class="admin-shell space-y-6">
    <section class="content-card admin-card admin-hero p-6 md:p-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div class="space-y-5">
          <p class="admin-pill">Admin Console</p>
          <div class="space-y-3">
            <h1 class="text-2xl font-semibold text-slate-900 md:text-3xl">內容編輯後台</h1>
            <p class="max-w-2xl text-sm leading-7 text-slate-600">
              集中管理內容區塊與表單 schema，儲存後會同步反映到前台。
            </p>
          </div>
          <div class="admin-metric-grid" aria-hidden="true">
            <div class="admin-metric">
              <div class="admin-metric__label">Content</div>
              <div class="admin-metric__value">Live Sync</div>
            </div>
            <div class="admin-metric">
              <div class="admin-metric__label">Schema</div>
              <div class="admin-metric__value">Versioned</div>
            </div>
            <div class="admin-metric">
              <div class="admin-metric__label">History</div>
              <div class="admin-metric__value">Rollback</div>
            </div>
          </div>
        </div>

        <div class="admin-subcard admin-login-panel p-5 md:p-6">
          <div v-if="!clientReady" class="space-y-2">
            <p class="text-sm font-medium text-slate-700">後台載入中...</p>
            <p class="text-xs text-slate-500">正在初始化登入表單。</p>
          </div>

          <form v-else-if="!sessionReady" class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label for="admin-email" class="admin-label">Email</label>
              <input
                id="admin-email"
                v-model="email"
                type="email"
                autocomplete="username"
                class="admin-input mt-1 w-full"
              />
            </div>
            <div>
              <label for="admin-password" class="admin-label">密碼</label>
              <input
                id="admin-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                class="admin-input mt-1 w-full"
              />
            </div>
            <button type="submit" class="admin-action admin-action--primary w-full" :disabled="isLoggingIn">
              {{ isLoggingIn ? "登入中..." : "登入" }}
            </button>
            <p v-if="errorMessage" class="admin-feedback admin-feedback--error" role="alert">{{ errorMessage }}</p>
          </form>

          <div v-else class="space-y-2">
            <p class="text-sm font-semibold text-slate-800">已登入管理模式</p>
            <p class="text-xs text-slate-500">可在下方直接切換 Editor / Builder 並管理內容。</p>
          </div>
        </div>
      </div>
    </section>

    <div v-if="sessionReady">
      <ContentEditor />
    </div>
  </div>
</template>
