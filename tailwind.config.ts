import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A0F1E',
        'surface-dark': '#111827',
        'border-dark': '#1F2937',
        'bg-light': '#F8FAFC',
        'surface-light': '#FFFFFF',
        'border-light': '#E2E8F0',
        primary: '#6366F1',
        'primary-light': '#4F46E5',
        accent: '#22D3EE',
        'accent-light': '#0891B2',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary-dark': '#F9FAFB',
        'text-secondary-dark': '#9CA3AF',
        'text-primary-light': '#0F172A',
        'text-secondary-light': '#64748B',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(99,102,241,0.15)',
        'glow-accent': '0 0 40px rgba(34,211,238,0.15)',
        'glow-primary-strong': '0 0 60px rgba(99,102,241,0.4)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'panel': '24px',
      },
    },
  },
  plugins: [],
}

export default config
