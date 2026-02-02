<script setup lang="ts">
import { Facebook, Instagram } from "lucide-vue-next"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Separator } from "@/components/ui/separator"

interface LinkItem {
  label: string
  href: string
}

const quickLinks: LinkItem[] = [
  { label: '立即報名', href: 'https://forms.gle/QZdgDyGfNyfztPLd6' },
  { label: '項目簡介', href: '#project-intro' },
  { label: '面試安排', href: '#interview' },
  { label: '時間表', href: '#project-timeline' },
  { label: '實習崗位', href: '#positions' },
  { label: '關於我們', href: '#about' },
  { label: '聯絡我們', href: '#contactus' }
]

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/hongkonguya/', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/hkuya_ig/', icon: Instagram }
]

const currentYear = new Date().getFullYear()

function isPrimaryLink(link: LinkItem) {
  return link.label === '立即報名'
}
</script>

<template>
  <footer class="gradient-bar glass-bar text-slate-200">
    <PageContainer>
      <div class="py-10">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="text-center space-y-3">
            <h3 class="text-lg font-semibold text-white">快速連結</h3>
            <div class="space-y-1">
              <a
                v-for="link in quickLinks"
                :key="link.label"
                :href="link.href"
                :class="isPrimaryLink(link) ? 'footer-cta' : 'block text-sm hover:text-white'"
              >
                {{ link.label }}
              </a>
            </div>
          </div>

          <div class="text-center space-y-3">
            <h3 class="text-lg font-semibold text-white">聯絡資訊</h3>
            <p class="text-sm">地址：香港柴灣道238號青年廣場807-808室</p>
            <p class="text-sm">電話：(852) 25989385</p>
            <p class="text-sm">電郵：mail@hkuya.org.hk</p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white"
                :aria-label="social.label"
              >
                <component :is="social.icon" class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator class="my-8 border-white/20" />

        <p class="text-center text-xs text-slate-300">
          © {{ currentYear }} Hong Kong United Youth Association All rights reserved.
        </p>
      </div>
    </PageContainer>
  </footer>
</template>
