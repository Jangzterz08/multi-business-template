import { useContext } from 'react';
import { PresetContext } from './presetContextValue';
import type { PresetConfig } from '../types/preset';

export function usePreset(): PresetConfig {
  const value = useContext(PresetContext);
  if (!value) {
    throw new Error('usePreset must be used inside PresetProvider');
  }

  return value.preset;
}
