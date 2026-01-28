import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.md',
    './.vitepress/**/*.{js,ts,vue}',
    './components/**/*.{js,ts,vue}',
    './data/**/*.{js,ts}',
    './styles/**/*.{css}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: 'var(--brand-green)',
          blue: 'var(--brand-blue)',
          dark: 'var(--brand-dark)',
          light: 'var(--brand-light)'
        }
      },
      boxShadow: {
        card: 'var(--brand-shadow)'
      }
    }
  },
  plugins: [animate]
}

export default config
