import axios from 'axios';

function resolveApiBaseUrl() {
  if (import.meta.env.DEV) {
    return '';
  }

  const fromEnv = import.meta.env.VITE_API_URL;
  if (!fromEnv || typeof fromEnv !== 'string') {
    return '';
  }

  return fromEnv.trim().replace(/\/$/, '');
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export function getApiBaseUrl() {
  return resolveApiBaseUrl();
}

/** OAuth must hit the API host in production (Vercel has no /api proxy). */
export function getGoogleAuthStartUrl() {
  const base = resolveApiBaseUrl();
  return base ? `${base}/api/auth/google` : '/api/auth/google';
}
