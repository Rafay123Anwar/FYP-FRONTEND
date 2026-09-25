import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    // Split vendor code into separate cacheable chunks.
    // Users only re-download changed chunks on re-deploy.
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-axios": ["axios"],
          "vendor-ui": ["lucide-react", "clsx", "tailwind-merge"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
    // Inline assets smaller than 4KB (avoids tiny extra HTTP requests)
    assetsInlineLimit: 4096,
    // Faster build: skip compressed size reporting (only needed for analysis)
    reportCompressedSize: false,
    // Increase chunk size warning threshold (lucide-react is legitimately large)
    chunkSizeWarningLimit: 1000,
  },
});
