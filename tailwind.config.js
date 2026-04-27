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
          surface: '#f8f9ff',
          'surface-dim': '#cbdbf5',
          'surface-bright': '#f8f9ff',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#eff4ff',
          'surface-container': '#e5eeff',
          'surface-container-high': '#dce9ff',
          'surface-container-highest': '#d3e4fe',
          'on-surface': '#0b1c30',
          'on-surface-variant': '#3f4944',
          'inverse-surface': '#213145',
          'inverse-on-surface': '#eaf1ff',
          outline: '#6f7973',
          'outline-variant': '#bec9c2',
          'surface-tint': '#1b6b51',
          primary: '#004532',
          'on-primary': '#ffffff',
          'primary-container': '#065f46',
          'on-primary-container': '#8bd6b7',
          'inverse-primary': '#8bd6b6',
          secondary: '#006e2f',
          'on-secondary': '#ffffff',
          'secondary-container': '#6bff8f',
          'on-secondary-container': '#007432',
          tertiary: '#563400',
          'on-tertiary': '#ffffff',
          'tertiary-container': '#764900',
          'on-tertiary-container': '#ffb960',
          error: '#ba1a1a',
          'on-error': '#ffffff',
          'error-container': '#ffdad6',
          'on-error-container': '#93000a',
          background: '#f8f9ff',
          'on-background': '#0b1c30',
          'surface-variant': '#d3e4fe',
          'success': '#22c55e',
          'charcoal': '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'base': '8px',
        'container': '20px',
        'gutter': '16px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '40px',
      }
    },
  },
  plugins: [],
}
