<script setup lang="ts">
interface SectionBlockProps {
  id?: string
  tone?: 'light' | 'muted'
}

const props = withDefaults(defineProps<SectionBlockProps>(), {
  tone: 'light'
})

function getSectionClass() {
  if (props.tone === 'muted') {
    return 'section-muted'
  }
  return 'bg-transparent'
}

function getSectionStyle() {
  return {
    scrollMarginTop: 'var(--site-header-height)'
  }
}
</script>

<template>
  <section :id="props.id" :class="['py-12 sm:py-14 md:py-16', getSectionClass()]" :style="getSectionStyle()">
    <slot />
  </section>
</template>
