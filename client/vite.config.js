import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production' && !process.env.VITE_API_URL?.trim()) {
    console.warn(
      '[MixEncryption] VITE_API_URL is unset. Production builds need it (Render API origin, no trailing slash).',
    );
  }

  return {
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  };
})
