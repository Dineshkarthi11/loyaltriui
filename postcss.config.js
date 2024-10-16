module.exports = {
  plugins: {
    tailwindcss: {
      black: "#161618",
      pink: "#ff49db",
      white: "#fff",
      ash: "#3E3E3F",
      green: "#027A48",
      greenLight: "#ECFDF3",
      // red: "#B42318",
      redlight: "#FEF3F2",
      grayLight: "#ededed",
      slateBlue: "#6A4BFC",
      stale: "#7939EF",

      // primary: color, // Purple Blue
      primary: "var(--primary-color) !important", // Purple Blue

      // primary: "#6A4BFC", // Purple Blue
      secondary: "#111E2C", // Dark
      accent: "var(--primary-color)", // Purple Blue

      // accent: "#6A4BFC", // Purple Blue
      secondaryWhite: "#F4F4F4",
      secondaryDark: "#3E3E3F",
      dark: "#242424",
    },
    autoprefixer: {},
  },
};
