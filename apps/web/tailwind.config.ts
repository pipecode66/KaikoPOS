import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          surface: "var(--color-surface)",
          background: "var(--color-background)",
          text: "var(--color-text-primary)",
          muted: "var(--color-text-secondary)",
          success: "var(--color-success)",
          error: "var(--color-error)",
          warning: "var(--color-warning)",
          info: "var(--color-info)"
        }
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        "2xl": "calc(var(--radius-xl) + 4px)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lifted: "var(--shadow-lifted)"
      },
      backgroundImage: {
        "dashboard-glow":
          "radial-gradient(circle at top left, rgba(200,162,200,0.28), transparent 35%), radial-gradient(circle at bottom right, rgba(232,216,232,0.56), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
