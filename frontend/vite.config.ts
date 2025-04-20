import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setup.ts",
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5005",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // Skip TypeScript checking
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
