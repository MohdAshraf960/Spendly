// Home filter sheet state. Date bounds are applied in the expense query.
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
