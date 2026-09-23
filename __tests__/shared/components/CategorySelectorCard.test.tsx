import {fireEvent, screen} from '@testing-library/react-native';
import CategorySelectorCard from '../../../src/shared/components/CategorySelectorCard';
import {CATEGORIES} from '../../../src/shared/data/categories';
import {renderWithTheme} from '../../test/renderWithTheme';

const food = CATEGORIES.find(category => category.id === 'food')!;

describe('CategorySelectorCard', () => {
  it('shows the empty prompt', async () => {
    await renderWithTheme(<CategorySelectorCard onChangePress={jest.fn()} />);

    expect(screen.getByText(/Category/)).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {name: 'Select category'}),
    ).toBeOnTheScreen();
    expect(screen.getByText('Choose one category')).toBeOnTheScreen();
  });

  it('shows the selected category and a change action', async () => {
    await renderWithTheme(
      <CategorySelectorCard category={food} onChangePress={jest.fn()} />,
    );

    expect(screen.getByText(food.name)).toBeOnTheScreen();
    expect(screen.getByText(food.description)).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {name: 'Change category'}),
    ).toBeOnTheScreen();
  });

  it('shows a validation error', async () => {
    await renderWithTheme(
      <CategorySelectorCard
        onChangePress={jest.fn()}
        error="Select a category"
      />,
    );

    expect(screen.getByText('Select a category')).toBeOnTheScreen();
  });

  it('opens the selector when pressed', async () => {
    const onChangePress = jest.fn();
    await renderWithTheme(
      <CategorySelectorCard onChangePress={onChangePress} />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));

    expect(onChangePress).toHaveBeenCalledTimes(1);
  });
});
