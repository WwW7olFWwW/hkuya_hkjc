const { lightTheme } = require('./src/theme/lightTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  important: '#__next',
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        border: 'hsl(var(--border))'
      },
      borderRadius: {
        DEFAULT: `${lightTheme.shape.borderRadius}px`
      }
    }
  }
}
