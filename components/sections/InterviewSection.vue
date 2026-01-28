<script setup lang="ts">
import { CalendarDays, Info } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
</script>

<template>
  <SectionBlock id="interview" tone="muted">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">面試安排 Interview Arrangement</h2>
      </div>

      <div class="section-card p-5 sm:p-6 md:p-8 max-w-3xl mx-auto bg-white">
        <div class="space-y-6">
          <div class="rounded-2xl bg-slate-50 p-4 sm:p-5 flex gap-3">
            <Info class="h-6 w-6 text-brand-green mt-1" />
            <div class="space-y-2 text-sm sm:text-base text-slate-700">
              <p>
                本會將根據實習崗位要求而為申請者安排面試（如申請者就讀之學科未能匹配崗位要求，則不獲面試資格）面試詳情將於稍後另行通知。
              </p>
              <p>
                We will arrange interviews for applicants based on the requirements of the internship position (if the subject studied by the applicant does not match the job requirements, the applicant will not be eligible for the interview). Interview details will be provided later.
              </p>
            </div>
          </div>

          <div class="rounded-2xl bg-slate-50 p-4 sm:p-5 space-y-4">
            <div class="flex items-start gap-3">
              <CalendarDays class="h-6 w-6 text-brand-green mt-1" />
              <div class="space-y-3 text-sm sm:text-base text-slate-700">
                <div class="flex flex-wrap gap-2">
                  <span class="font-semibold">第一輪面試日期 First Round Interview Date:</span>
                  <span class="font-semibold">29 March 2025</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="font-semibold">第二輪面試日期 Second Round Interview Date:</span>
                  <span class="font-semibold">10 May 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
