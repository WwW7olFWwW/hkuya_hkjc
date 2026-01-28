<script setup lang="ts">
import { Building2, Briefcase, MapPin, ChevronRight } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { positionGroups } from "@/data/positions"
</script>

<template>
  <SectionBlock id="positions" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">實習崗位 Job Positions</h2>
      </div>

      <Accordion type="single" collapsible default-value="panel-0" class="space-y-4">
        <AccordionItem
          v-for="(group, groupIndex) in positionGroups"
          :key="group.location"
          :value="`panel-${groupIndex}`"
          class="section-card overflow-hidden"
        >
          <AccordionTrigger class="px-5 sm:px-6 py-4 bg-slate-50">
            <div class="flex flex-wrap items-center gap-2 text-left">
              <MapPin class="h-5 w-5 text-brand-green" />
              <span class="text-lg font-semibold">{{ group.location }}</span>
              <span class="text-sm text-slate-500">{{ group.description }}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="px-5 sm:px-6 py-4">
            <div v-if="group.positions.length === 0" class="text-center text-slate-500 py-6">
              更多職位正在更新中...
            </div>
            <div v-else class="space-y-5">
              <div v-for="(position, index) in group.positions" :key="index">
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

                  <div v-if="position.requirements && position.requirements.length" class="ml-10">
                    <p class="text-sm font-semibold text-slate-800 mb-2">崗位要求 Job Requirements</p>
                    <ul class="space-y-2 text-sm text-slate-600">
                      <li v-for="item in position.requirements" :key="item" class="flex gap-2">
                        <ChevronRight class="h-4 w-4 text-slate-400 mt-0.5" />
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="position.duties && position.duties.length" class="ml-10">
                    <p class="text-sm font-semibold text-slate-800 mb-2">工作內容 Job Description</p>
                    <ul class="space-y-2 text-sm text-slate-600">
                      <li v-for="item in position.duties" :key="item" class="flex gap-2">
                        <ChevronRight class="h-4 w-4 text-slate-400 mt-0.5" />
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <Separator v-if="index < group.positions.length - 1" class="my-5" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PageContainer>
  </SectionBlock>
</template>
