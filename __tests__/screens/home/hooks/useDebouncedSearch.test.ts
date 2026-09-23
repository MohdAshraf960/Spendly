import {act, renderHook} from '@testing-library/react-native';
import useDebouncedSearch from '../../../../src/screens/home/hooks/useDebouncedSearch';

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stays empty until there are 3 non-leading characters', async () => {
    const {result} = await renderHook(() => useDebouncedSearch('ab'));
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('');
  });

  it('updates after the debounce delay', async () => {
    const {result, rerender} = await renderHook(
      ({value}: {value: string}) => useDebouncedSearch(value),
      {initialProps: {value: ''}},
    );

    await rerender({value: 'tea'});
    expect(result.current).toBe('');

    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('');

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('tea');
  });

  it('ignores leading spaces and trims the query', async () => {
    const {result} = await renderHook(() => useDebouncedSearch('  milk  '));

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('milk');
  });
});
