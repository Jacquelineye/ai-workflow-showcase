/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      colors: {
        primary: '#5D84A2',
        secondary: '#64748B',
        success: '#369379',
        error: '#C74949',
        warning: '#DE8D31',
        white: '#FFFFFF',
        black: '#000000',
        fontcolor: '#52525B',
        stroke: '#CBD5E1',
        placeholder: '#D4D4D8',
        description: '#A3A3A3',
        bg: '#ECEEF0',
      },

      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '18': '18px',
        '18px': '18px',
        '3xl': '20px',
        '4xl': '22px',
        '5xl': '24px',
        'full': '999px',
      },

      spacing: {
        '0': '0px',
        '1': '1px',
        '2': '2px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '9': '36px',
        '10': '10px',
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '28': '28px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
        '48': '48px',
        '60': '60px',
        '72': '72px',
        '280': '280px',
        '320': '320px',
      },

      fontSize: {
        // title
        'title-1': ['28px', { lineHeight: '34px', letterSpacing: '0.34px' }],
        'title-2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px' }],
        'title-3': ['20px', { lineHeight: '24px', letterSpacing: '0.37px' }],

        // header
        'H1': ['34px', { lineHeight: '41px', letterSpacing: '0.37px' }],
        'H2': ['28px', { lineHeight: '34px', letterSpacing: '0.34px' }],
        'H3': ['22px', { lineHeight: '28px', letterSpacing: '0.34px' }],
        'H4': ['20px', { lineHeight: '24px', letterSpacing: '0.37px' }],
        'H5': ['17px', { lineHeight: '22px', letterSpacing: '-0.4px' }],
        'H6': ['15px', { lineHeight: '20px', letterSpacing: '-0.23px' }],

        // label
        'label-1': ['17px', { lineHeight: '22px', letterSpacing: '-0.4px' }],
        'label-2': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
        'label-3': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],

        // body
        'body-1': ['17px', { lineHeight: '22px', letterSpacing: '-0.4px' }],
        'body-2': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px' }],
        'body-3': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
        'body-4': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px' }],

        // caption
        'caption-1': ['12px', { lineHeight: '16px', letterSpacing: '0px' }],
        'caption-2': ['10px', { lineHeight: '12px', letterSpacing: '0px' }],
      },

     boxShadow: {
        // 外陰影 (Drop Shadow)
        "drop-s": "0px 2px 6px -1px rgba(0, 0, 0, 0.07)",
        "drop-m": "0px 6px 6px -1px rgba(0, 0, 0, 0.10)",
        "drop-l": "0px 12px 24px -4px rgba(0, 0, 0, 0.14)",

        // 內陰影 (Inner Shadow)
        "inner-s": "inset 0px 2px 5px 0px rgba(0, 0, 0, 0.12)",
        "inner-m": "inset 0px 4px 8px 0px rgba(0, 0, 0, 0.14)",
        "inner-l": "inset 0px 8px 16px 0px rgba(0, 0, 0, 0.16)",
       },

    },
  },
  plugins: [],
};
