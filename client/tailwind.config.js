/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'near-black': '#0d0d0d',
        'brand-green': '#18E299',
        'gray-700': '#333333',
        'gray-500': '#666666',
        'gray-400': '#888888',
        'gray-200': '#e5e5e5',
        'gray-100': '#f5f5f5',
        'gray-50': '#fafafa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '16px',
        'card-lg': '24px',
      },
      letterSpacing: {
        'tight-hero': '-1.28px',
        'tight-heading': '-0.8px',
        'tight-subheading': '-0.24px',
      },
      borderWidth: {
        'subtle': '1px',
      },
    },
  },
  plugins: [],
}
