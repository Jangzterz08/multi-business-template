import type { PresetConfig } from '../types/preset';

export function applyDesignTokens(preset: PresetConfig): void {
  const root = document.documentElement;
  root.dataset.preset = preset.id;

  for (const [key, value] of Object.entries(preset.designTokens)) {
    root.style.setProperty(key, value);
  }
}
