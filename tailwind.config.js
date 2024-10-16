/** @type {import('tailwindcss').Config} */

export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      pink: "#ff49db",
      white: "#fff",
      ash: "#3E3E3F",
      greenLight: "#ECFDF3",
      "custom-Yellow": "#EBA900",
      darkred: "#DD0000",
      redlight: "#FEF3F2",
      grayLight: "#ededed",
      slateBlue: "var(--slateBlue)",
      stale: "var(--stale)",

      primary: "var(--primary-color) !important", // Purple Blue
      primaryalpha: "rgba(var(--primary), <alpha-value>)",
      primaryLight: "var(--primaryLight) !important",
      secondary: "#111E2C", // Dark
      accent: "var(--primary-color)", // Purple Blue
      secondaryWhite: "#F4F4F4",
      secondaryDark: "#3E3E3F",
      grey: "#667085",
      greyLight: "#F8FAFC",
      dark: "#242424",
      whiteTint: "#F4F4F4",

      //  DARK MODE COLORS
      dark1: "#1E1E1E",
      dark1Soft: "",
      dark2: "#2A2A2A",
      dark2Soft: "#2C2C2C",
      dark3: "#383838",
      dark3Soft: "#3F3F3F",
      darkText: "#7a7a7a",
    },

    // },
    //   extend: {
    fontFamily: {
      // Graphik: "Graphik",
      Inter: [`var(--font-Inter)`],
      // Poppins: "Poppins",
      // figtree: [`var(--font-Figtree)`],
    },

    boxShadow: {
      ShadowInput: "0px 0px 0px 5px rgba(102, 83, 240, 0.20);",
      ShadowInputpink: "0px 0px 0px 5px rgba(238, 46, 94, 0.16);",
      shadowXS: "0px 1px 2px 0px rgba(16, 24, 40, 0.05);",
      primaryShadow: "0px 0px 15px var(--primary-color)66",
      stepShadow: "0px 5px 8px 0px rgba(165, 165, 165, 0.40);",
      stepShadowInset: "0px 0px 4px 0px rgba(255, 255, 255, 0.25) inset;",
      dashboard: "0px 11px 18.3px 0px rgba(0, 0, 0, 0.10)",
      footerdiv: "0px 15px 60px 25px rgba(190, 190, 222, 0.50);",
      // footerdiv: "0px 397px 111px 0px rgba(129, 138, 152, 0.01), 0px 254px 102px 0px rgba(129, 138, 152, 0.05), 0px 143px 86px 0px rgba(129, 138, 152, 0.18), 0px 63px 63px 0px rgba(129, 138, 152, 0.30), 0px 16px 35px 0px rgba(129, 138, 152, 0.34)",
      widget:
        "0px 93.934px 93.934px 0px rgba(22, 34, 51, 0.08), 0px 50.098px 50.098px 0px rgba(22, 34, 51, 0.12), 0px 25.049px 25.049px 0px rgba(22, 34, 51, 0.04), 0px 18.787px 18.787px 0px rgba(22, 34, 51, 0.04), 0px 3.131px 18.787px 0px rgba(22, 34, 51, 0.04), 0px 3.131px 3.131px 0px rgba(22, 34, 51, 0.04)",
    },
    backgroundImage: {
      "bar-primary": "linear-gradient(180deg, #9B6FF9 0%, #7852C9 100%)",
      "total-card":
        "linear-gradient(178deg, rgba(216, 208, 255, 0.08) 1.16%, #F6F4FD 98.11%)",
      "notification-success":
        "linear-gradient(180deg, rgba(204, 255, 233, 0.80) 0%, rgba(235, 252, 248, 0.80) 51.08%, rgba(246, 251, 253, 0.80) 100%)",
      "notification-error":
        "linear-gradient(180deg, rgba(255, 236, 236, 0.80) 0%, rgba(253, 246, 248, 0.80) 51.13%, rgba(251, 251, 254, 0.80) 100%)",
    },

    animation: {
      "infinite-scroll": "infinite-scroll 45s linear infinite",
    },
    keyframes: {
      "infinite-scroll": {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(-100%)" },
      },
    },
    fontSize: {
      xxs: "10px",
      xs: "12px",
      sm: "14px",
    },
    borderRadius: {
      none: "0",
      xs: "10px",
      mdx: "8px",
    },
  },
  screens: {
    xs: "320px",
    xss: "560px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
    "2xxl": "1540px",
    "3xl": "1690px",
    "4xl": "1800px",
    "5xl": "2000px",
    "6xl": "2400px",
  },
};
export const plugins = [
  require("tailwind-scrollbar")({
    nocompatible: true,
    preferredStrategy: "pseudoelements",
  }),
];
export const darkMode = "class";
