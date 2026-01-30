<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

interface Organization {
  name: string
  logo?: string
  url?: string
  role: string
}

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      organizations?: Organization[]
    }
  }
}>()

const organizations = computed(function () {
  return props.content.fields.organizations || []
})

function resolveAsset(path: string) {
  return withBase(path)
}
</script>

<template>
  <SectionBlock id="about">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="org in organizations" :key="org.role" class="section-card p-5 flex flex-col items-center text-center min-h-[220px]">
          <span class="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-blue">
            {{ org.role }}
          </span>

          <div class="flex-1 flex items-center justify-center w-full">
            <div v-if="org.logo" class="mt-5">
              <a v-if="org.url" :href="org.url" target="_blank" rel="noopener noreferrer" class="inline-flex">
                <img :src="resolveAsset(org.logo)" :alt="org.name" class="h-20 w-auto object-contain" />
              </a>
              <img v-else :src="resolveAsset(org.logo)" :alt="org.name" class="h-20 w-auto object-contain" />
            </div>
            <div v-else class="mt-5 text-brand-blue font-bold leading-tight">
              <p v-if="org.name">{{ org.name }}</p>
            </div>
          </div>

          <p v-if="org.logo && org.name" class="mt-4 text-sm font-semibold text-brand-blue">{{ org.name }}</p>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
