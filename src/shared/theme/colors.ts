// Spendly palette. Primary is the brand green used on FAB and summary.
export const colors = {
  // Brand
  primary: '#0D5C46',
  primaryDark: '#083C2E',
  primaryLight: '#128263',

  // Backgrounds
  background: '#F9F9FF',
  backgroundSecondary: '#F1F3FF',

  // Surfaces
  surface: '#FFFFFF',
  surfaceSecondary: '#E9EDFA',
  surfaceTertiary: '#E1E5F5',

  // Text
  text: '#1A1C24',
  textSecondary: '#434750',
  textTertiary: '#737782',
  textDisabled: '#A0A3AC',
  textOnPrimary: '#FFFFFF',

  // Borders
  border: '#C3C6D2',
  borderLight: '#E1E3EA',
  borderFocused: '#0D5C46',

  // Feedback
  success: '#0D5C46',
  successBackground: '#D1E7E0',

  warning: '#B45309',
  warningBackground: '#FEF3C7',

  error: '#B91C1C',
  errorBackground: '#FEE2E2',

  info: '#2563EB',
  infoBackground: '#DBEAFE',

  // Basic
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;