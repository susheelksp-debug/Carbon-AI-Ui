import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  esbuild: {
    loader: "jsx", // 👈 Treat .js files as JSX
    include: /src\/.*\.[jt]sx?$/, // Apply to .js, .jsx, .ts, .tsx
    exclude: [],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Allow resolving these extensions
    alias: {
      '@': '/src',
      'src': '/src',
      'tslib': 'tslib/tslib.es6.js',
    },
  },
  optimizeDeps: {
    include: ['tslib'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Ensure .js files are treated as JSX
      },
    },
  },
})