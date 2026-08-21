import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // import.meta.dirname avoids needing Node globals in this ESM config.
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
