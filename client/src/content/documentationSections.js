/** Navigation and summaries for /docs/:sectionSlug */

export const DOC_SECTIONS = [
  {
    slug: 'overview',
    title: 'Overview',
    description: 'What MixEncryption is and how the pieces fit together.',
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    description: 'Browser, API, database, and data flow.',
  },
  {
    slug: 'cryptography',
    title: 'Cryptography',
    description: 'Hybrid encryption, algorithms, and envelopes.',
  },
  {
    slug: 'authentication',
    title: 'Authentication',
    description: 'Auth flow, verification tokens, guest access, session security, and roles.',
  },
  {
    slug: 'user-guide',
    title: 'User guide',
    description: 'Profile, Workspace, Vault, Benchmarks, and admin tools.',
  },
  {
    slug: 'api',
    title: 'API reference',
    description: 'HTTP routes for auth, profile, admin, and encryption.',
  },
  {
    slug: 'deployment',
    title: 'Deployment',
    description: 'Hosting the web app, API, and database.',
  },
  {
    slug: 'evaluation',
    title: 'Evaluation',
    description: 'Benchmarks, Crypto lab, and integrity checks.',
  },
  {
    slug: 'threat-model',
    title: 'Threat model',
    description: 'Trust boundaries and known limits.',
  },
  {
    slug: 'changelog',
    title: 'Changelog',
    description: 'Recent updates and what is next.',
  },
];

export function getDocSection(slug) {
  return DOC_SECTIONS.find((section) => section.slug === slug);
}
