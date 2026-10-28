import frost from './light/frost.js';
import paper from './light/paper.js';
import horizon from './light/horizon.js';
import arcticTeal from './light/arctic-teal.js';
import slateConsole from './dark/slate-console.js';
import carbon from './dark/carbon.js';
import obsidian from './dark/obsidian.js';
import velvetPlum from './dark/velvet-plum.js';
import { REQUIRED_COLOR_KEYS } from '../tokens.js';

export const THEME_PRESETS = {
  light: {
    [horizon.id]: horizon,
    [frost.id]: frost,
    [paper.id]: paper,
    [arcticTeal.id]: arcticTeal,
  },
  dark: {
    [slateConsole.id]: slateConsole,
    [carbon.id]: carbon,
    [obsidian.id]: obsidian,
    [velvetPlum.id]: velvetPlum,
  },
};

export const DEFAULT_LIGHT_THEME_ID = horizon.id;
export const DEFAULT_DARK_THEME_ID = slateConsole.id;

const LEGACY_PRESET_IDS = {
  light: {
    daylight: horizon.id,
  },
  dark: {
    'midnight-violet': velvetPlum.id,
  },
};

export function normalizePresetId(mode, id) {
  if (!id) return null;
  const legacy = LEGACY_PRESET_IDS[mode]?.[id];
  return legacy || id;
}

export function listPresets(mode) {
  const bucket = THEME_PRESETS[mode];
  if (!bucket) return [];
  return Object.values(bucket);
}

export function getPreset(mode, id) {
  const bucket = THEME_PRESETS[mode];
  if (!bucket) return null;
  const normalized = normalizePresetId(mode, id);
  return bucket[normalized] || null;
}

export function resolveActivePreset({
  darkMode,
  lightThemeId = DEFAULT_LIGHT_THEME_ID,
  darkThemeId = DEFAULT_DARK_THEME_ID,
}) {
  if (darkMode) {
    return (
      getPreset('dark', darkThemeId) || getPreset('dark', DEFAULT_DARK_THEME_ID)
    );
  }
  return (
    getPreset('light', lightThemeId) ||
    getPreset('light', DEFAULT_LIGHT_THEME_ID)
  );
}

export function validatePreset(preset) {
  if (!preset?.colors) {
    return { ok: false, missing: REQUIRED_COLOR_KEYS };
  }
  const missing = REQUIRED_COLOR_KEYS.filter(
    (key) => preset.colors[key] == null || preset.colors[key] === '',
  );
  return { ok: missing.length === 0, missing };
}
