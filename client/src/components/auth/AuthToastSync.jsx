import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toastError, toastSuccess } from '../../theme/toast';
import { googleAuthErrorMessage } from '../../utils/googleAuthErrors';

/**
 * OAuth redirect query params and one-shot auth toasts after full page loads.
 */
export default function AuthToastSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const handledRef = useRef('');

  useEffect(() => {
    const signedIn = searchParams.get('signed_in');
    const errorCode = searchParams.get('error');
    const key = `${signedIn || ''}|${errorCode || ''}`;

    if (!signedIn && !errorCode) {
      handledRef.current = '';
      return;
    }
    if (handledRef.current === key) return;
    handledRef.current = key;

    if (signedIn === 'google') {
      refreshUser()
        .catch(() => null)
        .finally(() => {
          toastSuccess('Signed in with Google.');
          setSearchParams({}, { replace: true });
        });
      return;
    }

    if (errorCode) {
      toastError(googleAuthErrorMessage(errorCode));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshUser]);

  return null;
}
