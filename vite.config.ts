
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Базовий шлях '/' для кореневої директорії хостингу
  // Якщо сайт буде в підкаталозі, вкажіть відповідний шлях, наприклад '/mysite/'
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Розділення vendor коду на окремі частини
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-toast', 
            '@radix-ui/react-label', 
            '@radix-ui/react-tooltip', 
            'sonner'
          ],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-utils': ['date-fns', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
