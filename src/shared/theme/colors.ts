export type Colors = {
  [K in keyof typeof lightColors]: string;
};


export const lightColors = {
  primary: '#0D5C46',
  primaryDark: '#083C2E',
  primaryLight: '#128263',

  background: '#F9F9FF',
  backgroundSecondary: '#F1F3FF',

  surface: '#FFFFFF',
  surfaceSecondary: '#E9EDFA',
  surfaceTertiary: '#E1E5F5',

  text: '#1A1C24',
  textSecondary: '#434750',
  textTertiary: '#737782',
  textDisabled: '#A0A3AC',
  textOnPrimary: '#FFFFFF',

  border: '#C3C6D2',
  borderLight: '#E1E3EA',
  borderFocused: '#0D5C46',

  success: '#0D5C46',
  successBackground: '#D1E7E0',

  warning: '#B45309',
  warningBackground: '#FEF3C7',

  error: '#B91C1C',
  errorBackground: '#FEE2E2',

  info: '#2563EB',
  infoBackground: '#DBEAFE',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;


export const darkColors = {
  primary: '#2DD4A0',
  primaryDark: '#006C4E',
  primaryLight: '#56F1BB',

  background: '#0D0F14',
  backgroundSecondary: '#13161F',

  surface: '#1A1E29',
  surfaceSecondary: '#222836',
  surfaceTertiary: '#2C3345',

  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#BBCAC1',
  textDisabled: '#64748B',
  textOnPrimary: '#042118',

  border: '#334155',
  borderLight: '#1F2937',
  borderFocused: '#2DD4A0',

  success: '#34D399',
  successBackground: '#0D382C',

  warning: '#FBBF24',
  warningBackground: '#422006',

  error: '#F87171',
  errorBackground: '#450A0A',

  info: '#60A5FA',
  infoBackground: '#172554',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// export type Colors = typeof lightColors;