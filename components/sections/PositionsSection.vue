<script setup lang="ts">
import { Building2, Briefcase, MapPin, ChevronDown } from "lucide-vue-next"
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

function handleTabKeydown(event: KeyboardEvent, currentIndex: number) {
  const groups = props.content.fields.groups
  let newIndex = currentIndex

  if (event.key === "ArrowLeft") {
    event.preventDefault()
    newIndex = currentIndex > 0 ? currentIndex - 1 : groups.length - 1
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    newIndex = currentIndex < groups.length - 1 ? currentIndex + 1 : 0
  } else if (event.key === "Home") {
    event.preventDefault()
    newIndex = 0
  } else if (event.key === "End") {
    event.preventDefault()
    newIndex = groups.length - 1
  } else {
    return
  }

  setActiveIndex(newIndex)
  const newTab = document.getElementById("tab-" + newIndex)
  if (newTab) {
    newTab.focus()
  }
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
            @keydown="handleTabKeydown($event, groupIndex)"
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
          <div v-if="!hasPositions()" class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Briefcase class="h-8 w-8 text-slate-400" />
            </div>
            <h3 class="text-lg font-semibold text-slate-700 mb-2">暫無職位</h3>
            <p class="text-sm text-slate-500">更多職位正在更新中，敬請期待</p>
          </div>
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

                <details v-if="position.requirements && position.requirements.length" class="position-detail group">
                  <summary class="position-summary flex items-center justify-between">
                    <span>崗位要求 Job Requirements</span>
                    <ChevronDown class="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul class="space-y-2 text-sm text-slate-600 mt-3 pl-4">
                    <li v-for="item in position.requirements" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </details>

                <details v-if="position.duties && position.duties.length" class="position-detail group">
                  <summary class="position-summary flex items-center justify-between">
                    <span>工作內容 Job Description</span>
                    <ChevronDown class="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul class="space-y-2 text-sm text-slate-600 mt-3 pl-4">
                    <li v-for="item in position.duties" :key="item">
                      {{ item }}
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
