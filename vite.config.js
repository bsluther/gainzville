import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_SERVER_URL,
        // target: 'http://localhost:7777',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/v2end': {
        target: import.meta.env.VITE_SERVER_URL,
        // target: 'http://localhost:7777',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/v2end/, '/api')
      }
    }
  }
})
