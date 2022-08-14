import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        ws:true
      }
    }
  },
  build: {
    target: 'esnext',
  },
});
