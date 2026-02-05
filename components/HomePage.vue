<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import ProjectIntro from "@/components/sections/ProjectIntro.vue"
import InterviewSection from "@/components/sections/InterviewSection.vue"
import TimelineSection from "@/components/sections/TimelineSection.vue"
import PositionsSection from "@/components/sections/PositionsSection.vue"
import AboutUsSection from "@/components/sections/AboutUsSection.vue"
import ContactSection from "@/components/sections/ContactSection.vue"
import { useContentStore } from "@/lib/content/store"
import { applyContentUpdate, subscribeContentChanges } from "@/lib/content/realtime"

const { contentState, load } = useContentStore()
const isReady = ref(false)
let subscription: { unsubscribe: Function } | null = null

onMounted(async function () {
  await load()
  isReady.value = true
  subscription = await subscribeContentChanges(function (payload) {
    contentState.value = applyContentUpdate(contentState.value, payload)
  })
})

onBeforeUnmount(function () {
  if (subscription && typeof subscription.unsubscribe === "function") {
    subscription.unsubscribe()
  }
})
</script>

<template>
  <div v-if="isReady">
    <ProjectIntro :content="contentState.project_intro" />
    <InterviewSection :content="contentState.interview" />
    <TimelineSection :content="contentState.timeline" />
    <PositionsSection :content="contentState.positions" />
    <AboutUsSection :content="contentState.about_us" />
    <ContactSection :content="contentState.contact" />
  </div>
  <div v-else class="py-16 text-center text-sm text-slate-500">
    內容載入中...
  </div>
</template>
