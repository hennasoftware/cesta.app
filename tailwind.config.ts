import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#fff6ec',
        linen: '#fbe8d4',
        coffee: '#4a2117',
        espresso: '#20110d',
        caramel: '#f26922',
        gold: '#ff8a2a',
        rose: '#ff6f4d',
        blush: '#ffe1d3',
        sage: '#00a9a5',
        pistachio: '#d9fbf5',
      },
      boxShadow: {
        premium: '0 24px 70px rgba(74, 33, 23, 0.14)',
        glow: '0 20px 60px rgba(242, 105, 34, 0.24)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'soft-radial':
          'radial-gradient(circle at 18% 20%, rgba(242,105,34,.16), transparent 28%), radial-gradient(circle at 82% 12%, rgba(0,169,165,.16), transparent 30%), linear-gradient(135deg, #fff6ec 0%, #fbe8d4 48%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
