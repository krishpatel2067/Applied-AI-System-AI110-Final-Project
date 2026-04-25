import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 — no tailwind.config.js needed
  ],
  resolve: {
    alias: {
      // Allows importing from "@/components/..." instead of "../../components/..."
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
