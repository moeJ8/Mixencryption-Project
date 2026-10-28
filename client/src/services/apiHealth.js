import axios from 'axios';
import { getApiBaseUrl } from '../utils/api';

const healthClient = axios.create({
  headers: { Accept: 'application/json' },
});

/**
 * Ping /api/health. Long timeout for Render free cold starts.
 */
export async function fetchApiHealth({ signal, timeoutMs = 90_000 } = {}) {
  const base = getApiBaseUrl();
  const path = '/api/health';
  const url = base ? `${base}${path}` : path;

  const { data } = await healthClient.get(url, {
    signal,
    timeout: timeoutMs,
    withCredentials: false,
  });

  return data?.ok === true;
}
