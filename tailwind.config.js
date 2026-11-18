/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070b19',
          navy: '#0b132b',
          deep: '#101d42',
          surface: '#14214d',
          card: '#1a295f',
          electric: '#2563eb',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          violet: '#7c3aed',
          purple: '#9333ea',
          neon: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          accent: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        '3d-sm': '0 4px 12px -2px rgba(16, 29, 66, 0.4), 0 2px 6px -1px rgba(37, 99, 235, 0.15)',
        '3d': '0 10px 30px -5px rgba(5, 12, 35, 0.7), 0 6px 12px -2px rgba(37, 99, 235, 0.25)',
        '3d-hover': '0 20px 40px -10px rgba(5, 12, 35, 0.8), 0 10px 25px -3px rgba(34, 211, 238, 0.3)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.45)',
        'glow-purple': '0 0 25px rgba(124, 58, 237, 0.45)',
        'glow-green': '0 0 25px rgba(16, 185, 129, 0.45)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glow-card': 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.1) 50%, rgba(6, 182, 212, 0.05) 100%)',
        'mesh-pattern': 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
