import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { fetchApiHealth } from '../services/apiHealth';

/** @typedef {'checking' | 'ready' | 'waking' | 'unavailable'} ApiStatusState */

const ApiStatusContext = createContext(null);

const RETRY_MS = 4_000;
const MAX_ATTEMPTS = 24;

export function ApiStatusProvider({ children }) {
  /** @type {[ApiStatusState, Function]} */
  const [status, setStatus] = useState('checking');
  const attemptRef = useRef(0);
  const runIdRef = useRef(0);

  const runCheck = useCallback(async (runId) => {
    const controller = new AbortController();

    try {
      const ok = await fetchApiHealth({ signal: controller.signal });
      if (runId !== runIdRef.current) return;
      if (ok) {
        setStatus('ready');
        attemptRef.current = 0;
        return;
      }
      throw new Error('Health check returned not ok');
    } catch {
      if (runId !== runIdRef.current) return;

      attemptRef.current += 1;
      if (attemptRef.current >= MAX_ATTEMPTS) {
        setStatus('unavailable');
        return;
      }

      setStatus('waking');
      window.setTimeout(() => {
        if (runId === runIdRef.current) {
          runCheck(runId);
        }
      }, RETRY_MS);
    }
  }, []);

  const retry = useCallback(() => {
    runIdRef.current += 1;
    attemptRef.current = 0;
    setStatus('checking');
    runCheck(runIdRef.current);
  }, [runCheck]);

  useEffect(() => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    attemptRef.current = 0;
    setStatus('checking');
    runCheck(runId);

    return () => {
      runIdRef.current += 1;
    };
  }, [runCheck]);

  const value = useMemo(
    () => ({
      status,
      retry,
      isReady: status === 'ready',
    }),
    [status, retry],
  );

  return <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>;
}

export function useApiStatus() {
  const ctx = useContext(ApiStatusContext);
  if (!ctx) {
    throw new Error('useApiStatus must be used within ApiStatusProvider');
  }
  return ctx;
}
