import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        savera: {
          dark: "#1b4332",    // Deep Forest Green
          green: "#2d6a4f",   // Leaf Green
          lightGreen: "#52b788", // Fresh Mint Green
          paleGreen: "#d8f3dc", // Very soft green
          cream: "#fefae0",   // Warm Cream
          offwhite: "#faf9f6",// Off White background
          brown: "#582f0e",   // Earth Brown
          saffron: "#e9c46a", // Golden/Saffron accent
          saffronDark: "#d4a373", // Deep Ghee Saffron
          accent: "#ddb892",  // Warm accent
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.08)',
        'card': '0 10px 30px -5px rgba(27, 67, 50, 0.12)',
        'floating': '0 20px 40px -10px rgba(27, 67, 50, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
