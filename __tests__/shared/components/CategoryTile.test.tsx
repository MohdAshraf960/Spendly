import {fireEvent, screen} from '@testing-library/react-native';
import {Text} from 'react-native';
import CategoryTile from '../../../src/shared/components/CategoryTile';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('CategoryTile', () => {
  it('exposes the category as a radio', async () => {
    await renderWithTheme(
      <CategoryTile name="Food & Dining" icon={<Text>fork</Text>} />,
    );

    expect(
      screen.getByRole('radio', {name: 'Food & Dining', selected: false}),
    ).toBeOnTheScreen();
    expect(screen.getByText('fork')).toBeOnTheScreen();
  });

  it('marks the selected tile', async () => {
    await renderWithTheme(
      <CategoryTile name="Food & Dining" selected icon={<Text>fork</Text>} />,
    );

    expect(
      screen.getByRole('radio', {name: 'Food & Dining', selected: true}),
    ).toBeOnTheScreen();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <CategoryTile name="Food & Dining" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole('radio', {name: 'Food & Dining'}));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
