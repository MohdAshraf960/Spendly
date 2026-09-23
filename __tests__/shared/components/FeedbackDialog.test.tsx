import {fireEvent, screen} from '@testing-library/react-native';
import type {ComponentProps} from 'react';
import FeedbackDialog from '../../../src/shared/components/FeedbackDialog';
import {renderWithTheme} from '../../test/renderWithTheme';

const renderDialog = async (
  props: Partial<ComponentProps<typeof FeedbackDialog>> = {},
) => {
  const onClose = jest.fn();
  await renderWithTheme(
    <FeedbackDialog
      visible
      variant="success"
      title="Expense saved"
      message="Your expense was added."
      onClose={onClose}
      {...props}
    />,
  );
  return {onClose};
};

describe('FeedbackDialog', () => {
  it('shows the title, message, and default action', async () => {
    await renderDialog();

    expect(screen.getByText('Expense saved')).toBeOnTheScreen();
    expect(screen.getByText('Your expense was added.')).toBeOnTheScreen();
    expect(screen.getByRole('button', {name: 'OK'})).toBeOnTheScreen();
  });

  it('hides the dialog when not visible', async () => {
    await renderDialog({visible: false});

    expect(screen.queryByText('Expense saved')).toBeNull();
  });

  it('uses a custom action title', async () => {
    await renderDialog({variant: 'error', actionTitle: 'Try again'});

    expect(screen.getByRole('button', {name: 'Try again'})).toBeOnTheScreen();
  });

  it('closes from the action, the close button, and the backdrop', async () => {
    const {onClose} = await renderDialog();

    await fireEvent.press(screen.getByRole('button', {name: 'OK'}));
    await fireEvent.press(screen.getByRole('button', {name: 'Close'}));
    await fireEvent.press(
      screen.getByRole('button', {name: 'Dismiss feedback'}),
    );

    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
