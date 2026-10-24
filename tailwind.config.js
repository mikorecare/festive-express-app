/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "brand-navy": { DEFAULT: "#1C2D58", dark: "#1A2A4D" },
        "brand-orange": { DEFAULT: "#F49321", dark: "#D4851E" },

        brand: { DEFAULT: "#1C2D58", dark: "#F49321" },
        canvas: { DEFAULT: "#FFFFFF", dark: "#0F1A33" },
        surface: { DEFAULT: "#FFFFFF", dark: "#152340" },
        ink: { DEFAULT: "#1C2D58", dark: "#D6DCE8" },
        muted: { DEFAULT: "#7A6A60", dark: "#8899BB" },
        line: { DEFAULT: "#D6D7D8", dark: "#2A3D68" },
      },

      fontFamily: {
        // Default — resolves `font-sans` to Poppins
        sans: ["Poppins-Regular"],

        // Poppins
        "poppins-regular": ["Poppins-Regular"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-black": ["Poppins-Black"],

        // Raleway
        "raleway-regular": ["Raleway-Regular"],
        "raleway-bold": ["Raleway-Bold"],
        "raleway-black": ["Raleway-Black"],

        // Roboto
        "roboto-regular": ["Roboto-Regular"],
        "roboto-bold": ["Roboto-Bold"],
        "roboto-black": ["Roboto-Black"],

        // Custom / emphasis
        trelasty: ["Trelasty Betanny"],
        greattong: ["Greattong Brush"],
        acier: ["Acier Bat"],
      },
    },
  },
  plugins: [],
};
