/** User-facing documentation for /docs/:sectionSlug */

export const DOC_SECTION_CONTENT = {
  overview: {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption is a web application for protecting personal data with hybrid encryption at the application layer. Your messages and files are encrypted in the browser before they are sent to the server. The server stores ciphertext and metadata only, not your plaintext or your RSA private key.',
      },
      {
        type: 'paragraph',
        text: 'The design combines AES-256-GCM for bulk data with RSA-2048-OAEP to protect each file’s session key. MixEncryption uses standard algorithms through the Web Crypto API; it does not introduce a custom cipher.',
      },
      { type: 'heading', level: 3, text: 'What you can do today' },
      {
        type: 'list',
        items: [
          'Create an account, sign in with email and password or Google (when enabled on the server)',
          'Verify your email, reset your password, and manage your profile and photo',
          'Review security activity on your account',
          'Administrators can manage users, view profiles, and read the global audit log',
        ],
      },
      { type: 'heading', level: 3, text: 'Encryption workspace' },
      {
        type: 'paragraph',
        text: 'Workspace encrypts text or files locally and saves envelopes to your account. Vault lists your envelopes and decrypts them only on your device. Benchmarks and the Crypto lab help compare performance and algorithms. These areas roll out as the encryption service is enabled on your deployment.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Technology stack',
        text: 'React single-page app, Express API, MongoDB database, Node.js runtime. The browser uses HTTPS and HttpOnly session cookies for authentication.',
      },
    ],
  },

  architecture: {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption separates who you are from what you encrypt. The server decides who is signed in and which envelopes they may download. Your browser holds plaintext, AES session keys, and your unlocked private key while you work.',
      },
      { type: 'heading', level: 3, text: 'In the browser' },
      {
        type: 'list',
        items: [
          'Sign in, manage profile, and use Workspace to prepare data for encryption',
          'Generate or unlock your RSA key pair with your account password',
          'Run AES-GCM encryption and RSA key wrapping before any upload',
          'Decrypt envelopes in Vault; plaintext never needs to live on the server',
        ],
      },
      { type: 'heading', level: 3, text: 'On the server' },
      {
        type: 'list',
        items: [
          'Accounts, roles, sessions, and audit logging',
          'Your public key and password-wrapped private key (never the raw private key)',
          'Encrypted envelopes tied to your user id',
          'No service that decrypts user payloads for admins or operators',
        ],
      },
      { type: 'heading', level: 3, text: 'Typical encrypt and decrypt flow' },
      {
        type: 'code',
        text: 'Encrypt: plaintext → (optional compress) → AES-GCM → RSA wrap → upload envelope\nDecrypt: download envelope → RSA unwrap → AES-GCM → plaintext',
      },
      { type: 'heading', level: 3, text: 'Stored data' },
      {
        type: 'table',
        headers: ['Area', 'Contents'],
        rows: [
          ['Users', 'Account details, role, verification status, key material references, optional profile photo URL'],
          ['Payloads', 'Your encrypted envelopes (ciphertext, IV, auth tag, wrapped key, file metadata)'],
          ['Audit log', 'Sign-in, account changes, encryption events, and admin actions'],
        ],
      },
    ],
  },

  cryptography: {
    blocks: [
      {
        type: 'paragraph',
        text: 'Hybrid encryption uses a fast symmetric cipher for files and messages and asymmetric encryption only for the small AES key that protects each payload. That pattern matches common secure messaging and file tools.',
      },
      { type: 'heading', level: 3, text: 'Algorithms' },
      {
        type: 'table',
        headers: ['Algorithm', 'Use in MixEncryption'],
        rows: [
          ['AES-256-GCM', 'Encrypts payload bytes; provides integrity via the authentication tag'],
          ['RSA-2048-OAEP (SHA-256)', 'Wraps each ephemeral AES key with your public key'],
          ['PBKDF2', 'Derives keys to protect your RSA private key at rest on the server'],
          ['bcrypt', 'Hashes your login password'],
          ['Optional DEFLATE', 'Compresses data before encryption when you choose that option'],
        ],
      },
      { type: 'heading', level: 3, text: 'Envelope contents' },
      {
        type: 'list',
        items: [
          'Ciphertext, initialization vector, and GCM authentication tag',
          'RSA-wrapped AES session key',
          'Metadata such as file name, type, and sizes (not the plaintext itself)',
        ],
      },
      {
        type: 'paragraph',
        text: 'If ciphertext or metadata is altered in storage, decryption fails and you see a generic decryption error. Distinct error messages are avoided so attackers cannot probe the system.',
      },
    ],
  },

  authentication: {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption uses server-side sessions backed by a signed token. Your password never travels or rests on the server in clear text. The web app does not store session secrets in browser storage where page scripts could read them.',
      },
      { type: 'heading', level: 3, text: 'Authentication flow' },
      {
        type: 'code',
        text: 'Register → (optional) verify email via one-time link token → Sign in\n→ Server checks password hash → Session cookie set in browser\n→ Each API request sends cookie → Server validates token and role\n→ Sign out clears the cookie',
      },
      {
        type: 'paragraph',
        text: 'With Google sign-in enabled, you authorize Google, return to MixEncryption, and receive the same kind of session cookie if the account links successfully. Local password is not required for Google-only accounts.',
      },
      { type: 'heading', level: 3, text: 'Password storage' },
      {
        type: 'list',
        items: [
          'Passwords are hashed with bcrypt before they are saved. The database stores the hash only, not your password.',
          'Login compares your entry to that hash. Wrong email or password returns one generic message so outsiders cannot guess which field failed.',
          'Password reset uses a short-lived token sent to your email; choosing a new password replaces the old hash.',
        ],
      },
      { type: 'heading', level: 3, text: 'How the session is secured' },
      {
        type: 'list',
        items: [
          'After sign-in, the API issues a signed JSON Web Token placed in an HttpOnly cookie. JavaScript on the page cannot read it, which reduces theft via cross-site scripting.',
          'The cookie is marked Secure in production so it is sent only over HTTPS.',
          'SameSite settings limit when the browser attaches the cookie on cross-site requests (stricter in production for split UI and API hosts).',
          'The token expires after seven days; signing out removes the cookie immediately.',
          'Protected routes reject missing, expired, or tampered tokens. Admin routes additionally require the admin role from the token, not from the client UI.',
        ],
      },
      { type: 'heading', level: 3, text: 'Registration and sign-in' },
      {
        type: 'list',
        items: [
          'Choose a display name, username (at least four characters), email, and a strong password',
          'Sign in with email or username plus password',
          'Use Google when your administrator has connected OAuth',
          'Repeated failed attempts may be temporarily rate limited',
        ],
      },
      { type: 'heading', level: 3, text: 'Email verification' },
      {
        type: 'list',
        items: [
          'Registration sends a one-time verification link to your inbox. The link contains a random token; only a hash of that token is stored on the server, and the token expires after a limited time.',
          'Open the link or paste it on the verify email page. A successful check marks your address verified and clears the token so it cannot be reused.',
          'Resend generates a fresh token and invalidates the previous link. You can resend from check email or your profile.',
          'You may sign in before verifying. Your profile shows Verified or Unverified. Sensitive actions such as encryption keys and vault access require a verified email when those features are enabled on the server.',
        ],
      },
      { type: 'heading', level: 3, text: 'Password reset' },
      {
        type: 'list',
        items: [
          'Request a reset link from the forgot password page',
          'The email contains a short-lived token (stored hashed on the server, same idea as verification)',
          'Open the reset page, set a new password before the token expires, then sign in with the new password',
        ],
      },
      { type: 'heading', level: 3, text: 'Guest flow' },
      {
        type: 'paragraph',
        text: 'Visitors who are not signed in can browse the home page, documentation, and Crypto lab without an account.',
      },
      {
        type: 'list',
        items: [
          'Login and register are for guests only. If you already have a session, those pages send you back to the home page.',
          'Check email, verify email, forgot password, and reset password stay available while signed in or out so links from email always work.',
          'Workspace, Vault, Benchmarks, and Profile require sign-in. If you open them as a guest, you are sent to login and can return after authenticating.',
        ],
      },
      { type: 'heading', level: 3, text: 'Access restrictions' },
      {
        type: 'table',
        headers: ['Who', 'Can access'],
        rows: [
          ['Guest', 'Home, docs, lab, and auth pages (login, register, email and password recovery)'],
          ['Signed-in user', 'Profile, Workspace, Vault, Benchmarks, and own activity'],
          ['Unverified email', 'Same as signed-in user for account pages; encryption-related API calls are refused until email is verified'],
          ['Admin', 'Everything a user can, plus Dashboard and other users profile pages (not their decrypted vault data)'],
          ['Non-admin', 'Cannot open Dashboard or another users profile URL (redirected to own profile)'],
        ],
      },
      { type: 'heading', level: 3, text: 'Roles' },
      {
        type: 'list',
        items: [
          'User: profile, Workspace, Vault, and Benchmarks for your own data',
          'Admin: user directory, audit log, and read-only view of other users profiles without access to their decrypted content',
        ],
      },
    ],
  },

  'user-guide': {
    blocks: [
      { type: 'heading', level: 3, text: 'Profile' },
      {
        type: 'list',
        items: [
          'Open Profile from the user menu for your photo, name, username, and verification status',
          'Upload a photo (JPEG, PNG, or WebP, up to 2 MB) when photo storage is enabled',
          'See when you joined and a timeline of security events for your account',
        ],
      },
      { type: 'heading', level: 3, text: 'Workspace' },
      {
        type: 'paragraph',
        text: 'Enter text or choose a file, optionally enable compression, then encrypt. The app uploads an envelope tied to your account. Plaintext stays on your device during encryption.',
      },
      { type: 'heading', level: 3, text: 'Vault' },
      {
        type: 'paragraph',
        text: 'Browse envelopes you own. Unlock your keys if prompted, then decrypt to view or download content. You only see your own payloads.',
      },
      { type: 'heading', level: 3, text: 'Benchmarks and Crypto lab' },
      {
        type: 'paragraph',
        text: 'Benchmarks measure time and size overhead of the hybrid pipeline on standard test sizes. The Crypto lab compares symmetric algorithms for learning and analysis; it is separate from your Vault data.',
      },
      { type: 'heading', level: 3, text: 'Admin dashboard' },
      {
        type: 'list',
        items: [
          'Open Dashboard to list users with photo, name, username link, email, role, and verification',
          'Edit a user’s details and photo, or delete an account with confirmation',
          'Open a user’s profile to review their account and activity',
          'Read the audit log for sign-ins and administrative actions across the system',
        ],
      },
    ],
  },

  api: {
    blocks: [
      {
        type: 'paragraph',
        text: 'The MixEncryption API is JSON over HTTPS under the /api prefix. Authenticated requests send the session cookie automatically from the web app. Integrations should use credentials and the same cookie jar or an approved future token model.',
      },
      { type: 'heading', level: 3, text: 'Health' },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Auth', 'Description'],
        rows: [['GET', '/api/health', 'No', 'Service status and optional feature flags']],
      },
      { type: 'heading', level: 3, text: 'Authentication (/api/auth)' },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Auth', 'Description'],
        rows: [
          ['GET', '/providers', 'No', 'Lists enabled sign-in providers'],
          ['GET', '/google', 'No', 'Starts Google OAuth'],
          ['GET', '/google/callback', 'No', 'Completes Google OAuth and sets session'],
          ['POST', '/register', 'No', 'Creates a local account'],
          ['POST', '/login', 'No', 'Starts a session'],
          ['POST', '/logout', 'Session', 'Ends the session'],
          ['GET', '/me', 'Session', 'Returns the current user'],
          ['GET', '/activity', 'Session', 'Paginated audit events for the current user'],
          ['POST', '/verify-email', 'No', 'Confirms email with a token'],
          ['POST', '/resend-verification', 'No', 'Sends a new verification message'],
          ['POST', '/forgot-password', 'No', 'Starts password reset'],
          ['POST', '/reset-password', 'No', 'Sets a new password with a reset token'],
        ],
      },
      { type: 'heading', level: 3, text: 'Profile (/api/users/me)' },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Auth', 'Description'],
        rows: [
          ['POST', '/avatar', 'Session', 'Upload profile photo (multipart field avatar)'],
          ['DELETE', '/avatar', 'Session', 'Removes profile photo'],
        ],
      },
      { type: 'heading', level: 3, text: 'Administration (/api/admin)' },
      {
        type: 'paragraph',
        text: 'Requires an admin session.',
      },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Description'],
        rows: [
          ['GET', '/users', 'Paginated list of users'],
          ['GET', '/users/:id', 'One user’s profile fields'],
          ['GET', '/users/:id/activity', 'Paginated audit for that user'],
          ['PATCH', '/users/:id', 'Update name, username, email, role'],
          ['DELETE', '/users/:id', 'Delete user'],
          ['POST', '/users/:id/avatar', 'Upload photo for a user'],
          ['DELETE', '/users/:id/avatar', 'Remove photo for a user'],
          ['GET', '/audit', 'Paginated global audit log'],
        ],
      },
      { type: 'heading', level: 3, text: 'Keys and payloads' },
      {
        type: 'paragraph',
        text: 'When encryption is enabled on your deployment, additional routes register your public key, return wrapped private key material, and create or list ciphertext envelopes. Only the owning user may read their payloads.',
      },
      { type: 'heading', level: 3, text: 'Errors and limits' },
      {
        type: 'list',
        items: [
          'Invalid input returns a clear validation message when safe to do so',
          'Failed sign-in uses generic wording to avoid account enumeration',
          'Too many auth attempts in a short window returns HTTP 429 with a retry message',
        ],
      },
    ],
  },

  deployment: {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption runs as a React front end talking to an Express API and a MongoDB database. Host the UI and API on HTTPS origins that trust each other for cookies and CORS.',
      },
      { type: 'heading', level: 3, text: 'Hosting layout' },
      {
        type: 'table',
        headers: ['Component', 'Role'],
        rows: [
          ['Web app', 'Static React build served to users'],
          ['API', 'Express application handling auth, admin, and envelopes'],
          ['Database', 'MongoDB for users, audit entries, and payloads'],
        ],
      },
      { type: 'heading', level: 3, text: 'Required configuration' },
      {
        type: 'list',
        items: [
          'Database connection string',
          'Secret used to sign session tokens',
          'Allowed browser origin(s) for the web app',
        ],
      },
      { type: 'heading', level: 3, text: 'Optional configuration' },
      {
        type: 'list',
        items: [
          'Outbound email for verification and password reset',
          'Google OAuth client credentials',
          'Cloudinary (or equivalent) for profile photos',
          'Public URL of the web app for links inside email',
        ],
      },
      {
        type: 'paragraph',
        text: 'Keep secrets out of version control and rotate them if they are ever exposed.',
      },
    ],
  },

  evaluation: {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption includes tools to measure the hybrid pipeline and to compare symmetric algorithms. Results support coursework and transparency about performance tradeoffs.',
      },
      { type: 'heading', level: 3, text: 'Benchmarks page' },
      {
        type: 'list',
        items: [
          'Runs encrypt (and optionally decrypt) on fixed payload sizes',
          'Reports latency, ciphertext expansion, and throughput',
          'Optional compression on or off for the same size classes',
        ],
      },
      { type: 'heading', level: 3, text: 'Crypto lab' },
      {
        type: 'paragraph',
        text: 'Exercises AES and other symmetric options on random data. It does not replace Vault encryption; it illustrates primitive behavior in isolation.',
      },
      { type: 'heading', level: 3, text: 'Integrity demonstration' },
      {
        type: 'paragraph',
        text: 'Vault can demonstrate that flipping bits in stored ciphertext causes GCM verification to fail, confirming that tampering is detected before plaintext is released.',
      },
    ],
  },

  'threat-model': {
    blocks: [
      {
        type: 'paragraph',
        text: 'MixEncryption is built for a curious or compromised server operator or a stolen database backup. Identity and access control still rely on the API, but payload confidentiality relies on cryptography in your browser.',
      },
      { type: 'heading', level: 3, text: 'What the operator can see' },
      {
        type: 'list',
        items: [
          'Account registration fields, roles, and audit metadata',
          'Public keys and wrapped private keys, not your login password or unlocked private key',
          'Ciphertext envelopes and non-sensitive metadata',
          'Profile photo URLs if photo hosting is enabled',
        ],
      },
      { type: 'heading', level: 3, text: 'What stays with you' },
      {
        type: 'list',
        items: [
          'Plaintext while encrypting or decrypting',
          'AES session keys and an unlocked RSA private key only in browser memory during use',
        ],
      },
      { type: 'heading', level: 3, text: 'Admin boundary' },
      {
        type: 'paragraph',
        text: 'Administrators manage accounts and read audit events. They are not given a back door to decrypt another user’s Vault.',
      },
      { type: 'heading', level: 3, text: 'Limits to understand' },
      {
        type: 'list',
        items: [
          'RSA key wrapping does not provide forward secrecy by itself',
          'Compression before encryption can leak size hints; use it carefully on small secrets',
          'Your account password protects your wrapped private key',
          'TLS is still required on the wire; this app adds protection at the application layer',
        ],
      },
    ],
  },

  changelog: {
    blocks: [
      { type: 'heading', level: 3, text: 'Recent updates' },
      {
        type: 'list',
        items: [
          'Accounts with email verification, password reset, and optional Google sign-in',
          'Profile pages with photos, verification badges, and personal activity history',
          'Admin dashboard with user management, profile inspection, and global audit log',
          'Themed interface, in-app documentation, and API reference',
        ],
      },
      { type: 'heading', level: 3, text: 'Coming soon' },
      {
        type: 'list',
        items: [
          'Browser key generation and unlock for encryption',
          'Workspace upload and Vault decrypt for personal envelopes',
          'Benchmarks and Crypto lab measurements integrated with the hybrid pipeline',
        ],
      },
    ],
  },
};

export function getDocContent(slug) {
  return DOC_SECTION_CONTENT[slug] ?? null;
}
