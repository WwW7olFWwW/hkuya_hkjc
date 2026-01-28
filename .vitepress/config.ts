import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'

export default defineConfig({
  lang: 'zh-TW',
  title: '『實踐科創·探知歷史』2025暑期實習團',
  description: '實習生招募',
  base: '/hkjc/',
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, '..')
      }
    }
  },
  themeConfig: {}
})
