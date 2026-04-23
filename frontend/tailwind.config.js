/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#09090b',
          secondary: '#111113',
          card: '#18181b',
          hover: '#27272a',
        },
        accent: {
          cyan: '#2dd4bf',
          purple: '#a78bfa',
          green: '#34d399',
          orange: '#fb923c',
          red: '#fb7185',
        },
        border: {
          dim: '#3f3f46',
          glow: 'rgba(45,212,191,0.2)',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#52525b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(45,212,191,0.12)',
        'glow-purple': '0 0 20px rgba(167,139,250,0.12)',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      }
    },
  },
  plugins: [],
}
