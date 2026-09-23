import {render, type RenderOptions} from '@testing-library/react-native';
import type {ReactElement} from 'react';
import {ThemeProvider} from '../../src/shared/context';

export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: ThemeProvider, ...options});
