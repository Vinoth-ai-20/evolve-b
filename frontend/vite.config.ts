import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2023",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules/react")) return "vendor-react";
          if (id.includes("node_modules/recharts")) return "vendor-charts";
          if (id.includes("node_modules/zustand")) return "vendor-state";
          if (id.includes("node_modules/axios")) return "vendor-http";

          // Feature chunks
          if (id.includes("components/simulation")) return "chunk-simulation";
          if (id.includes("components/analytics")) return "chunk-analytics";
          if (id.includes("components/inspector")) return "chunk-inspector";
          if (id.includes("components/controls")) return "chunk-controls";
        },
      },
    },
  },
  server: {
    middlewareMode: false,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});