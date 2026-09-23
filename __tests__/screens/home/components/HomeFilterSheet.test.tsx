import {fireEvent, screen} from '@testing-library/react-native';
import HomeFilterSheet from '../../../../src/screens/home/components/HomeFilterSheet';
import {CATEGORIES} from '../../../../src/shared/data/categories';
import {EMPTY_HOME_FILTERS} from '../../../../src/types';
import {renderWithTheme} from '../../../test/renderWithTheme';

const food = CATEGORIES.find(category => category.id === 'food')!;

describe('HomeFilterSheet', () => {
  it('applies a selected category', async () => {
    const onApply = jest.fn();
    await renderWithTheme(
      <HomeFilterSheet
        visible
        filters={EMPTY_HOME_FILTERS}
        onApply={onApply}
        onClose={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole('radio', {name: food.name}));
    await fireEvent.press(screen.getByRole('button', {name: 'Apply Filter'}));

    expect(onApply).toHaveBeenCalledWith({
      categoryIds: [food.id],
      fromDate: undefined,
      endDate: undefined,
    });
  });

  it('resets the draft before applying', async () => {
    const onApply = jest.fn();
    await renderWithTheme(
      <HomeFilterSheet
        visible
        filters={{categoryIds: [food.id]}}
        onApply={onApply}
        onClose={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Reset all filters'}));
    await fireEvent.press(screen.getByRole('button', {name: 'Apply Filter'}));

    expect(onApply).toHaveBeenCalledWith(EMPTY_HOME_FILTERS);
  });

  it('closes without applying', async () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    await renderWithTheme(
      <HomeFilterSheet
        visible
        filters={EMPTY_HOME_FILTERS}
        onApply={onApply}
        onClose={onClose}
      />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Cancel'}));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });

  it('rejects a from date that is after the end date', async () => {
    const onApply = jest.fn();
    await renderWithTheme(
      <HomeFilterSheet
        visible
        filters={{
          categoryIds: [],
          fromDate: new Date('2026-09-22T00:00:00'),
          endDate: new Date('2026-09-01T00:00:00'),
        }}
        onApply={onApply}
        onClose={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Apply Filter'}));

    expect(onApply).not.toHaveBeenCalled();
    expect(
      screen.getByText('From date cannot be after end date'),
    ).toBeOnTheScreen();
  });
});
