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
        /** Primary Colors **/
        primary: '#FEF1B0',
        'on-primary': '#FFFFFF',
        'primary-container': '#E8F0FF',
        'on-primary-container': '#3D5AFE',

        /** Secondary Colors **/
        secondary: '#FFE76A',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#DDE7FF',
        'on-secondary-container': '#2C3A87',

        /** Tertiary Colors **/
        tertiary: '#E0AB5B',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#FBE47A',
        'on-tertiary-container': '#141414',

        /** Error Colors **/
        error: '#D8433B',
        'on-error': '#FFFFFF',
        'error-container': '#FDECEA',
        'on-error-container': '#D8433B',
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
