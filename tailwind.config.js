export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#F3F5F7",
        card: "#FFFFFF",
        ink: "#101828",
        muted: "#8A94A6",
        tide: "#F5C542",
      },
      borderRadius: {
        card: "20px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
