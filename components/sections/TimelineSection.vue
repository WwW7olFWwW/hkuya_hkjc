<script setup lang="ts">
import { Check, Calendar, CircleDollarSign, Hotel, ShieldCheck, Utensils, Bus, Info } from "lucide-vue-next"
import { computed } from "vue"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Separator } from "@/components/ui/separator"

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      steps: Array<{
        date: string
        content: string[]
        highlight?: boolean
      }>
      notes: Array<{
        icon: string
        title: string
        content: string[]
      }>
    }
  }
}>()

const activeIndex = computed(function () {
  const steps = props.content.fields.steps

  for (let index = 0; index < steps.length; index += 1) {
    if (steps[index].highlight) {
      return index
    }
  }

  return -1
})

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

function getStepClass(index: number) {
  if (activeIndex.value === -1) {
    return 'timeline-step timeline-step--pending'
  }
  if (index < activeIndex.value) {
    return 'timeline-step timeline-step--completed'
  }
  if (index === activeIndex.value) {
    return 'timeline-step timeline-step--active'
  }
  return 'timeline-step timeline-step--pending'
}

function showCheck(index: number) {
  return activeIndex.value !== -1 && index < activeIndex.value
}
</script>

<template>
  <SectionBlock id="project-timeline">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div class="section-card p-5 sm:p-6 md:p-8">
          <div class="timeline-stepper">
            <div
              v-for="(event, index) in content.fields.steps"
              :key="event.date"
              :class="getStepClass(index)"
            >
              <div class="timeline-circle">
                <Check v-if="showCheck(index)" class="h-4 w-4" />
              </div>
              <div class="timeline-line"></div>
              <div class="timeline-content">
                <span class="timeline-badge">
                  <Calendar class="h-3 w-3 text-brand-green" />
                  {{ event.date }}
                </span>
                <div class="timeline-event">
                  <p v-for="line in event.content" :key="line">{{ line }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card p-5 sm:p-6 md:p-8 bg-slate-50">
          <div class="flex items-center gap-2 mb-3">
            <Info class="h-5 w-5 text-brand-green" />
            <h3 class="text-lg font-semibold">備註 Note</h3>
          </div>
          <Separator class="mb-4" />
          <div class="space-y-5">
            <div v-for="detail in content.fields.notes" :key="detail.title" class="flex gap-3">
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
