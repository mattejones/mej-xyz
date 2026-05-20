import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
        display: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        muted: "var(--text-muted)",
        "card-bg": "var(--card-bg)",
      },
      boxShadow: {
        nb: "4px 4px 0 #000",
        "nb-sm": "2px 2px 0 #000",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
