import {screen} from '@testing-library/react-native';
import StatCard from '../../../../src/screens/home/components/StatCard';
import StatCardShimmer from '../../../../src/screens/home/components/StatCardShimmer';
import ExpenseListShimmer from '../../../../src/screens/home/components/ExpenseListShimmer';
import {renderWithTheme} from '../../../test/renderWithTheme';

describe('StatCard', () => {
  it('shows the label, value, and subtitle', async () => {
    await renderWithTheme(
      <StatCard label="All-Time" value="₹140" subtitle="Total Spent" />,
    );

    expect(screen.getByText('All-Time')).toBeOnTheScreen();
    expect(screen.getByText('₹140')).toBeOnTheScreen();
    expect(screen.getByText('Total Spent')).toBeOnTheScreen();
  });
});

describe('loading shimmers', () => {
  it('renders a stat placeholder', async () => {
    const {toJSON} = await renderWithTheme(<StatCardShimmer />);

    expect(toJSON()).not.toBeNull();
  });

  it('renders the requested number of expense rows', async () => {
    const {toJSON} = await renderWithTheme(<ExpenseListShimmer rows={2} />);
    const root = toJSON();

    expect(Array.isArray(root) ? root : root?.children).toHaveLength(2);
  });
});
