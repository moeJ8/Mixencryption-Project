import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Server-driven pagination with in-memory page cache and hover prefetch.
 * @param {(page: number) => Promise<{ items: unknown[], page: number, totalPages: number, total?: number }>} fetchPage
 */
export function useServerPagination(fetchPage) {
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  const cacheRef = useRef(new Map());
  const inflightRef = useRef(new Map());

  const [state, setState] = useState({
    items: [],
    page: 1,
    totalPages: 0,
    total: 0,
    loading: true,
    switching: false,
    error: '',
  });
  const [prefetchingPages, setPrefetchingPages] = useState(() => new Set());

  const applyPageData = useCallback((data) => {
    setState({
      items: data.items,
      page: data.page,
      totalPages: data.totalPages,
      total: data.total ?? 0,
      loading: false,
      switching: false,
      error: '',
    });
  }, []);

  const loadPage = useCallback(async (page, { background = false } = {}) => {
    const safePage = Math.max(1, page);

    if (cacheRef.current.has(safePage)) {
      if (!background) {
        applyPageData(cacheRef.current.get(safePage));
      }
      return;
    }

    if (inflightRef.current.has(safePage)) {
      if (!background) {
        setState((prev) => ({ ...prev, switching: true, error: '' }));
        try {
          const data = await inflightRef.current.get(safePage);
          applyPageData(data);
        } catch (err) {
          setState((prev) => ({
            ...prev,
            switching: false,
            error: err.response?.data?.message || 'Could not load data.',
          }));
        }
      }
      return;
    }

    const run = (async () => {
      const data = await fetchRef.current(safePage);
      cacheRef.current.set(safePage, data);
      return data;
    })();

    inflightRef.current.set(safePage, run);

    if (background) {
      setPrefetchingPages((prev) => new Set(prev).add(safePage));
    } else {
      setState((prev) => ({
        ...prev,
        loading: prev.items.length === 0,
        switching: prev.items.length > 0,
        error: '',
      }));
    }

    try {
      const data = await run;
      if (!background) {
        applyPageData(data);
      }
    } catch (err) {
      if (!background) {
        setState((prev) => ({
          ...prev,
          loading: false,
          switching: false,
          error: err.response?.data?.message || 'Could not load data.',
        }));
      }
    } finally {
      inflightRef.current.delete(safePage);
      if (background) {
        setPrefetchingPages((prev) => {
          const next = new Set(prev);
          next.delete(safePage);
          return next;
        });
      }
    }
  }, [applyPageData]);

  const goToPage = useCallback(
    (page) => {
      loadPage(page, { background: false });
    },
    [loadPage],
  );

  const prefetchPage = useCallback(
    (page) => {
      if (!page || page < 1) return;
      if (page === state.page) return;
      if (state.totalPages && page > state.totalPages) return;
      if (cacheRef.current.has(page)) return;
      loadPage(page, { background: true });
    },
    [loadPage, state.page, state.totalPages],
  );

  const invalidate = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  useEffect(() => {
    cacheRef.current.clear();
    loadPage(1, { background: false });
  }, [loadPage]);

  return {
    ...state,
    goToPage,
    prefetchPage,
    invalidate,
    prefetchingPages,
  };
}

function buildPageItems(current, total) {
  if (total <= 0) return [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page', page: i + 1 }));
  }

  const items = [];
  const pushPage = (page) => items.push({ type: 'page', page });
  const pushEllipsis = () => {
    if (items[items.length - 1]?.type !== 'ellipsis') {
      items.push({ type: 'ellipsis', key: `e-${items.length}` });
    }
  };

  pushPage(1);
  if (current > 3) pushEllipsis();

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p += 1) {
    pushPage(p);
  }

  if (current < total - 2) pushEllipsis();
  if (total > 1) pushPage(total);

  return items;
}

export { buildPageItems };
