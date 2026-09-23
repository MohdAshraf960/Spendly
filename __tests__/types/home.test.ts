import {
  EMPTY_HOME_FILTERS,
  hasActiveHomeFilters,
  type HomeFilters,
  type HomeStats,
} from '../../src/types';

describe('HomeStats', () => {
  it('tracks all-time spend, this month, and the record count', () => {
    const stats = {
      allTimeTotal: 1200,
      thisMonthTotal: 300,
      transactionCount: 8,
    } satisfies HomeStats;

    expect(stats).toEqual({
      allTimeTotal: 1200,
      thisMonthTotal: 300,
      transactionCount: 8,
    });
  });
});

describe('HomeFilters', () => {
  it('can limit categories and an inclusive date range', () => {
    const filters = {
      categoryIds: ['food', 'fuel'],
      fromDate: new Date('2026-09-01T00:00:00'),
      endDate: new Date('2026-09-22T00:00:00'),
    } satisfies HomeFilters;

    expect(filters.categoryIds).toEqual(['food', 'fuel']);
    expect(filters.fromDate).toBeInstanceOf(Date);
    expect(filters.endDate).toBeInstanceOf(Date);
  });
});

describe('EMPTY_HOME_FILTERS', () => {
  it('starts with no categories and no dates', () => {
    expect(EMPTY_HOME_FILTERS).toEqual({categoryIds: []});
    expect(hasActiveHomeFilters(EMPTY_HOME_FILTERS)).toBe(false);
  });
});

describe('hasActiveHomeFilters', () => {
  it('is inactive when every filter is empty', () => {
    expect(
      hasActiveHomeFilters({
        categoryIds: [],
        fromDate: undefined,
        endDate: undefined,
      }),
    ).toBe(false);
  });

  it('is active when a category is selected', () => {
    expect(
      hasActiveHomeFilters({
        categoryIds: ['food'],
      }),
    ).toBe(true);
  });

  it('is active when either date bound is set', () => {
    const day = new Date('2026-09-22T00:00:00');

    expect(hasActiveHomeFilters({categoryIds: [], fromDate: day})).toBe(true);
    expect(hasActiveHomeFilters({categoryIds: [], endDate: day})).toBe(true);
  });
});
