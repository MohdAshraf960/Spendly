import {fireEvent, screen} from '@testing-library/react-native';
import HomeSearchBar from '../../../../src/screens/home/components/HomeSearchBar';
import {renderWithTheme} from '../../../test/renderWithTheme';

describe('HomeSearchBar', () => {
  it('searches, clears, and opens filters', async () => {
    const onChangeText = jest.fn();
    const onFilterPress = jest.fn();
    await renderWithTheme(
      <HomeSearchBar
        value="milk"
        onChangeText={onChangeText}
        onFilterPress={onFilterPress}
        filterActive
      />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Search transactions...'),
      'tea',
    );
    await fireEvent.press(screen.getByRole('button', {name: 'Clear search'}));
    await fireEvent.press(
      screen.getByRole('button', {name: 'Filter transactions'}),
    );

    expect(onChangeText).toHaveBeenCalledWith('tea');
    expect(onChangeText).toHaveBeenCalledWith('');
    expect(onFilterPress).toHaveBeenCalledTimes(1);
  });

  it('hides clear when the query is empty', async () => {
    await renderWithTheme(
      <HomeSearchBar value="" onChangeText={jest.fn()} />,
    );

    expect(screen.queryByRole('button', {name: 'Clear search'})).toBeNull();
  });
});
