/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E141B',
        mist: '#F4F7FB',
        steel: '#5B6B7A',
        accent: '#0EA5E9',
        accentDark: '#0B7CB3',
        line: '#E4E9F0',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(14,20,27,0.08)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
