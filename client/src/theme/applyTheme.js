import { tokenToCssVar } from './tokens.js';
import {
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
  resolveActivePreset,
} from './presets/index.js';

export function applyPresetColors(preset, target = document.documentElement) {
  if (!preset?.colors || !target?.style) return;

  Object.entries(preset.colors).forEach(([key, value]) => {
    if (value == null || value === '') return;
    target.style.setProperty(tokenToCssVar(key), String(value));
  });

  target.dataset.themeId = preset.id;
  target.dataset.themeMode = preset.mode;
}

export function applyActiveTheme({
  darkMode,
  lightThemeId = DEFAULT_LIGHT_THEME_ID,
  darkThemeId = DEFAULT_DARK_THEME_ID,
} = {}) {
  if (typeof document === 'undefined') return null;

  const root = document.documentElement;
  if (darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  const preset = resolveActivePreset({
    darkMode,
    lightThemeId,
    darkThemeId,
  });

  if (preset) {
    applyPresetColors(preset, root);
  }

  return preset;
}
