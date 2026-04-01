/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'text-gold', 'bg-gold', 'border-gold',
    'text-gold/10', 'bg-gold/10', 'bg-gold/5', 'border-gold/25', 'border-gold/30', 'border-gold/40', 'border-gold/50',
    'text-violet', 'bg-violet', 'border-violet',
    'text-violet/10', 'bg-violet/10', 'bg-violet/5', 'border-violet/25', 'border-violet/20',
    'text-violet-bright', 'dark:text-violet-bright',
    'text-gold-bright', 'bg-gold-bright',
    'hover:text-gold', 'hover:border-gold', 'hover:bg-gold',
    'dark:hover:text-gold', 'dark:hover:border-gold', 'dark:hover:bg-gold',
    'group-hover:text-gold', 'group-hover:bg-gold', 'group-hover:bg-gold/10',
    'dark:group-hover:text-gold',
    'hover:border-gold/40', 'hover:border-gold/50', 'hover:text-gold',
    'dark:hover:border-gold/30', 'dark:hover:border-gold/40',
    'animate-pulse-gold', 'animate-spin-slow',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        midnight: {
          50: '#f5f4f0',
          100: '#ebebdf',
          200: '#d8d8cc',
          300: '#b0b0a6',
          400: '#8a8a9a',
          500: '#5a5a6a',
          600: '#4a4a5a',
          700: '#2a2a36',
          800: '#16161f',
          900: '#0f0f15',
          950: '#08080c',
        },
        gold: {
          DEFAULT: '#c9a84c',
          dim: '#8a7333',
          bright: '#e4c76a',
          muted: '#6b5c2d',
        },
        violet: {
          DEFAULT: '#7c6df0',
          dim: '#5548b0',
          bright: '#9d91f5',
          muted: '#3d3570',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'line-draw': 'lineDraw 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        lineDraw: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
