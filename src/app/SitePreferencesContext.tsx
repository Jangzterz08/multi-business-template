import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { applyDesignTokens } from '../theme/applyDesignTokens';
import type { HomeExperienceLocale, PresetConfig } from '../types/preset';

export type SiteThemeMode = 'light' | 'dark';

const LOCALE_STORAGE_KEY_PREFIX = 'multi-business-template:site-locale:';
const THEME_STORAGE_KEY_PREFIX = 'multi-business-template:site-theme:';

interface SitePreferencesValue {
  locale: HomeExperienceLocale;
  localeToggleVisible: boolean;
  setLocale: (locale: HomeExperienceLocale) => void;
  setThemeMode: (themeMode: SiteThemeMode) => void;
  themeMode: SiteThemeMode;
  toggleThemeMode: () => void;
}

const SitePreferencesContext = createContext<SitePreferencesValue | undefined>(undefined);

function readStoredValue(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so the UI still works in restricted environments.
  }
}

function getLocaleStorageKey(preset: PresetConfig) {
  return `${LOCALE_STORAGE_KEY_PREFIX}${preset.id}`;
}

function getThemeStorageKey(preset: PresetConfig) {
  return `${THEME_STORAGE_KEY_PREFIX}${preset.id}`;
}

function getInitialLocale(preset: PresetConfig): HomeExperienceLocale {
  const storedLocale = readStoredValue(getLocaleStorageKey(preset));

  if (storedLocale === 'en' || storedLocale === 'it') {
    return storedLocale;
  }

  if (
    typeof window !== 'undefined' &&
    window.navigator.language.toLowerCase().startsWith('it') &&
    (preset.locales?.it || preset.homeExperience?.locales?.it)
  ) {
    return 'it';
  }

  return 'en';
}

function getInitialThemeMode(preset: PresetConfig): SiteThemeMode {
  const storedThemeMode = readStoredValue(getThemeStorageKey(preset));

  if (storedThemeMode === 'light' || storedThemeMode === 'dark') {
    return storedThemeMode;
  }

  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function SitePreferencesProvider({
  children,
  preset
}: PropsWithChildren<{ preset: PresetConfig }>) {
  const localeToggleVisible = Boolean(preset.locales?.it || preset.homeExperience?.locales?.it);
  const [locale, setLocale] = useState<HomeExperienceLocale>(() => getInitialLocale(preset));
  const [themeMode, setThemeMode] = useState<SiteThemeMode>(() => getInitialThemeMode(preset));

  useEffect(() => {
    applyDesignTokens(preset, themeMode);
    document.documentElement.dataset.siteLocale = locale;
    document.documentElement.dataset.siteTheme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
    writeStoredValue(getLocaleStorageKey(preset), locale);
    writeStoredValue(getThemeStorageKey(preset), themeMode);
  }, [locale, preset, themeMode]);

  useEffect(() => {
    if (!localeToggleVisible && locale !== 'en') {
      setLocale('en');
    }
  }, [locale, localeToggleVisible]);

  const value = useMemo<SitePreferencesValue>(
    () => ({
      locale,
      localeToggleVisible,
      setLocale,
      setThemeMode,
      themeMode,
      toggleThemeMode: () => setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))
    }),
    [locale, localeToggleVisible, themeMode]
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSitePreferences() {
  const context = useContext(SitePreferencesContext);

  if (!context) {
    throw new Error('useSitePreferences must be used within SitePreferencesProvider');
  }

  return context;
}
