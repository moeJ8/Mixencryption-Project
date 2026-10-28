/** Slugs and placeholders for /docs/:sectionSlug. Add body copy in DocSectionPage or per-section components later. */
export const DOC_SECTIONS = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'What MixEncryption is and what problem it solves.',
    topics: ['Project goal', 'Hybrid encryption in one paragraph', 'Stack summary'],
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    description: 'How the browser, API, and database fit together.',
    topics: ['Browser vs server responsibilities', 'Data flow diagram', 'MongoDB collections'],
  },
  {
    slug: 'cryptography',
    title: 'Cryptography',
    description: 'Algorithms and the hybrid envelope.',
    topics: ['AES-256-GCM and RSA-OAEP roles', 'Envelope Ω fields', 'Key wrap and unlock flow'],
  },
  {
    slug: 'authentication',
    title: 'Authentication',
    description: 'Accounts, sessions, and roles.',
    topics: ['Registration and JWT session', 'Email verification', 'Password reset', 'Roles'],
  },
  {
    slug: 'user-guide',
    title: 'User guide',
    description: 'How to use Workspace, Vault, and admin tools.',
    topics: ['Workspace encrypt steps', 'Vault decrypt steps', 'Integrity demo', 'Admin dashboard'],
  },
  {
    slug: 'api',
    title: 'API reference',
    description: 'HTTP routes and behavior.',
    topics: ['Auth endpoints', 'Keys and payloads (when implemented)', 'Errors and rate limits'],
  },
  {
    slug: 'deployment',
    title: 'Deployment',
    description: 'Local dev and production hosting.',
    topics: ['Local setup', 'Vercel and Render', 'Environment variables'],
  },
  {
    slug: 'evaluation',
    title: 'Evaluation',
    description: 'Benchmarks and crypto lab results.',
    topics: ['Hybrid pipeline timings', 'Crypto lab comparison', 'Measurement method'],
  },
  {
    slug: 'threat-model',
    title: 'Threat model',
    description: 'Who can read what, and known limits.',
    topics: ['Adversary table', 'Honest limits', 'What the app does not claim'],
  },
  {
    slug: 'changelog',
    title: 'Changelog',
    description: 'Shipped milestones and fixes.',
    topics: ['Milestone releases', 'Notable fixes'],
  },
];

export function getDocSection(slug) {
  return DOC_SECTIONS.find((section) => section.slug === slug);
}
