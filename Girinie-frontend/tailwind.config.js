/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        SUIT: ['SUIT', 'sans-serif'],
      },
      colors: {
        primary: '#FEF1B0',

        secondary: '#FFE76A',

        thirdary: `#6E4C41`,

        tertiary: '#E0AB5B',

        error: '#D8433B',

        childLevel: {
          gold: '#FFE76A',
          silver: '#D7E2E4',
          bronze: '#E0AB5B',
        },
      
      },
      spacing: {
        '15': '3.75rem',
        '20': '4rem',
        '25': '6rem',   
        '30': '7.5rem',  
        '35': '8.75rem',  
        '38': '9.5rem',  
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.font-title1': {
          '@apply font-SUIT font-semibold text-[28px] leading-[40px] tracking-tightest': {},
        },
        '.font-title2': {
          '@apply font-SUIT font-semibold text-[24px] leading-[35px] tracking-tightest': {},
        },
        '.font-title3': {
          '@apply font-SUIT font-medium text-[20px] leading-[28px] tracking-tightest': {},
        },
        '.font-body1-m': {
          '@apply font-SUIT font-medium text-[18px] leading-[25px] tracking-tightest': {},
        },
        '.font-body1-sb': {
          '@apply font-SUIT font-semibold text-[18px] leading-[25px] tracking-tightest': {},
        },
        '.font-body2-m': {
          '@apply font-SUIT font-medium text-[14px] leading-[20px] tracking-tightest': {},
        },
        '.font-body2-sb': {
          '@apply font-SUIT font-semibold text-[14px] leading-[20px] tracking-tightest': {},
        },
        '.font-caption-m': {
          '@apply font-SUIT font-medium text-[12px] leading-[15px] tracking-tightest': {},
        },
      });
    }
  ],
};
