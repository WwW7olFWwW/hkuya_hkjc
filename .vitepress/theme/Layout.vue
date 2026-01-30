<template>
  <div class="site-root">
    <NavBar />
    <main class="site-main">
      <Content />
    </main>
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { Content } from 'vitepress'
import NavBar from '../../components/navigation/NavBar.vue'
import FooterBar from '../../components/navigation/FooterBar.vue'
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
</style>
