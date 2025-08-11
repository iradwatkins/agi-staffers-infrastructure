import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    emptyOutDir: true,
    
    rollupOptions: {
      output: {
        // Force proper JavaScript extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        },
        
        // Prevent .tsx extensions in output
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Force all TypeScript files to be treated as JS chunks
          if (id.includes('.tsx') || id.includes('.ts')) {
            return 'app';
          }
        },
      },
    },
    
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
  },
  
  server: {
    port: 5173,
    host: true,
  },
});