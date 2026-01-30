<script setup lang="ts">
import { CalendarDays, Info } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      descriptionZh: string
      descriptionEn: string
    }
  }
}>()
</script>

<template>
  <SectionBlock id="interview" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div class="section-card content-card card-outline p-5 sm:p-6 md:p-8 bg-white/90">
        <div class="space-y-6">
          <div class="rounded-2xl card-muted p-4 sm:p-5 flex gap-3">
            <Info class="h-6 w-6 text-brand-green mt-1" />
            <div class="space-y-2 text-sm sm:text-base text-slate-700">
              <p>{{ content.fields.descriptionZh }}</p>
              <p>{{ content.fields.descriptionEn }}</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-white/80 border border-slate-200 p-4 sm:p-5 flex gap-3">
              <CalendarDays class="h-6 w-6 text-brand-green mt-1" />
              <div class="space-y-2 text-sm sm:text-base text-slate-700">
                <p class="font-semibold">第一輪面試日期 First Round Interview Date</p>
                <span class="pill-accent">29 March 2025</span>
              </div>
            </div>
            <div class="rounded-2xl bg-white/80 border border-slate-200 p-4 sm:p-5 flex gap-3">
              <CalendarDays class="h-6 w-6 text-brand-green mt-1" />
              <div class="space-y-2 text-sm sm:text-base text-slate-700">
                <p class="font-semibold">第二輪面試日期 Second Round Interview Date</p>
                <span class="pill-accent">10 May 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
