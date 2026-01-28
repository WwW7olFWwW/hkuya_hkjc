<script setup lang="ts">
import { withBase } from "vitepress"
import { Calendar, ZoomIn } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Dialog, DialogTrigger, DialogScrollContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

defineProps<{
  content: {
    fields: {
      titleZh: string
      subtitleZh: string
      titleEn: string
      subtitleEn: string
      descriptionZh: string
      descriptionEn: string
      posterUrl: string
      infoCards: Array<{
        titleZh: string
        titleEn: string
        contentZh: string
        contentEn: string
      }>
      eligibilityZh: string[]
      eligibilityEn: string[]
      feeZh: string[]
      feeEn: string[]
    }
  }
}>()

function resolveAsset(path: string) {
  return withBase(path)
}
</script>

<template>
  <SectionBlock id="project-intro">
    <PageContainer>
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          {{ content.fields.titleZh }}
        </h1>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">
          {{ content.fields.subtitleZh }}
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mt-4">
          {{ content.fields.titleEn }}
        </h2>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">
          {{ content.fields.subtitleEn }}
        </p>
      </div>

      <div class="section-card p-4 sm:p-6 md:p-8 mb-10">
        <div class="grid gap-6 md:grid-cols-[320px_1fr]">
          <Dialog>
            <DialogTrigger as-child>
              <button type="button" class="relative w-full text-left">
                <img
                  :src="resolveAsset(content.fields.posterUrl)"
                  alt="實習計劃海報"
                  class="w-full rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.02]"
                />
                <span class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-slate-700 shadow">
                  <ZoomIn class="h-4 w-4" />
                  放大查看
                </span>
              </button>
            </DialogTrigger>
            <DialogScrollContent class="max-w-5xl">
              <img :src="resolveAsset(content.fields.posterUrl)" alt="實習計劃海報" class="w-full rounded-lg" />
            </DialogScrollContent>
          </Dialog>

          <div class="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
            <p>{{ content.fields.descriptionZh }}</p>
            <p>{{ content.fields.descriptionEn }}</p>
          </div>
        </div>

        <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 mt-8">
          <div
            v-for="item in content.fields.infoCards"
            :key="item.titleZh"
            class="section-card p-4 sm:p-5"
          >
            <div class="flex items-start gap-3">
              <component :is="Calendar" class="h-5 w-5 text-brand-green mt-1" />
              <div class="flex-1">
                <div class="flex items-center justify-between text-sm font-semibold">
                  <span>{{ item.titleZh }}</span>
                  <span class="text-slate-500 font-medium">{{ item.titleEn }}</span>
                </div>
                <div class="mt-2 text-base font-semibold text-slate-900">
                  {{ item.contentZh }}
                </div>
                <div class="text-sm text-slate-500">
                  {{ item.contentEn }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card content-card p-5 sm:p-7 md:p-8">
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-brand-blue">參加資格 / Eligibility</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p v-for="line in content.fields.eligibilityZh" :key="line">{{ line }}</p>
              <p v-for="line in content.fields.eligibilityEn" :key="line">{{ line }}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 class="text-lg font-semibold text-brand-blue">費用 / Fee</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p v-for="line in content.fields.feeZh" :key="line">{{ line }}</p>
              <p v-for="line in content.fields.feeEn" :key="line">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
