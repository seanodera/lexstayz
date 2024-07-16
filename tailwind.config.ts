import type { Config } from "tailwindcss";

const primaryColor = {
  '50': '#fff6ec',
  '100': '#ffebd3',
  '200': '#ffd2a5',
  '300': '#ffb26d',
  '400': '#ff8632',
  '500': '#ff640a',
  '600': '#ff4a00',
  '700': '#cc3202',
  '800': '#a1280b',
  '900': '#82240c',
  '950': '#460f04',
  DEFAULT: '#ff4a00'
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
