import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wsua-teal': 'var(--wsua-teal)',
        'wsua-teal-light': 'var(--wsua-teal-light)',
        charcoal: 'var(--charcoal)',
        'charcoal-light': 'var(--charcoal-light)',
        'wsua-gold': 'var(--wsua-gold)',
      },
    },
  },
  plugins: [],
};

export default config;
