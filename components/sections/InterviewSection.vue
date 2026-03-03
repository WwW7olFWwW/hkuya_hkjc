<script setup lang="ts">
import { computed } from "vue"
import { CalendarDays, Info } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

type InterviewLabel = {
  zh: string
  en: string
}

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      descriptionZh: string
      descriptionEn: string
      firstRoundLabel: string
      firstRoundDate: string
      secondRoundLabel: string
      secondRoundDate: string
    }
  }
}>()

function splitInterviewLabel(label: string): InterviewLabel {
  const safeLabel = label ? label.trim() : ""
  if (!safeLabel) {
    return {
      zh: "",
      en: ""
    }
  }

  const rawLines = safeLabel.split(/\r?\n/)
  const lines: string[] = []
  for (const rawLine of rawLines) {
    const line = rawLine.trim()
    if (line) {
      lines.push(line)
    }
  }

  if (lines.length >= 2) {
    return {
      zh: lines[0],
      en: lines[1]
    }
  }

  const englishStart = safeLabel.search(/[A-Za-z]/)
  if (englishStart === -1) {
    return {
      zh: safeLabel,
      en: ""
    }
  }

  return {
    zh: safeLabel.slice(0, englishStart).trim(),
    en: safeLabel.slice(englishStart).trim()
  }
}

const firstRoundLabel = computed(function () {
  return splitInterviewLabel(props.content.fields.firstRoundLabel)
})

const secondRoundLabel = computed(function () {
  return splitInterviewLabel(props.content.fields.secondRoundLabel)
})
</script>

<template>
  <SectionBlock id="interview" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ props.content.fields.titleZh }} {{ props.content.fields.titleEn }}
        </h2>
      </div>

      <div class="section-card content-card card-outline p-5 sm:p-6 md:p-8 bg-white/90">
        <div class="space-y-6">
          <div class="rounded-2xl card-muted p-4 sm:p-5 flex gap-3">
            <Info class="h-6 w-6 text-brand-green mt-1" />
            <div class="space-y-2 text-sm sm:text-base text-slate-700">
              <p>{{ props.content.fields.descriptionZh }}</p>
              <p>{{ props.content.fields.descriptionEn }}</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-white/80 border border-slate-200 p-4 sm:p-5 flex gap-3">
              <CalendarDays class="h-6 w-6 text-brand-green mt-1" />
              <div class="space-y-2 text-sm sm:text-base text-slate-700">
                <p class="font-semibold leading-snug">
                  <span class="block">{{ firstRoundLabel.zh }}</span>
                  <span v-if="firstRoundLabel.en" class="block text-slate-500 font-medium">{{ firstRoundLabel.en }}</span>
                </p>
                <span class="pill-accent">{{ props.content.fields.firstRoundDate }}</span>
              </div>
            </div>
            <div class="rounded-2xl bg-white/80 border border-slate-200 p-4 sm:p-5 flex gap-3">
              <CalendarDays class="h-6 w-6 text-brand-green mt-1" />
              <div class="space-y-2 text-sm sm:text-base text-slate-700">
                <p class="font-semibold leading-snug">
                  <span class="block">{{ secondRoundLabel.zh }}</span>
                  <span
                    v-if="secondRoundLabel.en"
                    class="block text-slate-500 font-medium"
                  >{{ secondRoundLabel.en }}</span>
                </p>
                <span class="pill-accent">{{ props.content.fields.secondRoundDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
