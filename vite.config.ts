import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: {
      clientPort: 8080,
    },
    port: 8080,
    strictPort: true,
    origin: 'http://0.0.0.0:8080',
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
});
