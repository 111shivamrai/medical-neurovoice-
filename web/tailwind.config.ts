import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './web/components/**/*.{js,ts,jsx,tsx,mdx}',
    './web/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-2': 'var(--surface-2)',
          text: 'var(--text)',
          muted: 'var(--text-muted)',
          border: 'var(--border)',
          primary: 'var(--primary)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          glow: 'var(--primary-glow)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 35px var(--primary-glow)',
        'glow-accent': '0 0 35px rgba(34,211,238,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
