import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {useColorScheme} from 'react-native';
import {
  getCurrentUser,
  subscribeToCurrentUser,
  updateThemePreference,
} from '../../composition';
import type {ThemePreference} from '../../domain/entities';
import {darkColors, lightColors} from '../theme/colors';
import type {Colors} from '../theme/colors';

// ─── Context shape ────────────────────────────────────────────────────────────

type ThemeContextValue = {
  /** Active color palette resolved from preference + system scheme. */
  colors: Colors;
  /** True when the resolved palette is the dark one. */
  isDark: boolean;
  /**
   * The user's explicit choice. Null/undefined = follow the system.
   * 'system' is also treated as "follow system" so the toggle can round-trip.
   */
  themePreference: ThemePreference | null;
  /** Writes to React state and Realm simultaneously. */
  setThemePreference: (pref: ThemePreference) => void;
  /** Resets theme preference back to system default (used on logout). */
  resetThemePreference: () => void;
  /** Re-reads theme preference from Realm (used after login). */
  refreshThemePreference: () => void;
};

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * Resolves the active palette.
 * Priority: user override ('light' | 'dark') > system scheme > light fallback.
 */
const resolveIsDark = (
  pref: ThemePreference | null,
  systemScheme: 'light' | 'dark' | null | undefined,
): boolean => {
  if (pref === 'dark') {
    return true;
  }
  if (pref === 'light') {
    return false;
  }
  // 'system' or null/undefined => follow the device
  return systemScheme === 'dark';
};

// ─── Context & Provider ───────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {children: ReactNode};

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const systemScheme = useColorScheme();

  // Seed from Realm on mount so the right palette is applied before first paint.
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference | null>(() => {
      const user = getCurrentUser();
      return user?.themePreference ?? null;
    });

  const refreshThemePreference = useCallback(() => {
    const user = getCurrentUser();
    setThemePreferenceState(user?.themePreference ?? null);
  }, []);

  const resetThemePreference = useCallback(() => {
    setThemePreferenceState(null);
  }, []);

  useEffect(() => subscribeToCurrentUser(refreshThemePreference), [
    refreshThemePreference,
  ]);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    updateThemePreference(pref);
  }, []);

  const isDark = resolveIsDark(themePreference, systemScheme);
  const colors: Colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        themePreference,
        setThemePreference,
        resetThemePreference,
        refreshThemePreference,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the active theme. Must be used inside <ThemeProvider>.
 * Call setThemePreference('dark' | 'light' | 'system') to let the user
 * override the system setting. The choice is persisted in Realm.
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>');
  }
  return ctx;
};
