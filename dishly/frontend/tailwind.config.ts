import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dishly: {
          primary: '#DC2626', // Red
          accent: '#F59E0B', // Amber/Gold
          dark: '#1F2937', // Dark Gray
          light: '#F9FAFB', // Off-white
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1F2937',
            fontFamily: 'var(--font-inter)',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
