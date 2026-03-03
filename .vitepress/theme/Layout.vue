<template>
  <div class="site-root">
    <NavBar v-if="!isAdminPage" />
    <main :class="isAdminPage ? 'site-main site-main--admin' : 'site-main'">
      <Content />
    </main>
    <FooterBar v-if="!isAdminPage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Content, useData } from "vitepress"
import NavBar from '../../components/navigation/NavBar.vue'
import FooterBar from '../../components/navigation/FooterBar.vue'

const data = useData()

const isAdminPage = computed(function () {
  return data.page.value.relativePath === "admin.md"
})
</script>

<style scoped>
.site-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-main {
  flex: 1;
  padding-top: var(--site-header-height);
}

.site-main--admin {
  padding-top: 0;
}
</style>
