import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/wp-content/themes/e-theme/assets/dist/', // как и было
  
  server: {
    allowedHosts: ["anni.bestfewo.de"],
  },
  build: {
    outDir: 'dist',       // как и было (assets/dist)
    emptyOutDir: true,    // как и было

    // 🔥 добавляем:
    manifest: true,
    rollupOptions: {
      input: './src/main.tsx', // твой entry (assets/src/main.tsx)
    },
  },
})
