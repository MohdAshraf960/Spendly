import {fireEvent, screen} from '@testing-library/react-native';
import EmptyState from '../../../src/shared/components/EmptyState';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('EmptyState', () => {
  it('shows the title and description', async () => {
    await renderWithTheme(
      <EmptyState title="No expenses" description="Add your first one" />,
    );

    expect(screen.getByText('No expenses')).toBeOnTheScreen();
    expect(screen.getByText('Add your first one')).toBeOnTheScreen();
  });

  it('runs the optional action', async () => {
    const onActionPress = jest.fn();
    await renderWithTheme(
      <EmptyState
        title="No expenses"
        description="Add your first one"
        actionTitle="Add expense"
        onActionPress={onActionPress}
      />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Add expense'}));

    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
