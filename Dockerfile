# MixEncryption API — built on Render (no local Docker required).
# Frontend is deployed separately on Vercel (Option A).
FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY server/ ./

# Render sets PORT at runtime (often 10000).
EXPOSE 10000

CMD ["node", "server.js"]
