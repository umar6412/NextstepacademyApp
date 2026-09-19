/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        bento: '920px',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        sifal: {
          bg: '#060613',
          dark: '#0A0B1E',
          card: '#0a0a1f',
          surface: '#0f0d1e',
          purple: '#7c3aed',
          violet: '#8b5cf6',
          lavender: '#a78bfa',
          indigo: '#4F46E5',
          cyan: '#22d3ee',
          coral: '#e8601c',
          amber: '#F59E0B'
        }
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'pulse-glow': 'glowPulse 3s ease-in-out infinite',
        'float-1': 'floatCard1 3.5s ease-in-out infinite',
        'float-2': 'floatCard2 4.2s ease-in-out infinite',
        'float-3': 'floatCard3 3.8s ease-in-out infinite',
        'orb-1': 'orbFloat1 12s ease-in-out infinite',
        'orb-2': 'orbFloat2 15s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift': 'drift 20s ease-in-out infinite',
        'drift-slow': 'driftSlow 25s ease-in-out infinite',
        'shine': 'shineSweep 4s ease-in-out infinite',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.35), 0 0 80px rgba(124, 58, 237, 0.08)' }
        },
        orbFloat1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' }
        },
        orbFloat2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-25px, 20px) scale(0.96)' },
          '66%': { transform: 'translate(15px, -25px) scale(1.04)' }
        },
      }
    }
  },
  plugins: []
};
