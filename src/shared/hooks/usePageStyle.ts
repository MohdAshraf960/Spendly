// Shared page and scroll padding so screens stay aligned with the theme.
import {colors, layout, spacing} from '../theme';

const usePageStyle = () => ({
  // For a screen root View.
  page: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // For a ScrollView contentContainerStyle: fills a short screen but still
  // lets taller content scroll, which `flex: 1` would prevent.
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[8] * 3,
  },
});

export default usePageStyle;
