// 4pt spacing scale plus layout sizes used across screens.
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
} as const;

export const layout = {
  screenPadding: 16,
  screenPaddingLarge: 24,

  headerHeight: 56,
  bottomTabHeight: 64,

  buttonHeight: 48,
  buttonHeightLarge: 56,

  inputHeight: 52,

  iconButtonSize: 48,

  fabSize: 56,

  listItemMinHeight: 64,
} as const;