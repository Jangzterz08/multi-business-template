import { dentalPreset } from './dental/config';
import { gymPreset } from './gym/config';
import { restaurantPreset } from './restaurant/config';
import { salonPreset } from './salon/config';
import type { PresetConfig } from '../types/preset';

export type PresetKey = 'dental' | 'salon' | 'gym' | 'restaurant';

const PRESETS: Record<PresetKey, PresetConfig> = {
  dental: dentalPreset,
  salon: salonPreset,
  gym: gymPreset,
  restaurant: restaurantPreset
};

export const presetKeys = Object.keys(PRESETS) as PresetKey[];

export function getPresetConfig(presetKey?: string): PresetConfig {
  if (!presetKey) {
    return PRESETS.restaurant;
  }

  const normalized = presetKey.toLowerCase() as PresetKey;
  return PRESETS[normalized] ?? PRESETS.restaurant;
}
