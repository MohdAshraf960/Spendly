import {fireEvent, screen} from '@testing-library/react-native';
import CategoryPicker from '../../../src/shared/components/CategoryPicker';
import {CATEGORIES} from '../../../src/shared/data/categories';
import {renderWithTheme} from '../../test/renderWithTheme';

const food = CATEGORIES.find(category => category.id === 'food')!;

describe('CategoryPicker', () => {
  it('shows an empty selector and keeps the sheet closed', async () => {
    await renderWithTheme(<CategoryPicker onSelect={jest.fn()} />);

    expect(screen.getByText(/Category/)).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {name: 'Select category'}),
    ).toBeOnTheScreen();
    expect(screen.getByText('Choose one category')).toBeOnTheScreen();
    expect(screen.queryByRole('radio', {name: food.name})).toBeNull();
  });

  it('shows the selected category on the card', async () => {
    await renderWithTheme(
      <CategoryPicker selectedCategory={food} onSelect={jest.fn()} />,
    );

    expect(screen.getByText(food.name)).toBeOnTheScreen();
    expect(screen.getByText(food.description)).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {name: 'Change category'}),
    ).toBeOnTheScreen();
  });

  it('shows a validation error', async () => {
    await renderWithTheme(
      <CategoryPicker onSelect={jest.fn()} error="Select a category" />,
    );

    expect(screen.getByText('Select a category')).toBeOnTheScreen();
  });

  it('opens the sheet from the selector card', async () => {
    await renderWithTheme(<CategoryPicker onSelect={jest.fn()} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));

    expect(screen.getAllByRole('radio')).toHaveLength(CATEGORIES.length);
  });

  it('selects a category from the sheet and closes it', async () => {
    const onSelect = jest.fn();
    await renderWithTheme(<CategoryPicker onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));
    await fireEvent.press(screen.getByRole('radio', {name: food.name}));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(food);
    expect(screen.queryByRole('radio', {name: food.name})).toBeNull();
  });

  it('closes the sheet from the backdrop without selecting', async () => {
    const onSelect = jest.fn();
    await renderWithTheme(<CategoryPicker onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));
    await fireEvent.press(
      screen.getByRole('button', {name: 'Dismiss category picker'}),
    );

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.queryByRole('radio', {name: food.name})).toBeNull();
  });
});
