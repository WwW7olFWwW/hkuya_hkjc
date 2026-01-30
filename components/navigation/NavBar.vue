<script setup lang="ts">
import { withBase } from "vitepress"
import { Menu } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import PageContainer from "@/components/layout/PageContainer.vue"

interface NavItem {
  titleZh: string
  titleEn: string
  href: string
  primary?: boolean
}

const navItems: NavItem[] = [
  {
    titleZh: '立即報名',
    titleEn: 'Apply NOW',
    href: 'https://forms.gle/QZdgDyGfNyfztPLd6',
    primary: true
  },
  { titleZh: '項目簡介', titleEn: 'Project Introduction', href: '#project-intro' },
  { titleZh: '面試安排', titleEn: 'Interview Arrangement', href: '#interview' },
  { titleZh: '時間表', titleEn: 'Timeline', href: '#project-timeline' },
  { titleZh: '實習崗位', titleEn: 'Positions', href: '#positions' },
  { titleZh: '關於我們', titleEn: 'About Us', href: '#about' },
  { titleZh: '聯絡我們', titleEn: 'Contact Us', href: '#contactus' }
]

function resolveAsset(path: string) {
  return withBase(path)
}
</script>

<template>
  <header class="site-header fixed top-0 inset-x-0 z-50 gradient-bar backdrop-blur border-b border-white/10">
    <PageContainer>
      <div class="flex items-center justify-between h-full">
        <a href="#project-intro" class="flex items-center gap-3">
          <img :src="resolveAsset('/images/3x.png')" alt="HKUYA" class="h-10 sm:h-12 w-auto" />
        </a>

        <nav class="hidden md:flex items-center gap-1">
          <Button
            v-for="item in navItems"
            :key="item.href"
            as-child
            variant="ghost"
          >
            <a
              :href="item.href"
              :class="item.primary ? 'nav-link nav-link--primary' : 'nav-link'"
            >
              <span class="text-base font-medium">{{ item.titleZh }}</span>
              <span class="text-xs opacity-80">{{ item.titleEn }}</span>
            </a>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" class="md:hidden text-white">
              <Menu class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="bg-slate-900/80 backdrop-blur text-white border-white/10">
            <div class="mt-10 space-y-2">
              <a
                v-for="item in navItems"
                :key="item.href"
                :href="item.href"
                :class="item.primary ? 'mobile-cta' : 'mobile-link'"
              >
                <span class="text-base font-medium">{{ item.titleZh }}</span>
                <span class="text-xs opacity-80">{{ item.titleEn }}</span>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageContainer>
  </header>
</template>
