import { colors } from './colors';
import { radius } from './radius';
import { sizes } from './sizes';


// Composed tokens for Button and TextField so screens do not hardcode them.
export const componentTheme = {
  button: {
    height: sizes.button,
    radius: radius.md,

    primary: {
      background: colors.primary,
      text: colors.white,
    },

    secondary: {
      background: colors.primaryLight,
      text: colors.white,
    },

    outline: {
      background: colors.transparent,
      border: colors.primary,
      text: colors.primary,
    },

    danger: {
      background: colors.error,
      text: colors.white,
    },

    warning: {
      background: colors.warning,
      text: colors.white,
    },

    disabled: {
      background: colors.surfaceTertiary,
      text: colors.textDisabled,
      border: colors.borderLight,
    },
  },

  input: {
    height: sizes.input,
    radius: radius.md,
    background: colors.transparent,
    border: colors.borderLight,
    focusedBorder: colors.borderFocused,
    errorBorder: colors.error,
    text: colors.text,
    placeholder: colors.textTertiary,
    disabledBackground: colors.transparent,
    disabledText: colors.textDisabled,
  },

  card: {
    radius: radius.lg,
    background: colors.surface,
    border: colors.borderLight,
  },

  fab: {
    size: sizes.fab,
    radius: radius.circle,

    background: colors.primary,
    icon: colors.white,
  },

  bottomTab: {
    height: sizes.bottomTab,
    background: colors.surface,

    active: colors.primary,
    inactive: colors.textTertiary,
  },

  transaction: {
    background: colors.surface,
    title: colors.text,
    subtitle: colors.textSecondary,
    amount: colors.text,
    date: colors.textTertiary,
  },
} as const;