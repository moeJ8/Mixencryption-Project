# MixEncryption

Hybrid cryptographic MERN course project. See [PROJECT.md](./PROJECT.md) for the full spec.

## Local development (no Docker)

```powershell
cd server
copy .env.example .env
npm run dev

cd client
npm run dev
```

- UI: http://localhost:5173  
- API: http://localhost:5000/api/health  
- Vite proxies `/api/*` to the local Express server.

## Production (Option A)

| Part | Host | How |
|------|------|-----|
| **Client** | Vercel | Project root `client`, build `npm run build`, output `dist`, Node **24**. Env: `VITE_API_URL=https://<your-api>.onrender.com` |
| **API** | Render | **Docker** from repo-root `Dockerfile` (see `render.yaml`). Render builds the image in the cloud — you do **not** need Docker Desktop on your PC. |
| **Database** | MongoDB Atlas | `MONGO_URI` on Render |

### Render env (dashboard)

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS=https://your-app.vercel.app` (comma-separated if you add preview URLs)
- `NODE_ENV=production` (also in `render.yaml`)
- `PORT` is set by Render automatically

Connect the repo to Render and use **Blueprint** (`render.yaml`) or create a **Web Service → Docker**, with Dockerfile path `./Dockerfile` and context `.`.

## Node

Node **24.x** locally and on Vercel (`engines` in `package.json` files).
