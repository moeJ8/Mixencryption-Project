# MixEncryption — Project Idea, Cryptographic Laws, Stack, and Implementation Plan

**Course:** Introduction to Cryptography (CYS533/1) — Üsküdar University, Institute of Science  
**Project title:** MixEncryption: A Full-Stack Hybrid Cryptographic Framework  
**Stack:** MERN (MongoDB Atlas, Express.js, React.js v18+, Node.js)  
**Horizon:** 4 weeks (Phase I UI + auth now; cryptographic engine and benchmarks after)

This document is the working specification. It restates the idea from the Phase I report, locks the algorithms and standards (the “laws”) cited in that report, and records the implementation decisions needed to build the prototype without contradicting the threat model.

---

## 1. Project idea (one paragraph)

MixEncryption is a full-stack hybrid encryption workspace. The **browser** optionally compresses a text or file payload, encrypts it with an **ephemeral AES-256-GCM** key, and wraps that key with the user’s **RSA-2048-OAEP** public key. MongoDB stores only the resulting envelope \(\Omega\) (ciphertext, IV, authentication tag, wrapped session key, metadata). Express authenticates users and enforces ownership; it never sees plaintext, the AES session key, or a raw RSA private key. Evaluation is by integrity-failure tests (GCM tag) and by latency, ciphertext expansion, and throughput on fixed payload sizes.

The system does **not** invent a new cipher. It implements a standard hybrid (KEM + AEAD) envelope at the application layer, following the Phase I report: *“The system does not invent a new cryptographic cipher; instead, it defines a standard, deterministic application-layer pipeline that integrates established OWASP-approved ciphers into a hybrid flow.”*

### 1.1 Problem

TLS/HTTPS protects data **in transit**. After TLS is terminated, typical web APIs hold plaintext in application memory and often store it in the database. A stolen MongoDB dump, a compromised Node process, or an inquisitive administrator can then read everything. Symmetric encryption alone is fast but leaves the session-key distribution problem unsolved; asymmetric encryption alone is too slow and size-limited for files.

### 1.2 Solution

Hybrid cryptography, as specified in Phase I:

- **AES-256-GCM** encrypts bulk payloads (confidentiality + integrity).
- **RSA-2048-OAEP** protects the short AES session key.
- **Client-side Web Crypto** performs encrypt/decrypt **before** the REST call, so the server is a ciphertext store, not a decrypt oracle.
- **JWT + RBAC** decide *who may fetch envelopes*. They do not grant the server the ability to read plaintext.

Two separate trust rules (do not mix them):

| Layer | Who is authoritative | Meaning |
|---|---|---|
| Identity and permissions | **Server** | Role comes from the JWT cookie, never from the React client. |
| Secrets and payloads | **Client (user keys)** | Private key is password-wrapped; AES keys are ephemeral and never sent to Express. |

Do not market this as a full NIST Zero Trust Architecture. Phase I cites NIST SP 800-207 as the *guiding idea* that data must stay protected even if the network or server boundary is untrusted. In this prototype that idea is implemented as **application-layer hybrid encryption + server-side access control**.

### 1.3 What is in scope / out of scope

**In scope**

- Hybrid envelope: compress (optional) → AES-256-GCM → RSA-OAEP wrap → MongoDB \(\Omega\)
- Email/password auth, HttpOnly JWT, roles `user` and `admin`
- Personal encrypted vault (owner-only)
- Bit-flip / GCM tag-failure demonstration
- Benchmarks: latency split, size overhead, throughput
- Append-only style audit logs

**Out of scope (state this in the report)**

- New cryptanalysis or security proofs
- Sharing a payload with another user’s public key (Phase 3)
- Forward secrecy (RSA wrapping is not PFS; that would need ephemeral ECDH / HPKE)
- Google OAuth, Nodemailer, forgot-password (v1)
- Searchable encryption over ciphertext
- Claiming AES “solves” CSRF, NoSQL injection, or MitM by itself

---

## 2. MixEncryption explanation (the hybrid engine)

Traditional symmetric ciphers are efficient for large files but complicate key distribution. Asymmetric ciphers secure key exchange but cannot encrypt large payloads (RSA-OAEP plaintext is limited to \(k - 2\cdot hLen - 2\) bytes; for RSA-2048 with SHA-256 that is 190 bytes). MixEncryption therefore uses each primitive for the job it is good at — the same design idea as PGP, CMS, and HPKE (RFC 9180).

```text
Plaintext P
    │
    ▼
[1] deflate compression (optional)     →  Cp
    │
    ▼
[2] AES-256-GCM (ephemeral K_aes, IV)  →  Ed, Ta
    │
    ▼
[3] RSA-OAEP-2048 wrap(K_aes, PK_user) →  Wk
    │
    ▼
[4] Envelope Ω stored in MongoDB
```

Decrypt is the reverse, **only in the browser** that holds the unlocked RSA private key:

```text
Ω  →  RSA-OAEP unwrap(Wk)  →  K_aes
   →  AES-GCM decrypt(Ed, IV, Ta, AAD)  →  Cp
   →  inflate  →  P
```

If any byte of \(E_d\), \(IV\), \(T_a\), or AAD is changed, GCM tag verification fails immediately. The UI shows one generic error: **“Decryption failed.”** That matches Phase I §3.9 (no padding-oracle-style distinct errors).

---

## 3. Cryptographic laws, algorithms, and standards

These are the **laws** MixEncryption obeys. Names, roles, and justifications are taken from the Phase I report (pipeline §3.5, literature §2, appendix, and measurement §3.8). Official standard identifiers are listed so the report can cite them precisely.

### 3.1 Core hybrid suite (locked — do not leave “or ECC” open in code)

| Primitive | Parameters (from Phase I) | Official law / standard | Role in MixEncryption |
|---|---|---|---|
| **AES** | 256-bit key | FIPS 197 — Advanced Encryption Standard | Bulk confidentiality |
| **GCM** | 96-bit IV, 128-bit tag | NIST SP 800-38D — Galois/Counter Mode | Authenticated encryption (AEAD): confidentiality + integrity in one mode |
| **RSA** | 2048-bit modulus | FIPS 186-4/186-5; PKCS #1 | Asymmetric key wrapping only (never bulk files) |
| **OAEP** | Hash = SHA-256 | RFC 8017 (PKCS #1 v2.2) RSAES-OAEP | Padding for RSA encryption; forbids PKCS #1 v1.5 (Bleichenbacher) |
| **SHA-256** | 256-bit digest | FIPS 180-4 | OAEP hash; AAD/hash uses where needed |
| **DEFLATE / zlib** | `deflate` before encrypt | RFC 1951 (DEFLATE), RFC 1950 (zlib) | Optional pre-encryption compression (Phase I Step 1) |
| **PBKDF2** | SHA-256, unique salt, high iteration count | RFC 8018 / NIST SP 800-132 | Derive a wrap-key from the user password to seal the RSA private key |
| **bcrypt** | Password hash at rest | OpenBSD bcrypt (provable work factor) | Store login passwords in `Users.passwordHash` (Phase I §3.6) |

**Locked sentence for code and report**

> MixEncryption uses **AES-256-GCM** (FIPS 197 + NIST SP 800-38D) with a **unique 96-bit IV and a fresh 256-bit key per payload**, and **RSA-2048-OAEP with SHA-256** (RFC 8017) to wrap that key. PKCS #1 v1.5 encryption is not used.

### 3.2 Pipeline equations (Phase I §3.5)

**Step 1 — Compression**

\[
C_p = \mathrm{zlib.deflate}(P)
\]

Implementation note: this runs in the **browser** (`CompressionStream('deflate')` or `pako`), not Node `zlib`, so plaintext never reaches Express. Compression is a UI toggle (default **off** for secret messages, **on** for size benchmarks). If compression is on, pad \(C_p\) to a fixed block (e.g. 1 KiB) so ciphertext length leaks less (CRIME/BREACH; Phase I §2.3 and §3.2).

**Step 2 — Authenticated symmetric encryption**

Generate ephemeral \(K_{aes}\) (256-bit) and unique \(IV\) (96-bit):

\[
(E_d,\ T_a) = \mathrm{AES\text{-}256\text{-}GCM}(K_{aes},\ IV,\ C_p,\ \mathit{AAD})
\]

- \(E_d\): ciphertext  
- \(T_a\): 128-bit authentication tag  
- **AAD** (implementation refinement of Phase I): bind `ownerId`, `fileName`, `originalSize` so metadata cannot be swapped without failing the tag. Phase I wrote GCM without AAD; adding AAD does not change the cipher, it uses GCM as specified in SP 800-38D.

**Invariant:** one \(K_{aes}\) per payload, then discard. IV reuse under the same key is then impossible.

**Step 3 — Asymmetric key wrapping**

\[
W_k = \mathrm{RSA\text{-}OAEP\text{-}2048}(\mathit{PublicKey}_{RSA},\ K_{aes})
\]

The public key is **the authenticated user’s own key**, not a server key and not “a recipient” until a future sharing feature exists.

**Step 4 — Envelope (Phase I) plus AAD/metadata**

Phase I:

\[
\Omega = \{ E_d,\ IV,\ T_a,\ W_k,\ \mathrm{Timestamp} \}
\]

Stored BSON (this prototype):

\[
\Omega = \{ E_d,\ IV,\ T_a,\ W_k,\ \mathit{AAD},\ \mathit{metadata},\ \mathrm{createdAt} \}
\]

### 3.3 Measurement laws (Phase I §3.8)

\[
T_{\mathrm{total}} = T_{\mathrm{compress}} + T_{\mathrm{encrypt}} + T_{\mathrm{key\_wrap}} + T_{\mathrm{transit}} + T_{\mathrm{decrypt}}
\]

\[
R_{\mathrm{size}} = \frac{\mathrm{Size}(\Omega)}{\mathrm{Size}(P)} \times 100\%
\]

Throughput in MB/s on three bands from Phase I §3.7:

| Band | Size |
|---|---|
| Small | 1 KB – 10 KB |
| Medium | 100 KB – 500 KB |
| Large | 1 MB – 5 MB |

### 3.4 Architecture and application-security standards (Phase I appendix)

| Standard (from Phase I Appx. 1) | How MixEncryption uses it |
|---|---|
| **NIST SP 800-207 — Zero Trust Architecture** | Do not assume the network or the server is safe. Protect payloads at the application layer so a compromised transport or DB dump is not enough. |
| **RFC 9180 — Hybrid Public Key Encryption (HPKE)** | Design *principle*: KEM (RSA-OAEP wrap) + KDF/AEAD (AES-GCM). This prototype is a pedagogical envelope, not a byte-for-byte HPKE library. |
| **OWASP Application Security** | Helmet, rate limiting, input validation, generic errors, HttpOnly cookies, parameterized Mongoose queries. |
| **Web Crypto API (W3C)** | Native `crypto.subtle` in React: AES-GCM, RSA-OAEP, PBKDF2, CSPRNG. No `crypto-js` / `node-forge` for payloads. |
| **MERN architecture** | React 18+ UI, Express REST, MongoDB Atlas for BSON envelopes and audit logs. |

### 3.5 Transport, tokens, and passwords (Phase I software section)

| Mechanism | Law / spec | Use |
|---|---|---|
| **HTTPS / TLS** | TLS 1.2+ (production); TLS 1.3 prefers AEAD-only suites | Protects the channel; **not** a substitute for \(\Omega\) |
| **JWT** | RFC 7519 | Session identity in an **HttpOnly, Secure, SameSite=Lax** cookie |
| **RBAC** | Application policy | `user` vs `admin`; server ignores any role sent by the client |
| **bcrypt** | Adaptive password hashing | `passwordHash` only; never store raw passwords |

### 3.6 Integrity and failure laws (Phase I §1 Integrity, §3.9)

| Rule | Implementation |
|---|---|
| GCM tag \(T_a\) authenticates \(E_d\) (and AAD) | Bit-flip of ciphertext or IV → decrypt abort |
| Same generic error on every crypto failure | Prevents padding-oracle / distinguishable unwrap errors |
| No stack traces to the client | Express error middleware |
| Audit `TAMPER_DETECTED` | Vault bit-flip demo and failed GCM |

Phase I also mentioned SHA-256 hashing in middleware. **GCM already authenticates the ciphertext.** Do not add a second ad-hoc hash unless it is clearly an audit checksum over the whole envelope. Prefer GCM AAD + \(T_a\).

### 3.7 Why these laws (from Phase I literature, short)

| Choice | Why Phase I argues it |
|---|---|
| Hybrid AES + RSA, not RSA-only | RSA-OAEP cannot encrypt bulk data; RSA is expensive (literature on hybrids / HPKE). |
| AES-GCM, not AES-CBC | Unauthenticated CBC + padding oracles (POODLE-class, Espinoza Figueroa). TLS 1.3 dropped non-AEAD suites. |
| OAEP, not PKCS #1 v1.5 | Bleichenbacher-style oracles; Phase I: *“MixEncryption only uses OAEP and returns the same generic error for every decryption failure.”* |
| Compress-then-encrypt | Shan et al.: encrypt-then-compress destroys ratio; compress-then-encrypt keeps it. Song et al.: length leakage (CRIME) — hence padding / toggle. |
| Web Crypto, not a JS AES library | Buljić et al.: hybrid RSA-AES is feasible in the browser; bottleneck moves to symmetric ops once AES-GCM does bulk data. |
| Application-layer vs TDE | TDE protects disks, not application memory. Mylar/Arx-style: keep secrets encrypted w.r.t. the server. |

### 3.8 Laws we explicitly do **not** use

| Avoid | Reason |
|---|---|
| RSA PKCS #1 v1.5 encryption | Oracle attacks |
| AES-CBC without Encrypt-then-MAC | Padding oracles, bit flipping |
| Static RSA key reuse for many AES messages **with the same AES key** | GCM IV uniqueness is per-key; we solve this by making \(K_{aes}\) ephemeral |
| Server `/decrypt` | Breaks the “compromised server cannot read P” claim |
| Storing RSA private keys in PEM on the server | A DB dump becomes total compromise |

---

## 4. Threat model (who can read what)

| Adversary | Reads payload plaintext? |
|---|---|
| Network attacker (HTTPS in production) | No |
| Stolen MongoDB | No — only \(\Omega\) and a **wrapped** private key |
| Compromised Express, no user password | No |
| Stolen JWT | Can fetch **that user’s** envelopes; still needs the unlocked private key to decrypt |
| Password + DB dump | Yes — password unwraps the RSA key, then \(W_k\), then AES |
| Admin | Audit logs and user list only — **not** other users’ plaintext |
| XSS / malware in the victim browser | Yes — it can call Web Crypto as the user |

Admin is **not** a global decrypt oracle.

---

## 5. User flows

### 5.1 Guest (no account, no cookie)

Sees landing page, project explanation, pipeline diagram, and optional static benchmark charts. Can open **Crypto lab**, **Documentation** (`/docs`, no account required), Sign in / Register. **Cannot** encrypt, decrypt, or call `/api/payloads` or `/api/keys`. Guests are **not** documents in `Users`.

### 5.2 User (`role: 'user'`)

**Register (first time)**

1. Submit name, username, email, password.  
2. Server bcrypt-hashes the password, inserts `Users`, sets JWT cookie, writes `SIGNUP`.  
3. Browser generates RSA-2048-OAEP key pair.  
4. PBKDF2(password) → AES-GCM wrap of the private key.  
5. `POST /api/keys` with `{ publicKeyPem, wrappedPrivateKey, wrapIv, kdfSalt, kdfIterations }`.  
6. Private key remains in React memory for this tab.

**Email verification (session policy)**

Registration sends a verification link (Nodemailer). You can sign in while unverified so Profile and the unverified badge work. Sensitive features (keys, payloads, vault) can later use `requireEmailVerified` middleware (`server/middleware/requireEmailVerified.js`).

**Later login**

1. Password verified → JWT cookie → `LOGIN`.  
2. `GET /api/keys/me` → PBKDF2(password) unwraps the private key into memory.  
3. Logout clears the cookie and wipes the in-memory key.

**Encrypt (Workspace)**

Text or file → optional deflate → AES-256-GCM + AAD → RSA wrap with **own** public key → show \(\Omega\) → `POST /api/payloads` → vault row (encrypted badge only).

**Decrypt (Vault)**

List own items → fetch \(\Omega\) → unwrap → GCM decrypt → inflate.  
**Bit-flip demo:** flip one byte of \(E_d\) or \(IV\) locally → generic failure → `TAMPER_DETECTED`.

User B cannot `GET` user A’s payload (403).

### 5.3 Admin (`role: 'admin'`)

Same personal workspace and vault as a user. Extra: user list (no hashes, no wrapped keys) and audit feed. Seed the first admin in the database; public register always creates `user`.

---

## 6. Data model (MongoDB equivalent of an ERD)

Three collections. Lines are `ObjectId` references. Envelope fields are **embedded**, not a fourth collection.

```text
Users  1 ──────── <  Payloads     ownerId
Users  1 ──────── <  AuditLogs    userId (optional)
```

**Users**

- `name`, `username` (unique), `email` (unique)
- `passwordHash` (bcrypt)
- `role`: `user` | `admin`
- `publicKeyPem`
- `wrappedPrivateKey`, `wrapIv`, `kdfSalt`, `kdfIterations`
- `createdAt`

**Payloads**

- `ownerId` → Users
- `ciphertext` (\(E_d\)), `iv`, `authTag` (\(T_a\)), `wrappedKey` (\(W_k\)) — base64
- `metadata`: `{ fileName, mimeType, originalSize, compressedSize }` (embedded)
- `createdAt`

**AuditLogs** (insert only; no update/delete routes)

- `userId` (optional, for failed logins)
- `action`: `SIGNUP` | `LOGIN` | `LOGIN_FAILURE` | `KEY_REGISTER` | `ENCRYPT_PAYLOAD` | `DECRYPT_PAYLOAD` | `TAMPER_DETECTED`
- `ipAddress`, `status` (`SUCCESS` | `FAILURE`), `details`, `timestamp`

MongoDB is not physically immutable. “Immutable logs” in this project means **no API to edit or delete them**.

---

## 7. Tech stack and libraries

### 7.1 Runtime and hosting (Phase I)

| Layer | Choice |
|---|---|
| Frontend | React.js v18+, Vite, Tailwind CSS, deployed later on Vercel |
| Backend | Node.js v20+, Express.js, later on Render |
| Database | MongoDB Atlas (BSON envelopes) |
| Crypto execution | Chrome V8 — Web Crypto API in the browser |
| Benchmark browser | Chrome (Phase I §3.7) |

### 7.2 Frontend packages

| Package | Why |
|---|---|
| `react` + `react-dom` | UI |
| `vite` | Dev/build |
| `react-router-dom` | Landing, login, workspace, vault, benchmarks, admin |
| `tailwindcss` | Dark control-panel layout |
| `axios` | REST with `withCredentials: true` |
| `recharts` | Latency, \(R_{size}\), throughput charts |
| `lucide-react` | Icons (optional) |
| `pako` | Only if `CompressionStream` is not enough |

**Native browser APIs (not npm) — this is the crypto stack**

| API | Algorithms |
|---|---|
| `crypto.subtle.generateKey` | AES-GCM-256, RSA-OAEP-2048 SHA-256 |
| `crypto.subtle.encrypt` / `decrypt` | AES-256-GCM with IV + `additionalData` (AAD) |
| `crypto.subtle.wrapKey` / `unwrapKey` | RSA-OAEP-SHA-256 |
| `crypto.subtle.deriveKey` | PBKDF2-SHA-256 |
| `crypto.getRandomValues` | IV and salts |
| `CompressionStream('deflate')` | Phase I Step 1 in the browser |

**Do not use for payloads:** `crypto-js`, `jsencrypt`, `node-forge`.

### 7.3 Backend packages

| Package | Why |
|---|---|
| `express` | REST (`/api/auth`, `/api/keys`, `/api/payloads`, `/api/admin`, `/api/audit`) |
| `mongoose` | Schemas |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT (RFC 7519) |
| `cookie-parser` | HttpOnly cookie |
| `cors` | Frontend origin + credentials |
| `helmet` | OWASP-aligned headers (Phase I appendix) |
| `express-rate-limit` | Auth brute-force limit |
| `dotenv` | `MONGO_URI`, `JWT_SECRET` |
| `zod` | Validate register/login bodies |

Dev: `nodemon` (and `concurrently` if one script starts both apps).

**Do not implement payload encrypt/decrypt with Node `crypto` or Node `zlib`.** Those stay in the browser so the threat model holds.

### 7.4 Libraries deferred (not v1)

`passport`, `passport-google-oauth20`, `nodemailer`, Redux/Zustand, `socket.io`, `multer`.

### 7.5 Install commands (when scaffolding)

```bash
npm create vite@latest client -- --template react
cd client
npm i react-router-dom axios recharts lucide-react
npm i -D tailwindcss @tailwindcss/vite
```

```bash
mkdir server && cd server && npm init -y
npm i express mongoose bcryptjs jsonwebtoken cookie-parser cors helmet express-rate-limit dotenv zod
npm i -D nodemon
```

---

## 8. Directory structure

```text
mixencryption/
├── PROJECT.md                 # this specification
├── README.md
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/           # AuthContext: user + in-memory private CryptoKey
│   │   ├── pages/             # Landing, Login, …, CryptoLab, Documentation, Admin
│   │   ├── utils/crypto/      # compress, aesGcm, rsaOaep, kdf, envelope; labBenchmarks, labPrimitives
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── config/                # db.js
│   ├── middleware/            # requireAuth, requireRole, errorHandler, rateLimit
│   ├── models/                # User, Payload, AuditLog
│   ├── routes/                # auth, keys, payloads, admin
│   ├── server.js
│   └── package.json
└── .env.example
```

---

## 9. API surface (target)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create user, set cookie |
| POST | `/api/auth/login` | Public | Cookie JWT |
| POST | `/api/auth/logout` | Public | Clear cookie |
| GET | `/api/auth/me` | Cookie | Current user (no key material) |
| POST | `/api/keys` | User | Store public + wrapped private blob |
| GET | `/api/keys/me` | User | Own public key + wrap blob |
| POST | `/api/payloads` | User | Store \(\Omega\) as owner |
| GET | `/api/payloads` | User | List **own** envelopes |
| GET | `/api/payloads/:id` | Owner | Fetch one \(\Omega\) |
| DELETE | `/api/payloads/:id` | Owner | Delete own item |
| GET | `/api/admin/users` | Admin | User directory |
| GET | `/api/admin/audit` | Admin | Audit feed |

There is **no** `POST /api/decrypt`.

JWT cookie flags: `httpOnly`, `secure` in production, `sameSite: 'lax'`, CORS `origin` = frontend, `credentials: true`. Never put the JWT in `localStorage`.

---

## 10. UI views (for Phase I screenshots and the final demo)

Dark Tailwind shell.

1. **Landing** — idea, 4-step pipeline, threat-model blurb.  
2. **Sign in / Register** — real auth.  
3. **Workspace** — text or drag-and-drop file, compress toggle, live steps, final \(\Omega\).  
4. **Vault** — envelope list, decrypt, bit-flip button.  
5. **Benchmarks** — Recharts for \(T_{\mathrm{total}}\) split, \(R_{size}\), MB/s on the **hybrid pipeline** (compress, AES-GCM, RSA wrap).  
6. **Crypto lab** — symmetric primitive comparison table; see §10.1.  
7. **Documentation** — project write-up outline; see §10.2.  
8. **Admin** — users + audit table.

### 10.1 Crypto lab (primitive benchmarks)

**Purpose:** Compare AEAD and legacy symmetric modes on throughput, without letting users pick arbitrary ciphers for the vault.

| Concern | Crypto lab | Workspace / Vault |
|---|---|---|
| Goal | Compare **symmetric** primitives on fixed random payloads | Store user data as hybrid envelope \(\Omega\) |
| Algorithms | AES-GCM, ChaCha20-Poly1305, AES-CBC (labeled non-AEAD), plus **reference** rows for AES-CCM and 3DES when Web Crypto does not expose them | **Locked:** AES-256-GCM bulk + RSA-2048-OAEP wrap only |
| Persistence | None; no `POST /api/payloads` | Envelopes in MongoDB |
| Auth | Public route `/lab` (nav: Crypto lab) | Protected |

**Method (Week 4 implementation):**

1. User selects payload size (1 KB … 5 MB, same ladder as Benchmarks).  
2. **Run comparison** generates random bytes, warm-up, then median time over N encrypt+decrypt rounds per primitive.  
3. Table columns: algorithm, execution time (s), throughput (MB/s), source (`Live (Web Crypto)` vs `Reference (documented)`).  
4. Optional Recharts bar chart for live rows only.  
5. UI banner: lab results are not vault encryption settings.

**Code layout (target):**

- `client/src/pages/CryptoLabPage.jsx` — UI (placeholder in Phase I).  
- `client/src/utils/crypto/labBenchmarks.js` — orchestration and statistics.  
- `client/src/utils/crypto/labPrimitives.js` — per-algorithm round-trip helpers with feature detection for ChaCha20-Poly1305.

**Report:** One evaluation subsection for symmetric primitive comparison, separate from hybrid \(T_{\mathrm{total}}\) on the Benchmarks page.

### 10.2 Documentation page

**Purpose:** Single in-app place for the finished project narrative, user guide, API notes, deployment, evaluation summary, and changelog.

| Concern | Documentation page | PROJECT.md |
|---|---|---|
| Audience | Report helpers, demo walkthrough, visitors | Locked spec and implementation plan |
| Auth | Public routes `/docs/:sectionSlug` (nav: Docs); sidebar + one URL per section | Not served in the UI |
| Content | `DocumentationLayout`, `DocSectionPage`, `content/documentationSections.js` | Root `PROJECT.md` (developer spec) |

**Phase I:** numbered outline cards with “pending” status. **Final:** replace placeholders with full section copy in the same React page (or split into section components under `components/docs/` if it grows).

**Sections:** Overview, Architecture, Cryptography, Authentication, User guide, API reference, Deployment, Evaluation and benchmarks, Threat model and limitations, Changelog.

---

## 11. Implementation plan (4 weeks)

Build **in this order**. Do not start Google OAuth. Do not add a server decrypt route.

### Week 1 — Phase I evidence (now)

**Goal:** real auth + clickable UI + ERD figure + screenshots.

1. Scaffold `client/` (Vite, React, Tailwind, Router) and `server/` (Express, helmet, cors, cookie-parser, mongoose).  
2. `.env.example` with `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `PORT`.  
3. Models: User, Payload, AuditLog (include key-wrap fields even if unused yet).  
4. Auth routes: register, login, logout, `/me`. bcrypt + JWT cookie + `requireAuth` + `requireRole('admin')`.  
5. Pages wired to auth; Workspace/Vault may still show placeholder envelopes.  
6. Screenshot: landing, login, register, workspace, vault, benchmarks, crypto lab, docs, admin.  
7. Draw the 3-collection diagram (Section 6) for the Phase I report.

### Week 2 — Key ceremony + owner-only blobs

1. Browser: generate RSA-OAEP-2048, PBKDF2 wrap/unwrap private key.  
2. `POST /api/keys`, `GET /api/keys/me`. Unlock on login; wipe on logout.  
3. Payload CRUD that stores opaque JSON; `ownerId === req.user.id`.  
4. Audit writes. Admin list/audit (no decrypt).  
5. Prove User B cannot read User A’s id.

### Week 3 — MixEncryption engine (the grade)

1. `client/src/utils/crypto/`: compress, AES-GCM+AAD, RSA wrap, envelope helpers.  
2. Workspace encrypts for real; Vault decrypts for real.  
3. Bit-flip demo + generic error + `TAMPER_DETECTED`.  
4. Confirm Mongo has no plaintext and no raw private keys.  
5. Self-test: hello round-trip; wrong password after refresh; 1-bit flip fails; cross-user 403.

### Week 4 — Numbers, polish, Phase II write-up

1. Benchmark 1 KB, 10 KB, 100 KB, 500 KB, 1 MB, 5 MB, with and without compression.  
2. Fill Benchmarks charts from real timings.  
3. Implement Crypto lab (`/lab`): live Web Crypto benchmarks where supported; reference timings for CCM/3DES when unsupported; Recharts optional.  
4. Rate-limit `/api/auth`, hide stack traces, README.  
5. Phase II report: threat model, pipeline laws, ERD, tables of \(T_{\mathrm{total}}\) and \(R_{size}\), primitive lab subsection, limitations (no PFS, compression length leakage, password is the root secret).

---

## 12. Report sentences (copy-ready)

**Title line**

> MixEncryption is a MERN reference implementation of hybrid encryption at the application layer: AES-256-GCM (FIPS 197, NIST SP 800-38D) protects payloads; RSA-2048-OAEP-SHA-256 (RFC 8017) wraps the ephemeral session key; the Web Crypto API (W3C) runs the pipeline in the browser; MongoDB stores only envelope \(\Omega\).

**Standards line (from Phase I appendix)**

> Design is guided by NIST SP 800-207 (do not trust the network or server with plaintext), RFC 9180 HPKE (KEM + AEAD composition), OWASP (Helmet, rate limits, safe tokens), and the W3C Web Crypto API.

**Honesty line (for marks)**

> This project does not claim a new cryptosystem or a complete Zero Trust deployment. It implements and measures a standard hybrid envelope, with GCM integrity tests and documented limits (no forward secrecy, optional compression length leakage, password-sealed private keys).

---

## 13. Phase I sources used in this spec

Pipeline, metrics, and appendix standards: Phase I Report v1, §§3.5–3.10 and Appx. 1.  
Algorithms: AES-256-GCM, RSA-OAEP-2048, zlib deflate, JWT, bcrypt, Web Crypto, Helmet/RBAC as named in that report.  
Literature pointers kept for the write-up: RFC 9180; NIST SP 800-207; AEAD vs CBC; CRIME/compress-then-encrypt; Web Crypto feasibility.

Official identifiers added for citation hygiene: FIPS 197, NIST SP 800-38D, RFC 8017, FIPS 180-4, RFC 1951, RFC 8018, RFC 7519.
