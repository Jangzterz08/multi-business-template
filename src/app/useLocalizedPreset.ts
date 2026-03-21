import { useMemo } from 'react';
import { resolveLocalizedPreset } from '../presets/resolveLocalizedPreset';
import { useSitePreferences } from './SitePreferencesContext';
import { usePreset } from './usePreset';

export function useLocalizedPreset() {
  const preset = usePreset();
  const { locale } = useSitePreferences();

  return useMemo(() => resolveLocalizedPreset(preset, locale), [locale, preset]);
}
