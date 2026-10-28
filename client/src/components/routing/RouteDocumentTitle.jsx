import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDocumentTitle, resolveRouteDocumentTitle } from '../../utils/documentTitle';

export default function RouteDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = resolveRouteDocumentTitle(pathname);
    document.title = formatDocumentTitle(pageTitle);
  }, [pathname]);

  return null;
}
