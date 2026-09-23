import {fireEvent, screen} from '@testing-library/react-native';
import type {ComponentProps} from 'react';
import CategoryBottomSheet from '../../../src/shared/components/CategoryBottomSheet';
import {CATEGORIES} from '../../../src/shared/data/categories';
import {renderWithTheme} from '../../test/renderWithTheme';

const food = CATEGORIES.find(category => category.id === 'food')!;

const renderSheet = async (
  props: Partial<ComponentProps<typeof CategoryBottomSheet>> = {},
) => {
  const onSelect = jest.fn();
  const onClose = jest.fn();
  await renderWithTheme(
    <CategoryBottomSheet
      visible
      onSelect={onSelect}
      onClose={onClose}
      {...props}
    />,
  );

  return {onSelect, onClose};
};

describe('CategoryBottomSheet', () => {
  it('shows the title and every catalog category when visible', async () => {
    await renderSheet();

    expect(screen.getByText('Select category')).toBeOnTheScreen();
    expect(screen.getAllByRole('radio')).toHaveLength(CATEGORIES.length);
    expect(screen.getByRole('radio', {name: food.name})).toBeOnTheScreen();
  });

  it('hides the sheet when not visible', async () => {
    await renderSheet({visible: false});

    expect(screen.queryByText('Select category')).toBeNull();
    expect(screen.queryByRole('radio', {name: food.name})).toBeNull();
  });

  it('marks the selected category', async () => {
    await renderSheet({selectedId: food.id});

    expect(
      screen.getByRole('radio', {name: food.name, selected: true}),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('radio', {
        name: 'Groceries & Daily Supplies',
        selected: false,
      }),
    ).toBeOnTheScreen();
  });

  it('selects a category and closes the sheet', async () => {
    const {onSelect, onClose} = await renderSheet();

    await fireEvent.press(screen.getByRole('radio', {name: food.name}));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(food);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the backdrop is pressed without selecting', async () => {
    const {onSelect, onClose} = await renderSheet();

    await fireEvent.press(
      screen.getByRole('button', {name: 'Dismiss category picker'}),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
