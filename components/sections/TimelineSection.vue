<script setup lang="ts">
import { Calendar, CircleDollarSign, Hotel, ShieldCheck, Utensils, Bus, Info } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Separator } from "@/components/ui/separator"
import { timelineEvents, projectDetails } from "@/data/timeline"

function getDetailIcon(key: string) {
  if (key === 'money') {
    return CircleDollarSign
  }
  if (key === 'hotel') {
    return Hotel
  }
  if (key === 'shield') {
    return ShieldCheck
  }
  if (key === 'meal') {
    return Utensils
  }
  if (key === 'bus') {
    return Bus
  }
  return Info
}
</script>

<template>
  <SectionBlock id="project-timeline">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">時間表 Timeline</h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div class="section-card p-5 sm:p-6 md:p-8">
          <ul class="relative border-l border-slate-200 pl-6 space-y-6">
            <li v-for="event in timelineEvents" :key="event.date" class="relative">
              <span
                :class="[
                  'absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2',
                  event.highlight ? 'bg-brand-green border-brand-green' : 'bg-white border-slate-300'
                ]"
              >
                <Calendar class="h-3 w-3 text-white" v-if="event.highlight" />
              </span>
              <div
                :class="[
                  'rounded-xl p-4',
                  event.highlight ? 'bg-brand-light/70 border border-brand-border' : 'bg-transparent'
                ]"
              >
                <h3 class="text-sm sm:text-base font-semibold text-slate-800 mb-2">
                  {{ event.date }}
                </h3>
                <div class="space-y-1 text-sm text-slate-700">
                  <p v-for="line in event.content" :key="line">{{ line }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="section-card p-5 sm:p-6 md:p-8 bg-slate-50">
          <div class="flex items-center gap-2 mb-3">
            <Info class="h-5 w-5 text-brand-green" />
            <h3 class="text-lg font-semibold">備註 Note</h3>
          </div>
          <Separator class="mb-4" />
          <div class="space-y-5">
            <div v-for="detail in projectDetails" :key="detail.title" class="flex gap-3">
              <component :is="getDetailIcon(detail.icon)" class="h-6 w-6 text-brand-green" />
              <div>
                <p class="font-semibold text-slate-800 mb-1">{{ detail.title }}</p>
                <div class="space-y-1 text-sm text-slate-700">
                  <p v-for="line in detail.content" :key="line">{{ line }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
