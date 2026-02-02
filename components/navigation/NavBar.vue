<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { Menu } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useContentStore } from "@/lib/content/store"

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

const store = useContentStore()

function resolveAsset(path: string) {
  return withBase(path)
}

function normalizeLogoHeight(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return 48
}

const logoHeight = computed(function () {
  const settings = store.contentState.value.site_settings
  const fields = settings ? settings.fields : null
  const value = fields ? fields.logoHeight : undefined
  return normalizeLogoHeight(value)
})

const logoStyle = computed(function () {
  return {
    height: logoHeight.value + "px",
    maxHeight: "var(--site-header-height)"
  }
})
</script>

<template>
  <header class="site-header fixed top-0 inset-x-0 z-50 gradient-bar glass-bar border-b border-white/10">
    <div class="mx-auto flex items-center h-full w-full px-4 sm:px-6 lg:px-8">
      <a href="#project-intro" class="flex items-center gap-3">
        <img :src="resolveAsset('/images/3x.png')" alt="HKUYA" class="w-auto" :style="logoStyle" />
      </a>

      <nav class="nav-desktop">
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

      <div class="nav-mobile">
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
    </div>
  </header>
</template>
