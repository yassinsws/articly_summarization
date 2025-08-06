import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections (for Docker)
    port: 3000,
          proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:1337',
          changeOrigin: true,
        },
      },
  },
  build: {
    outDir: 'build',
  },
})