import {screen} from '@testing-library/react-native';
import Shimmer from '../../../src/shared/components/Shimmer';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('Shimmer', () => {
  it('renders a loading bone', async () => {
    const {toJSON} = await renderWithTheme(<Shimmer />);

    expect(toJSON()).not.toBeNull();
  });

  it('applies a custom size', async () => {
    const {toJSON} = await renderWithTheme(<Shimmer width={80} height={20} />);
    const tree = JSON.stringify(toJSON());

    expect(tree).toContain('"width":80');
    expect(tree).toContain('"height":20');
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
