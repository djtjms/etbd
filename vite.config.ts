import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use relative paths for cPanel compatibility (./assets/ instead of /assets/)
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase warning limit and split large vendor chunks for better caching
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('@supabase') || id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('chart.js') || id.includes('apexcharts')) return 'vendor-charts';
            if (id.includes('lodash')) return 'vendor-lodash';
            return 'vendor';
          }
        }
      }
    }
  }
}));
