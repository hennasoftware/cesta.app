import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#fff8ed',
        linen: '#f7ead7',
        coffee: '#4b2f24',
        espresso: '#24150f',
        caramel: '#b9804d',
        gold: '#d7a852',
        rose: '#d9a3a1',
        blush: '#f8dddc',
        sage: '#8f9d7a',
        pistachio: '#eef2df',
      },
      boxShadow: {
        premium: '0 24px 70px rgba(75, 47, 36, 0.14)',
        glow: '0 20px 60px rgba(215, 168, 82, 0.24)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'soft-radial':
          'radial-gradient(circle at 18% 20%, rgba(217,163,161,.22), transparent 28%), radial-gradient(circle at 82% 12%, rgba(143,157,122,.20), transparent 30%), linear-gradient(135deg, #fff8ed 0%, #f7ead7 48%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
