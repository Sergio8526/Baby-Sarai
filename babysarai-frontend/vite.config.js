/**
 * Configuración de Vite para el front-end de Baby Saraí.
 *
 * El "proxy" hace que las peticiones a /api que salen del navegador (puerto 5173)
 * se reenvíen al back-end de Express (puerto 3000). Así el front-end y la API
 * parecen estar en el mismo origen y no hace falta configurar CORS en el servidor.
 */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
