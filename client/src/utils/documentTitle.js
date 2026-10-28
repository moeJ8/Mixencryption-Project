import { getDocSection } from '../content/documentationSections';

export const SITE_NAME = 'MixEncryption';

export function formatDocumentTitle(pageTitle) {
  const trimmed = typeof pageTitle === 'string' ? pageTitle.trim() : '';
  if (!trimmed) return SITE_NAME;
  return `${trimmed} | ${SITE_NAME}`;
}

const STATIC_ROUTE_TITLES = [
  { path: '/', title: 'Home' },
  { path: '/lab', title: 'Crypto lab' },
  { path: '/workspace', title: 'Workspace' },
  { path: '/vault', title: 'Vault' },
  { path: '/benchmarks', title: 'Benchmarks' },
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/login', title: 'Sign in' },
  { path: '/register', title: 'Create account' },
  { path: '/check-email', title: 'Check your email' },
  { path: '/verify-email', title: 'Verify email' },
  { path: '/forgot-password', title: 'Forgot password' },
  { path: '/reset-password', title: 'Reset password' },
];

export function resolveRouteDocumentTitle(pathname) {
  const path = pathname.split('?')[0].replace(/\/$/, '') || '/';

  if (path.startsWith('/profile')) {
    return 'Profile';
  }

  const docsMatch = path.match(/^\/docs\/([^/]+)$/);
  if (docsMatch) {
    const section = getDocSection(docsMatch[1]);
    return section?.title ?? 'Docs';
  }

  if (path === '/docs') {
    return 'Docs';
  }

  const staticMatch = STATIC_ROUTE_TITLES.find((entry) => entry.path === path);
  return staticMatch?.title ?? null;
}
