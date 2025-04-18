import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
})