// Text styles. Spread onto Text; do not nest inside another text style object.
import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  } as TextStyle,

  heading1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  } as TextStyle,

  heading2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  } as TextStyle,

  heading3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  } as TextStyle,

  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,

  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,

  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
  } as TextStyle,
} as const;