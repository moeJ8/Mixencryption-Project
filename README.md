# MixEncryption

**Introduction to Cryptography (CYS533), Üsküdar University, Institute of Science**

Full-stack web app that encrypts user data in the browser and stores only ciphertext on the server. The design follows the Phase I report: standard hybrid encryption (AES-256-GCM + RSA-2048-OAEP), not a new cipher.

Detailed specification, threat model, API targets, and week-by-week plan: [PROJECT.md](./PROJECT.md). ERD figure: [docs/erd-mixencryption.svg](./docs/erd-mixencryption.svg).

**Stack:** React (Vite), Express, MongoDB Atlas. Node **24.x** (`engines` in each `package.json`).

**Repository:** https://github.com/moeJ8/Mixencryption-Project

---

## What the project is for

HTTPS protects data on the wire. After TLS terminates, a typical API still handles plaintext and often stores it in MongoDB. A database leak, compromised server, or privileged operator can then read user content.

MixEncryption keeps **payload plaintext and RSA private keys off the server**. Express handles identity (JWT in an HttpOnly cookie, roles `user` and `admin`) and stores **envelopes** only. Encrypt and decrypt run in the browser with the Web Crypto API before or after REST calls.

| Concern | Where it is enforced |
|--------|----------------------|
| Who is logged in, admin vs user | Server (JWT, RBAC) |
| Plaintext, AES session keys, unlocked RSA private key | Client only |

Admin can list users and read audit events. Admin is **not** a decrypt oracle for other users' vault data.

---

## Hybrid pipeline

Each payload gets a fresh AES-256-GCM key and IV. The AES key is wrapped with the owner's RSA-2048-OAEP public key. MongoDB stores the envelope (ciphertext, IV, auth tag, wrapped key, metadata). Optional DEFLATE runs before encryption.

```text
Plaintext
  → optional deflate
  → AES-256-GCM (ephemeral key, 96-bit IV, 128-bit tag)
  → RSA-OAEP-2048 wrap(session key with user's public key)
  → envelope stored in MongoDB

Decrypt (browser only, after password unwraps the private key):
  envelope → RSA unwrap → AES-GCM verify/decrypt → inflate → plaintext
```

Tampering with ciphertext, IV, or tag must fail GCM verification. The UI shows a generic decryption failure (no oracle-style error detail).

**Algorithms (locked for implementation):** AES-256-GCM (FIPS 197, NIST SP 800-38D), RSA-2048-OAEP with SHA-256 (RFC 8017), PBKDF2 for password-wrapped private keys, bcrypt for login passwords. PKCS #1 v1.5 encryption is not used.

**Out of scope for this prototype:** new cryptanalysis, multi-user key sharing, forward secrecy (HPKE/ECDH), searchable encryption, claiming the app replaces TLS or stops all OWASP issues by itself.

---

## Application features (target)

| Area | Purpose |
|------|---------|
| Auth | Register, login, logout, optional Google OAuth, profile and avatars; email verification and password reset |
| Keys | Generate RSA pair in browser; store public key and wrapped private key on server; unlock on login |
| Workspace | Encrypt text or files; upload envelope to API |
| Vault | List and decrypt own payloads only |
| Benchmarks | Latency, size overhead, throughput on fixed sizes (hybrid pipeline) |
| Crypto lab | Public symmetric primitive comparison; not used for vault |
| Documentation | In-app guide and API reference at `/docs` |
| Admin | User directory, profiles, audit log; no access to others' plaintext or vault decrypt |

**MongoDB collections:** `Users`, `AuditLogs`. `Payloads` (envelopes) is defined in the spec and not in the database yet.

---

## Implementation status (this repo)

| Shipped | Not yet |
|---------|---------|
| React UI, themes, routing, landing, toasts | RSA key ceremony, `POST/GET /api/keys` |
| Email/password auth, HttpOnly JWT, bcrypt, RBAC | Payload model and `/api/payloads` |
| Email verify, resend, forgot/reset password | Web Crypto hybrid pipeline in the client |
| Optional Google OAuth when `GOOGLE_*` env is set | Workspace and Vault encrypt/decrypt |
| Profile, activity log, Cloudinary avatars when configured | Benchmarks and Crypto lab (live runs) |
| Admin: users, edit/delete, user profiles, avatar admin, audit | GCM tamper demo, envelope storage |
| `/docs` sections (architecture, auth, API, deployment, etc.) | `requireEmailVerified` on crypto routes |

Sign-in works before email verification. Encryption-related API routes will require a verified inbox when they are added.

User-facing detail is in the app under **Documentation** (`/docs`). Spec and report material stays in [PROJECT.md](./PROJECT.md).

---

## Prerequisites

- Node 24+
- MongoDB reachable from the API (local or Atlas URI in `server/.env`)
- SMTP in `server/.env` for real verification and reset mail, or leave unset and use links from the API log in development (see `server/.env.example`)
- Optional: `GOOGLE_*` for OAuth, `CLOUDINARY_*` for profile photos

## Run locally

Install dependencies once in `server` and `client`, then run both dev servers (two terminals).

```bash
cd server
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

From the repo root: `npm run dev:server` and `npm run dev:client`.

| | URL |
|---|-----|
| UI | http://localhost:5173 |
| API health | http://localhost:5000/api/health |

In development, the UI can call `/api/*` on port 5173; Vite proxies those requests to Express on port 5000.

## Production layout

| Component | Host | Notes |
|-----------|------|--------|
| Client | Vercel | Root directory `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to your Render API origin (no trailing slash). |
| API | Render | Docker image from `./Dockerfile` (see [render.yaml](./render.yaml)). Render builds the image; local Docker is optional. |
| Database | MongoDB Atlas | `MONGO_URI` on Render |

**Render environment variables** (dashboard, not in git):

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGINS` (Vercel production URL; add preview URLs comma-separated if you test previews)
- `CLIENT_APP_URL` (same as primary Vercel URL, for email links and OAuth redirects after login)
- `NODE_ENV=production` (also in `render.yaml`)
- SMTP variables for production mail (see `server/.env.example`)
- Optional: `GOOGLE_*`, `CLOUDINARY_*` (same names as in `server/.env.example`)
- `GOOGLE_CALLBACK_URL` optional on Render: defaults to `RENDER_EXTERNAL_URL` + `/api/auth/google/callback`
- `PORT` (set by Render)

**Vercel (client):**

- Root directory `client`
- `VITE_API_URL` = Render service URL (no trailing slash)
- `VITE_APP_URL` = Vercel site URL (no trailing slash, for Open Graph and canonical links)
- `client/vercel.json` rewrites SPA routes to `index.html`

**Google Cloud Console:** authorized redirect URI must match the callback URL above (Render API host, not Vercel).

Connect the GitHub repo on Render via Blueprint (`render.yaml`) or a Web Service with Docker, Dockerfile `./Dockerfile`, context `.`.

---

For citations, metrics formulas, UI screenshot checklist, and report-ready sentences, use [PROJECT.md](./PROJECT.md).
