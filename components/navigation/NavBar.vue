<script setup lang="ts">
import { computed } from "vue"
import { withBase } from "vitepress"
import { Menu } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useContentStore } from "@/lib/content/store"
import { defaultContent } from "@/lib/content/defaultContent"
import {
  normalizeHeaderLinks,
  resolveConfiguredHref,
  type HeaderLink
} from "@/lib/navigation/normalizeLinks"

const store = useContentStore()

function resolveDefaultHeaderLinks() {
  const fields = defaultContent.site_settings.fields as Record<string, unknown>
  return normalizeHeaderLinks(fields.headerLinks, [])
}

const fallbackHeaderLinks = resolveDefaultHeaderLinks()

function resolveAsset(path: string) {
  return withBase(path)
}

function resolveLinkHref(href: string) {
  return resolveConfiguredHref(href, withBase)
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

const navItems = computed(function (): HeaderLink[] {
  const settings = store.contentState.value.site_settings
  const fields = settings ? (settings.fields as Record<string, unknown>) : null
  const source = fields ? fields.headerLinks : undefined
  return normalizeHeaderLinks(source, fallbackHeaderLinks)
})
</script>

<template>
  <header class="site-header fixed top-0 inset-x-0 z-50 gradient-bar glass-bar border-b border-white/10">
    <div class="mx-auto flex items-center h-full w-full px-4 sm:px-6 lg:px-8">
      <a href="#" class="flex items-center gap-3">
        <img :src="resolveAsset('/images/3x.png')" alt="HKUYA 標誌" loading="lazy" class="w-auto" :style="logoStyle" />
      </a>

      <nav class="nav-desktop">
        <Button
          v-for="(item, index) in navItems"
          :key="item.href + '-' + index"
          as-child
          variant="ghost"
        >
          <a
            :href="resolveLinkHref(item.href)"
            class="nav-link"
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
                v-for="(item, index) in navItems"
                :key="item.href + '-' + index"
                :href="resolveLinkHref(item.href)"
                class="mobile-link"
              >
                <span class="text-base font-medium">{{ item.titleZh }}</span>
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
