import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Asegúrate de que esté configurado correctamente
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
