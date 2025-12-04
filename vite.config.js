import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    headers: {
      // Permitir cookies de terceros para Mercado Pago
      'Set-Cookie': 'SameSite=None; Secure',
      // Headers de CORS
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // Permisos para iframes
      'Permissions-Policy': 'payment=*, geolocation=*, microphone=*, camera=*'
    }
  }
})
