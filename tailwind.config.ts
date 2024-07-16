import type { Config } from "tailwindcss";


const primaryColor = {
  '50': '#eef0ff',
  '100': '#dfe4ff',
  '200': '#c5ccff',
  '300': '#a2a9ff',
  '400': '#7f7efb',
  '500': '#584cf4',
  '600': '#5b41ea',
  '700': '#4d34ce',
  '800': '#3f2da6',
  '900': '#372c83',
  '950': '#221a4c',
  DEFAULT: '#584cf4'
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: primaryColor,
        dark: primaryColor[950],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
