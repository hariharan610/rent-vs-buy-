import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['413a-2406-7400-1c3-9a61-668-74ff-fedf-1385.ngrok-free.app'],
  },
})
