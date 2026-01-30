<script setup lang="ts">
import { Building2, Briefcase, MapPin, ChevronRight } from "lucide-vue-next"
import { computed, ref } from "vue"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

const props = defineProps<{
  content: {
    fields: {
      titleZh: string
      titleEn: string
      groups: Array<{
        location: string
        description: string
        positions: Array<{
          companyLines: string[]
          roleLines?: string[]
          requirements?: string[]
          duties?: string[]
        }>
      }>
    }
  }
}>()

const activeIndex = ref(0)

function setActiveIndex(index: number) {
  activeIndex.value = index
}

function isActiveIndex(index: number) {
  return activeIndex.value === index
}

const activeGroup = computed(function () {
  const groups = props.content.fields.groups

  if (!groups || groups.length === 0) {
    return { location: "", description: "", positions: [] }
  }

  if (activeIndex.value >= groups.length) {
    return groups[0]
  }

  return groups[activeIndex.value]
})

function hasPositions() {
  return activeGroup.value.positions.length > 0
}
</script>

<template>
  <SectionBlock id="positions" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">
          {{ content.fields.titleZh }} {{ content.fields.titleEn }}
        </h2>
      </div>

      <div data-tabs class="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div class="tabs-list" role="tablist" aria-label="Position locations">
          <button
            v-for="(group, groupIndex) in content.fields.groups"
            :key="group.location"
            type="button"
            class="tabs-button"
            :class="isActiveIndex(groupIndex) ? 'tabs-button--active' : ''"
            role="tab"
            :id="'tab-' + groupIndex"
            :aria-selected="isActiveIndex(groupIndex)"
            aria-controls="positions-panel"
            :tabindex="isActiveIndex(groupIndex) ? 0 : -1"
            @click="setActiveIndex(groupIndex)"
          >
            <div class="flex items-center gap-2">
              <MapPin class="h-5 w-5 text-brand-green" />
              <span class="font-semibold">{{ group.location }}</span>
            </div>
            <span class="text-xs text-slate-500">{{ group.description }}</span>
          </button>
        </div>

        <div
          class="section-card card-outline p-5 sm:p-6 md:p-8"
          role="tabpanel"
          id="positions-panel"
          :aria-labelledby="'tab-' + activeIndex"
          tabindex="0"
        >
          <div class="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h3 class="text-xl font-semibold text-brand-blue">{{ activeGroup.location }}</h3>
              <p class="text-sm text-slate-500 mt-1">{{ activeGroup.description }}</p>
            </div>
            <span class="position-count">{{ activeGroup.positions.length }} 個崗位</span>
          </div>

          <div v-if="!hasPositions()" class="text-center text-slate-500 py-6">
            更多職位正在更新中...
          </div>
          <div v-else class="space-y-4">
            <div v-for="(position, index) in activeGroup.positions" :key="index" class="position-card">
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <Building2 class="h-5 w-5 text-brand-green mt-1" />
                  <div>
                    <p v-for="line in position.companyLines" :key="line" class="font-semibold text-slate-800">
                      {{ line }}
                    </p>
                  </div>
                </div>

                <div v-if="position.roleLines" class="flex items-start gap-3 ml-2">
                  <Briefcase class="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <p v-for="line in position.roleLines" :key="line" class="text-slate-700">
                      {{ line }}
                    </p>
                  </div>
                </div>

                <details v-if="position.requirements && position.requirements.length" class="position-detail">
                  <summary class="position-summary">崗位要求 Job Requirements</summary>
                  <ul class="space-y-2 text-sm text-slate-600 mt-3">
                    <li v-for="item in position.requirements" :key="item" class="flex gap-2">
                      <ChevronRight class="h-4 w-4 text-slate-400 mt-0.5" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </details>

                <details v-if="position.duties && position.duties.length" class="position-detail">
                  <summary class="position-summary">工作內容 Job Description</summary>
                  <ul class="space-y-2 text-sm text-slate-600 mt-3">
                    <li v-for="item in position.duties" :key="item" class="flex gap-2">
                      <ChevronRight class="h-4 w-4 text-slate-400 mt-0.5" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
