import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

// Loads 10 rows at a time. Resets when the filtered list changes.
const DEFAULT_PAGE_SIZE = 10;

const usePagedList = <T,>(items: T[], pageSize = DEFAULT_PAGE_SIZE) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadingMore = useRef(false);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const pagedItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (loadingMore.current || !hasMore) {
      return;
    }

    loadingMore.current = true;
    setVisibleCount(count => Math.min(count + pageSize, items.length));
    requestAnimationFrame(() => {
      loadingMore.current = false;
    });
  }, [hasMore, items.length, pageSize]);

  return {pagedItems, hasMore, loadMore};
};

export default usePagedList;
