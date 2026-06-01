import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './packages/shared'),
      '@seo': path.resolve(__dirname, './packages/seo'),
      '@geo': path.resolve(__dirname, './packages/geo'),
      '@build': path.resolve(__dirname, './packages/build'),
      '@sites': path.resolve(__dirname, './sites')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
