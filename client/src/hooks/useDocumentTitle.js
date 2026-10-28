import { useEffect } from 'react';
import { formatDocumentTitle } from '../utils/documentTitle';

export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    if (pageTitle == null || pageTitle === '') return;
    document.title = formatDocumentTitle(pageTitle);
  }, [pageTitle]);
}
