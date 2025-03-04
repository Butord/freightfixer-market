
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/arm3/", // Базовий шлях для статичних файлів
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
          // Можна додати інші групи, якщо необхідно
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Збільшуємо ліміт попередження до 1000 кБ
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
