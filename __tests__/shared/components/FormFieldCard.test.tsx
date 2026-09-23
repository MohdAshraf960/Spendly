import {Text} from 'react-native';
import {screen} from '@testing-library/react-native';
import FormFieldCard from '../../../src/shared/components/FormFieldCard';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('FormFieldCard', () => {
  it('shows the label, hint, and children', async () => {
    await renderWithTheme(
      <FormFieldCard label="Amount" hint="In rupees">
        <Text>₹ 120</Text>
      </FormFieldCard>,
    );

    expect(screen.getByText('Amount')).toBeOnTheScreen();
    expect(screen.getByText('In rupees')).toBeOnTheScreen();
    expect(screen.getByText('₹ 120')).toBeOnTheScreen();
  });

  it('marks a required field', async () => {
    await renderWithTheme(
      <FormFieldCard label="Amount" hint="In rupees" required>
        <Text>₹ 120</Text>
      </FormFieldCard>,
    );

    expect(screen.getByText(/\*/)).toBeOnTheScreen();
  });

  it('shows an error message', async () => {
    await renderWithTheme(
      <FormFieldCard label="Amount" hint="In rupees" error="Enter a valid amount">
        <Text>₹</Text>
      </FormFieldCard>,
    );

    expect(screen.getByText('Enter a valid amount')).toBeOnTheScreen();
  });
});
