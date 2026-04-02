/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      colors: {
        void: '#050507',
        surface: { DEFAULT: '#0c0c10', elevated: '#141418' },
        border: '#1e1e24',
        gold: { DEFAULT: '#d4a843', dim: '#8a7333', bright: '#e8c35a', muted: '#6b5c2d' },
        ember: '#e8734a',
        ice: '#5b9cf5',
        // Keep zinc overrides working for detail pages
        midnight: {
          50: '#f5f4f0', 100: '#ebebdf', 200: '#d8d8cc', 300: '#b0b0a6',
          400: '#8a8a9a', 500: '#5a5a6a', 600: '#4a4a5a', 700: '#2a2a36',
          800: '#16161f', 900: '#0f0f15', 950: '#08080c',
        },
        // Keep gold/violet for detail page compat
        violet: { DEFAULT: '#7c6df0', dim: '#5548b0', bright: '#9d91f5', muted: '#3d3570' },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out 0.15s both',
      },
    },
  },
  plugins: [],
}
