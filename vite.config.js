import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
 // vite.config.js — proxy set කරලා තිබෙනවා ද?
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // Gateway
      changeOrigin: true,
    }
  }
}
})