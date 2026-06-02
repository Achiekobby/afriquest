/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: "#2D5A47",
            dark: "#234839",
            light: "#3A7560",
          },
          orange: {
            DEFAULT: "#D4611A",
            dark: "#B55215",
          },
          gold: {
            DEFAULT: "#E3A020",
            light: "#F0C14D",
          },
          cream: "#F7F3EB",
          ink: "#1C2B26",
          muted: "#5A6B64",
          border: "#E0D8C8",
        },
      },
      maxWidth: {
        "8xl": "96rem",
      },
      fontFamily: {
        sans: ["Onest", "system-ui", "sans-serif"],
        heading: ["Onest", "system-ui", "sans-serif"],
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
