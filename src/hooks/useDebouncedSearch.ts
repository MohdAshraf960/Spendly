import {useEffect, useState} from 'react';

// Search runs only after 3+ characters (leading spaces ignored).
const MIN_ACTIVE_LENGTH = 3;
const DEFAULT_DELAY_MS = 300;

const useDebouncedSearch = (value: string, delay = DEFAULT_DELAY_MS) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const withoutLeadingSpaces = value.replace(/^\s+/, '');

    if (withoutLeadingSpaces.length < MIN_ACTIVE_LENGTH) {
      setDebouncedQuery('');
      return;
    }

    const timeout = setTimeout(() => {
      setDebouncedQuery(withoutLeadingSpaces.trim());
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedQuery;
};

export default useDebouncedSearch;
