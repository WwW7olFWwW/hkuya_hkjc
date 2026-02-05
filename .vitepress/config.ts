import { defineConfig } from 'vitepress'
import { loadEnv } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(function (context) {
  const rootDir = resolve(__dirname, '..')
  const env = loadEnv(context.mode, rootDir, '')
  const pocketbaseUrl = env.VITE_POCKETBASE_URL || '/pb'

  return {
    lang: 'zh-TW',
    title: '『實踐科創·探知歷史』2025暑期實習團',
    description: '實習生招募',
    base: '/hkjc/',
    head: [
      ['link', { rel: 'icon', href: '/hkjc/favicon.ico' }],
      [
        'script',
        {},
        "window.__POCKETBASE_URL__ = " + JSON.stringify(pocketbaseUrl) + ";"
      ]
    ],
    srcExclude: ['old/**'],
    vite: {
      envDir: rootDir,
      envPrefix: ['VITE_', 'VITEPRESS_'],
      define: {
        'import.meta.env.VITE_POCKETBASE_URL': JSON.stringify(pocketbaseUrl)
      },
      server: {
        proxy: {
          '/pb': {
            target: 'http://127.0.0.1:8090',
            changeOrigin: true,
            rewrite: function (path) {
              return path.replace(/^\/pb/, '')
            }
          }
        }
      },
      optimizeDeps: {
        exclude: ['@formio/js']
      },
      ssr: {
        external: ['@formio/js']
      },
      resolve: {
        alias: {
          '@': rootDir
        }
      }
    },
    themeConfig: {}
  }
})
