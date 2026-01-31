<script setup lang="ts">
const props = defineProps<{
  slug: string
}>()
</script>

<template>
  <div class="section-card p-6 space-y-2">
    <h3 class="text-lg font-semibold">Content Editor</h3>
    <p class="text-sm text-slate-500">目前選擇：{{ props.slug }}</p>
    <div class="text-sm text-slate-500">Form.io 表單渲染將在下一步接入。</div>
  </div>
</template>
