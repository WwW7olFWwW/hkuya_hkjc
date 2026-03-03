<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { Facebook, Instagram } from "lucide-vue-next"
import PageContainer from "@/components/layout/PageContainer.vue"
import { Separator } from "@/components/ui/separator"
import { useContentStore } from "@/lib/content/store"
import { defaultContent } from "@/lib/content/defaultContent"
import {
  normalizeFooterQuickLinks,
  normalizeFooterSocialLinks,
  resolveConfiguredHref,
  type FooterQuickLink,
  type FooterSocialLink
} from "@/lib/navigation/normalizeLinks"
import { withBase } from "vitepress"

const store = useContentStore()

function resolveDefaultFooterQuickLinks() {
  const fields = defaultContent.site_settings.fields as Record<string, unknown>
  return normalizeFooterQuickLinks(fields.footerQuickLinks, [])
}

function resolveDefaultFooterSocialLinks() {
  const fields = defaultContent.site_settings.fields as Record<string, unknown>
  return normalizeFooterSocialLinks(fields.footerSocialLinks, [])
}

const fallbackFooterQuickLinks = resolveDefaultFooterQuickLinks()
const fallbackFooterSocialLinks = resolveDefaultFooterSocialLinks()

function resolveLinkHref(href: string) {
  return resolveConfiguredHref(href, withBase)
}

const quickLinks = computed(function (): FooterQuickLink[] {
  const settings = store.contentState.value.site_settings
  const fields = settings ? (settings.fields as Record<string, unknown>) : null
  const source = fields ? fields.footerQuickLinks : undefined
  return normalizeFooterQuickLinks(source, fallbackFooterQuickLinks)
})

const socialLinks = computed(function (): Array<FooterSocialLink & { iconComponent: unknown }> {
  const settings = store.contentState.value.site_settings
  const fields = settings ? (settings.fields as Record<string, unknown>) : null
  const source = fields ? fields.footerSocialLinks : undefined
  const normalized = normalizeFooterSocialLinks(source, fallbackFooterSocialLinks)

  const mapped: Array<FooterSocialLink & { iconComponent: unknown }> = []
  for (const link of normalized) {
    const iconComponent = link.icon === "facebook" ? Facebook : Instagram
    mapped.push({
      label: link.label,
      href: link.href,
      icon: link.icon,
      iconComponent: iconComponent
    })
  }
  return mapped
})

function resolveCurrentYear() {
  const buildYear = import.meta.env.VITEPRESS_BUILD_YEAR
  if (typeof buildYear === "string" && buildYear.trim() !== "") {
    return buildYear
  }
  return "2025"
}

const currentYear = ref(resolveCurrentYear())

onMounted(function () {
  currentYear.value = String(new Date().getFullYear())
})
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
                v-for="(link, index) in quickLinks"
                :key="link.href + '-' + index"
                :href="resolveLinkHref(link.href)"
                class="block text-sm hover:text-white"
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
                v-for="(social, index) in socialLinks"
                :key="social.href + '-' + index"
                :href="resolveLinkHref(social.href)"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white"
                :aria-label="social.label"
              >
                <component :is="social.iconComponent" class="h-5 w-5" />
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
