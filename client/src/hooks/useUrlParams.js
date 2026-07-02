import { useState, useEffect, useCallback } from 'react';

export function useUrlParams() {
  const [params, setParams] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      sort: searchParams.get('sort') || 'none',
      order: searchParams.get('order') || 'asc',
      page: parseInt(searchParams.get('page') || '1', 10),
      view: searchParams.get('view') || 'table'
    };
  });

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      setParams({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'all',
        sort: searchParams.get('sort') || 'none',
        order: searchParams.get('order') || 'asc',
        page: parseInt(searchParams.get('page') || '1', 10),
        view: searchParams.get('view') || 'table'
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => {
      const next = typeof newParams === 'function' ? newParams(prev) : { ...prev, ...newParams };

      const searchParams = new URLSearchParams();
      if (next.search) searchParams.set('search', next.search);
      if (next.category && next.category !== 'all') searchParams.set('category', next.category);
      if (next.sort && next.sort !== 'none') searchParams.set('sort', next.sort);
      if (next.sort && next.sort !== 'none' && next.order) searchParams.set('order', next.order);
      if (next.page && next.page !== 1) searchParams.set('page', next.page.toString());
      if (next.view && next.view !== 'table') searchParams.set('view', next.view);

      const queryString = searchParams.toString();
      const newUrl = `${window.location.pathname}${queryString ? '?' + queryString : ''}`;
      window.history.pushState(next, '', newUrl);

      return next;
    });
  }, []);

  return [params, updateParams];
}
