// Home search + category/date filters. Date bounds are inclusive by day.
import type {Expense} from '../expenses/data';

export type HomeFilters = {
  categoryIds: string[];
  fromDate?: Date;
  endDate?: Date;
};

export const EMPTY_HOME_FILTERS: HomeFilters = {
  categoryIds: [],
};

export const hasActiveHomeFilters = (filters: HomeFilters) =>
  filters.categoryIds.length > 0 ||
  Boolean(filters.fromDate) ||
  Boolean(filters.endDate);

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

export const filterExpenses = (
  expenses: Expense[],
  searchQuery: string,
  filters: HomeFilters,
) => {
  const query = searchQuery.trim().toLowerCase();

  return expenses.filter(expense => {
    const matchesSearch =
      !query ||
      expense.title.toLowerCase().includes(query) ||
      expense.category.name.toLowerCase().includes(query) ||
      expense.note.toLowerCase().includes(query);

    const matchesCategory =
      filters.categoryIds.length === 0 ||
      filters.categoryIds.includes(expense.category.id);

    const matchesFrom =
      !filters.fromDate || expense.date >= startOfDay(filters.fromDate);

    const matchesEnd =
      !filters.endDate || expense.date <= endOfDay(filters.endDate);

    return matchesSearch && matchesCategory && matchesFrom && matchesEnd;
  });
};
