import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves committed dist/ at /react-mistakes/dist/
export default defineConfig({
  plugins: [react()],
  base: '/react-mistakes/dist/',
})
