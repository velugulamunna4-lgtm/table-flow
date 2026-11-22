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
          hover: '#C2471E',
          subtle: 'rgba(217, 83, 40, 0.12)',
        },
        sun: {
          DEFAULT: 'var(--accent-sun)',
          subtle: 'rgba(217, 155, 38, 0.15)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        status: {
          success: 'var(--success)',
          'success-subtle': 'rgba(33, 150, 83, 0.12)',
          alert: 'var(--alert)',
          'alert-subtle': 'rgba(211, 47, 47, 0.12)',
          info: 'var(--info)',
          'info-subtle': 'rgba(99, 102, 241, 0.12)',
        },
        borderSubtle: 'var(--border-subtle)',
      },
      fontFamily: {
        heading: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'pill': '999px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(33, 27, 23, 0.05)',
        'lifted': '0 12px 32px rgba(33, 27, 23, 0.08)',
        'accent': '0 8px 20px rgba(217, 83, 40, 0.22)',
        'sun': '0 8px 20px rgba(217, 155, 38, 0.22)',
        'bottom-bar': '0 -6px 28px rgba(33, 27, 23, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
