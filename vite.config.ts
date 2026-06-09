import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              if (id.includes('framer-motion') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
    },
  };
});
