import {useEffect, useState} from 'react';
import {
  getExpenses,
  getLedgerStats,
  subscribeToExpenses,
} from '../../../composition';
import type {HomeStats} from '../../../domain/entities';

export const useLedgerStats = () => {
  const [stats, setStats] = useState<HomeStats>(() => getLedgerStats([]));

  useEffect(() => {
    const apply = (items: Parameters<typeof getLedgerStats>[0]) =>
      setStats(getLedgerStats(items));
    apply(getExpenses());
    return subscribeToExpenses(apply);
  }, []);

  return stats;
};
