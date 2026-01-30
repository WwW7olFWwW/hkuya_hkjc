<script setup lang="ts">
import { Mail, Phone } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      email: string
      tel: string
    }
  }
}>()

function buildMailto(email: string) {
  return "mailto:" + email
}
</script>

<template>
  <SectionBlock id="contactus" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div class="section-card content-card card-outline p-5 sm:p-6 md:p-8">
        <div class="grid gap-4 text-sm sm:text-base sm:grid-cols-2">
          <div class="rounded-2xl card-muted p-4 flex items-center gap-3">
            <span class="icon-pill">
              <Mail class="h-4 w-4" />
            </span>
            <span>
              Email:
              <a :href="buildMailto(content.fields.email)" class="text-brand-blue hover:underline">
                {{ content.fields.email }}
              </a>
            </span>
          </div>
          <div class="rounded-2xl card-muted p-4 flex items-center gap-3">
            <span class="icon-pill">
              <Phone class="h-4 w-4" />
            </span>
            <span>Tel: {{ content.fields.tel }}</span>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
