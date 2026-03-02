import { createContext } from 'react';
import type { PresetConfig } from '../types/preset';

export interface PresetContextValue {
  preset: PresetConfig;
}

export const PresetContext = createContext<PresetContextValue | undefined>(undefined);
