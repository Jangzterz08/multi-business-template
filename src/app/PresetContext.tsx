import type { PropsWithChildren } from 'react';
import { PresetContext } from './presetContextValue';
import type { PresetConfig } from '../types/preset';

export function PresetProvider({ preset, children }: PropsWithChildren<{ preset: PresetConfig }>) {
  return <PresetContext.Provider value={{ preset }}>{children}</PresetContext.Provider>;
}
