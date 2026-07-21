import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    basicSsl(),
    cssInjectedByJsPlugin()
  ],
  server: {
    https: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Next.js dev server port
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../public',
    emptyOutDir: false, // Don't wipe Next.js public folder
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'widget.js',
        format: 'iife' // Immediately Invoked Function Expression for easy injection
      }
    }
  }
});
