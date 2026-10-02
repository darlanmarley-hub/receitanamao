/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Vibrant Emerald Mint primary
          600: '#059669', // Rich Emerald Green
          700: '#047857', // Deep Forest Jade
          800: '#065F46',
          900: '#064E3B',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#F59E0B', // Warm Amber accent
          600: '#D97706',
          700: '#B45309',
        },
        coral: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48',
        },
        sage: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
        },
        warm: {
          50: '#F8FAFC',  // Crisp modern slate light background
          100: '#F1F5F9', // Card hover / secondary background
          200: '#E2E8F0', // Soft dividers & borders
          300: '#CBD5E1', // Subtle icon borders
          400: '#94A3B8', // Muted text
          500: '#64748B', // Secondary text
          600: '#475569',
          700: '#334155', // Subheadings
          800: '#1E293B', // Dark cards & headers
          900: '#0F172A', // Deep primary body text
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(15, 23, 42, 0.05)',
        'float': '0 12px 32px -4px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 25px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'float': 'floatAnim 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        floatAnim: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
