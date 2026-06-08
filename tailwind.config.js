/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#00B1FF',
        secondary: '#D7EBF4',
        'text-primary': '#0E3344',
        bgSecondary: '#F2FBFF',
      },
      boxShadow: {
        'navbar-shadow': '0 ,10px 5.3px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
