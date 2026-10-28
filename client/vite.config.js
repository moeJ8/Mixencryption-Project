import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

import { SITE_NAME } from './src/utils/documentTitle.js'

const SITE_TITLE = SITE_NAME
const SITE_DESCRIPTION =
  'Application-layer hybrid encryption. AES-256-GCM and RSA key wrapping in the browser; authentication and audit on the server.'

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function siteMetaHtmlPlugin(mode) {
  return {
    name: 'mixencryption-site-meta',
    transformIndexHtml(html) {
      const appUrl = (process.env.VITE_APP_URL || '').trim().replace(/\/$/, '')
      const ogImagePath = '/og-image.jpg'
      const ogImage = appUrl ? `${appUrl}${ogImagePath}` : ogImagePath
      const title = escapeHtmlAttribute(SITE_TITLE)
      const description = escapeHtmlAttribute(SITE_DESCRIPTION)

      const tags = [
        `<meta name="description" content="${description}" />`,
        '<meta name="application-name" content="MixEncryption" />',
        '<meta name="theme-color" content="#020617" />',
        '<meta name="color-scheme" content="dark light" />',
        '<link rel="manifest" href="/site.webmanifest" />',
        '<link rel="apple-touch-icon" href="/apple-touch-icon.jpg" sizes="180x180" />',
        '<meta property="og:type" content="website" />',
        '<meta property="og:site_name" content="MixEncryption" />',
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:image" content="${escapeHtmlAttribute(ogImage)}" />`,
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        '<meta property="og:image:alt" content="MixEncryption hybrid encryption web application" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        `<meta name="twitter:title" content="${title}" />`,
        `<meta name="twitter:description" content="${description}" />`,
        `<meta name="twitter:image" content="${escapeHtmlAttribute(ogImage)}" />`,
      ]

      if (appUrl) {
        tags.push(`<meta property="og:url" content="${escapeHtmlAttribute(`${appUrl}/`)}" />`)
        tags.push(`<link rel="canonical" href="${escapeHtmlAttribute(`${appUrl}/`)}" />`)
      }

      if (mode === 'production' && !appUrl) {
        console.warn(
          '[MixEncryption] VITE_APP_URL is unset. Open Graph URLs may be relative until you set it on Vercel.',
        )
      }

      return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production' && !process.env.VITE_API_URL?.trim()) {
    console.warn(
      '[MixEncryption] VITE_API_URL is unset. Production builds need it (Render API origin, no trailing slash).',
    );
  }

  return {
  plugins: [react(), tailwindcss(), siteMetaHtmlPlugin(mode)],
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
