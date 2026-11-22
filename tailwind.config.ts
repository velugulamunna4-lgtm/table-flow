import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-card)',
        primary: {
          DEFAULT: 'var(--accent-primary)',
          hover: '#E56734',
          subtle: 'rgba(255, 122, 69, 0.12)',
        },
        sun: {
          DEFAULT: 'var(--accent-sun)',
          subtle: 'rgba(255, 194, 51, 0.15)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        status: {
          success: 'var(--success)',
          'success-subtle': 'rgba(45, 190, 126, 0.12)',
          alert: 'var(--alert)',
          'alert-subtle': 'rgba(255, 90, 110, 0.12)',
          info: 'var(--info)',
          'info-subtle': 'rgba(139, 108, 246, 0.12)',
        },
        borderSubtle: 'var(--border-subtle)',
      },
      fontFamily: {
        heading: ['var(--font-baloo)', 'cursive', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'pill': '999px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(58, 42, 34, 0.06)',
        'lifted': '0 16px 40px rgba(58, 42, 34, 0.10)',
        'accent': '0 10px 25px rgba(255, 122, 69, 0.25)',
        'sun': '0 10px 25px rgba(255, 194, 51, 0.25)',
        'bottom-bar': '0 -8px 32px rgba(58, 42, 34, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
