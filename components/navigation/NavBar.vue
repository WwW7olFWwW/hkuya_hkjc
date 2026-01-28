<script setup lang="ts">
import { Menu } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-50 gradient-bar backdrop-blur border-b border-white/10">
    <div class="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
      <a href="#project-intro" class="flex items-center gap-3">
        <img src="/images/3x.png" alt="HKUYA" class="h-10 sm:h-12 w-auto" />
      </a>

      <nav class="hidden md:flex items-center gap-1">
        <Button
          v-for="item in navItems"
          :key="item.href"
          as-child
          :variant="item.primary ? 'default' : 'ghost'"
          class="text-white hover:text-white"
        >
          <a
            :href="item.href"
            class="flex flex-col items-center leading-tight px-2 py-2"
            :class="item.primary ? 'bg-white/10 hover:bg-white/20' : ''"
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
        <SheetContent side="right" class="bg-black/40 backdrop-blur text-white border-white/10">
          <div class="mt-10 space-y-2">
            <a
              v-for="item in navItems"
              :key="item.href"
              :href="item.href"
              class="flex flex-col items-center rounded-lg px-4 py-3 hover:bg-white/10"
            >
              <span class="text-base font-medium">{{ item.titleZh }}</span>
              <span class="text-xs opacity-80">{{ item.titleEn }}</span>
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
