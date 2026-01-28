<script setup lang="ts">
import { Mail, Phone } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
    }
  }
}>()
</script>

<template>
  <SectionBlock id="contactus" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div class="section-card p-5 sm:p-6 md:p-8 max-w-3xl mx-auto">
        <div class="space-y-4 text-sm sm:text-base">
          <div class="flex items-center gap-3">
            <Mail class="h-5 w-5 text-brand-green" />
            <span>
              Email:
              <a href="mailto:mail@hkuya.org.hk" class="text-brand-blue hover:underline">mail@hkuya.org.hk</a>
            </span>
          </div>
          <div class="flex items-center gap-3">
            <Phone class="h-5 w-5 text-brand-green" />
            <span>Tel: 2598 9385</span>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
