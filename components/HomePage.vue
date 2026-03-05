<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import ProjectIntro from "@/components/sections/ProjectIntro.vue"
import InterviewSection from "@/components/sections/InterviewSection.vue"
import TimelineSection from "@/components/sections/TimelineSection.vue"
import PositionsSection from "@/components/sections/PositionsSection.vue"
import AboutUsSection from "@/components/sections/AboutUsSection.vue"
import ContactSection from "@/components/sections/ContactSection.vue"
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue"
import { useContentStore } from "@/lib/content/store"
import { applyContentUpdate, subscribeContentChanges } from "@/lib/content/realtime"

const { contentState, load } = useContentStore()
const isReady = ref(false)
const connectionError = ref(false)
let subscription: { unsubscribe: Function } | null = null
async function initializeContent() {
  try {
    await load()
    isReady.value = true
    await setupSubscription()
  } catch (error) {
    console.error("載入內容失敗:", error)
    connectionError.value = true
  }
}

async function setupSubscription() {
  try {
    subscription = await subscribeContentChanges(function (payload) {
      contentState.value = applyContentUpdate(contentState.value, payload)
    })
    connectionError.value = false
  } catch (error) {
    console.error("訂閱失敗:", error)
    connectionError.value = true
    setTimeout(setupSubscription, 5000)
  }
}

onMounted(initializeContent)

onBeforeUnmount(function () {
  if (subscription && typeof subscription.unsubscribe === "function") {
    subscription.unsubscribe()
  }
})
</script>

<template>
  <div v-if="isReady">
    <div v-if="connectionError" class="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
      ⚠️ 實時更新連接中斷，正在重新連接...
    </div>
    <ProjectIntro :content="contentState.project_intro" />
    <InterviewSection :content="contentState.interview" />
    <TimelineSection :content="contentState.timeline" />
    <PositionsSection :content="contentState.positions" />
    <AboutUsSection :content="contentState.about_us" />
    <ContactSection :content="contentState.contact" />
  </div>
  <LoadingSpinner v-else />
</template>
