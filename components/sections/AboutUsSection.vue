<script setup lang="ts">
import SectionBlock from "@/components/layout/SectionBlock.vue"
import PageContainer from "@/components/layout/PageContainer.vue"

interface Organization {
  name: string
  logo?: string
  url?: string
  role: string
}

const organizations: Organization[] = [
  {
    name: "",
    logo: "/images/logo.png",
    url: "https://www.hkuya.org.hk/",
    role: "承辦單位 Organizer"
  },
  {
    name: "",
    logo: "/images/hkjc_140_bi_tc_logo_cmyk_coated_full_colour_ol.png",
    url: "https://www.hkjc.com/",
    role: "贊助單位 Sponsor"
  },
  {
    name: "中央政府駐港聯絡辦青年工作部",
    role: "支持單位 Support Unit"
  }
]
</script>

<template>
  <SectionBlock id="about">
    <PageContainer>
      <div class="text-center mb-8">
        <h2 class="section-title text-2xl sm:text-3xl">關於我們 About us</h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="org in organizations" :key="org.role" class="section-card p-5 flex flex-col items-center text-center min-h-[220px]">
          <span class="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-blue">
            {{ org.role }}
          </span>

          <div class="flex-1 flex items-center justify-center w-full">
            <div v-if="org.logo" class="mt-5">
              <a v-if="org.url" :href="org.url" target="_blank" rel="noopener noreferrer" class="inline-flex">
                <img :src="org.logo" :alt="org.name" class="h-20 w-auto object-contain" />
              </a>
              <img v-else :src="org.logo" :alt="org.name" class="h-20 w-auto object-contain" />
            </div>
            <div v-else class="mt-5 text-brand-blue font-bold leading-tight">
              <p>中央政府駐港聯絡辦</p>
              <p>青年工作部</p>
            </div>
          </div>

          <p v-if="org.logo" class="mt-4 text-sm font-semibold text-brand-blue">{{ org.name }}</p>
        </div>
      </div>
    </PageContainer>
  </SectionBlock>
</template>
