import { defineConfig } from 'vitepress'
import { loadEnv } from 'vite'
import { resolve } from 'node:path'

export default defineConfig(function (context) {
  const rootDir = resolve(__dirname, '..')
  const env = loadEnv(context.mode, rootDir, '')
  const supabaseUrl = env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || ''

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
        "window.__SUPABASE_URL__ = " +
          JSON.stringify(supabaseUrl) +
          ";window.__SUPABASE_ANON_KEY__ = " +
          JSON.stringify(supabaseAnonKey) +
          ";"
      ]
    ],
    srcExclude: ['old/**'],
    vite: {
      envDir: rootDir,
      envPrefix: ['VITE_', 'VITEPRESS_'],
      define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
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
