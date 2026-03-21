import type { PresetConfig } from '../types/preset';

function getDarkThemeTokens(preset: PresetConfig) {
  return {
    ...preset.designTokens,
    '--color-bg': '#07111f',
    '--color-surface': '#0f1a2d',
    '--color-surface-alt': '#15253d',
    '--color-text': '#f3f7ff',
    '--color-text-muted': '#b6c3d9',
    '--color-outline': '#2a3a55',
    '--shadow-soft': '0 24px 60px rgba(0, 0, 0, 0.35)'
  } as const;
}

export function applyDesignTokens(preset: PresetConfig, themeMode: 'light' | 'dark' = 'light'): void {
  const root = document.documentElement;
  root.dataset.preset = preset.id;
  root.dataset.siteTheme = themeMode;

  const activeTokens = themeMode === 'dark' ? getDarkThemeTokens(preset) : preset.designTokens;

  for (const [key, value] of Object.entries(activeTokens)) {
    root.style.setProperty(key, value);
  }
}
