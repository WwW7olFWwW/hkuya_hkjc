<script setup lang="ts">
import { withBase } from "vitepress"
import { Calendar, MapPin, Users, User, ZoomIn } from "lucide-vue-next"
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Dialog, DialogTrigger, DialogScrollContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const infoItems = [
  {
    icon: Calendar,
    titleZh: '實習日期',
    titleEn: 'Internship Period',
    contentZh: '2025年6月22日至7月19日',
    contentEn: 'June 22 - July 19, 2025'
  },
  {
    icon: MapPin,
    titleZh: '實習地點',
    titleEn: 'Location',
    contentZh: '北京及大灣區（廣州和深圳）',
    contentEn: 'Beijing and Greater Bay Area (Guangzhou, Shenzhen)'
  },
  {
    icon: Users,
    titleZh: '實習崗位範疇',
    titleEn: 'Positions',
    contentZh: '科創產業',
    contentEn: 'Science, Innovation and Technology Industry'
  },
  {
    icon: User,
    titleZh: '名額',
    titleEn: 'Quota',
    contentZh: '40名',
    contentEn: '40 participants'
  }
]

function resolveAsset(path: string) {
  return withBase(path)
}
</script>

<template>
  <SectionBlock id="project-intro">
    <PageContainer>
      <div class="text-center mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          &ldquo;實踐科創·探知歷史&rdquo;2024-2025
        </h1>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">暑期實習團</p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mt-4">
          &ldquo;Reimagining History, Innovating Tomorrow&rdquo;
        </h2>
        <p class="text-xl sm:text-2xl text-brand-green font-medium mt-2">
          Summer Internship Program 2024-2025
        </p>
      </div>

      <div class="section-card p-4 sm:p-6 md:p-8 mb-10">
        <div class="grid gap-6 md:grid-cols-[320px_1fr]">
          <Dialog>
            <DialogTrigger as-child>
              <button type="button" class="relative w-full text-left">
                <img
                  :src="resolveAsset('/images/poster.webp')"
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
              <img :src="resolveAsset('/images/poster.webp')" alt="實習計劃海報" class="w-full rounded-lg" />
            </DialogScrollContent>
          </Dialog>

          <div class="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
            <p>
              &ldquo;實踐科創·探知歷史&rdquo;暑期實習計劃旨在透過實習認識創科行業，體驗不同企業的文化背景及創新科技業界的工作，同時，讓實習生在工作中學習相關的專業知識，培養他們日後投身不同領域事業的興趣。參與者將有機會在北京和大灣區（廣州、深圳）的知名企業和機構進行實習，拓展視野，增強專業能力。計劃不僅鼓勵來自不同學校的青年學子互相交流與合作，還設有一系列的增值活動，包括企業參訪、文化名勝考察以及與業界領袖及大學生的交流對話。這些活動將為參與者提供全方位的學習體驗，助力他們在職業發展上邁出堅實步伐。
            </p>
            <p>
              &ldquo;Reimagining History, Innovating Tomorrow&rdquo; Summer Internship Program 2025 aims to introduce participants to the innovation and technology industry through internships, allowing them to experience the cultural backgrounds of different companies and work in the innovative tech sector. At the same time, the program provides interns with the opportunity to acquire relevant professional knowledge and develop an interest in pursuing careers in various fields. Participants will have the chance to intern at renowned companies and organizations in Beijing and the Greater Bay Area (Guangzhou, Shenzhen), expanding their horizons and enhancing their professional capabilities. The program encourages young people from different schools to communicate and collaborate and includes a series of value-added activities, such as company visits, cultural heritage tours, and exchanges with industry leaders and university students. These activities will offer participants a comprehensive learning experience, helping them take solid steps in their career development.
            </p>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2 mt-8">
          <div class="space-y-4">
            <div
              v-for="item in infoItems.slice(0, 2)"
              :key="item.titleZh"
              class="flex items-start gap-3"
            >
              <component :is="item.icon" class="h-5 w-5 text-brand-green mt-1" />
              <div class="flex-1">
                <div class="flex justify-between text-sm font-semibold">
                  <span>{{ item.titleZh }}</span>
                  <span class="text-slate-500 font-medium">{{ item.titleEn }}</span>
                </div>
                <div class="flex justify-between text-sm mt-1">
                  <span>{{ item.contentZh }}</span>
                  <span class="text-slate-500">{{ item.contentEn }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div
              v-for="item in infoItems.slice(2)"
              :key="item.titleZh"
              class="flex items-start gap-3"
            >
              <component :is="item.icon" class="h-5 w-5 text-brand-green mt-1" />
              <div class="flex-1">
                <div class="flex justify-between text-sm font-semibold">
                  <span>{{ item.titleZh }}</span>
                  <span class="text-slate-500 font-medium">{{ item.titleEn }}</span>
                </div>
                <div class="flex justify-between text-sm mt-1">
                  <span>{{ item.contentZh }}</span>
                  <span class="text-slate-500">{{ item.contentEn }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card p-5 sm:p-7 md:p-8">
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-brand-blue">參加資格 / Eligibility</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p>a. 18 歲以上的各大院校之全日制學生或應屆畢業生</p>
              <p>b. （i）持有有效香港永久居民身份證 或（ii）持有有效香港居民身份證並在香港就讀全日制課程</p>
              <p>a. Full-time students or recent graduates from various universities who are 18 years of age or older; and</p>
              <p>b. (i) Hold a valid Hong Kong Permanent Resident Identity Card, or　(ii) Hold a valid Hong Kong Resident Identity Card and are enrolled in a full-time program in Hong Kong.</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 class="text-lg font-semibold text-brand-blue">費用 / Fee</h3>
            <div class="mt-3 space-y-1 text-sm sm:text-base text-slate-700">
              <p>團費：全免（包括來回交通、住宿、保險、交流活動等費用）</p>
              <p>按金：港幣2,500元正（順利完成整個實習計劃後全數退還，包括完成實習工作、實習報告及本會預先指定的學習任務）</p>
              <p>Fee: Free of Charge (covering accommodation, round-trip transportation, insurance, and breakfast)</p>
              <p>Deposits: HKD2,500 (fully refundable upon completion of the exchange and submission of a report and designated tasks)</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
