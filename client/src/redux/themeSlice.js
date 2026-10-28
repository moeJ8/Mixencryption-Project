import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  applyActiveTheme,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
  normalizePresetId,
} from '../theme/index.js';

const LIGHT_THEME_STORAGE_KEY = 'mixencryption_lightThemeId';
const DARK_THEME_STORAGE_KEY = 'mixencryption_darkThemeId';
const DARK_MODE_STORAGE_KEY = 'mixencryption_darkMode';

function readStoredId(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function cacheThemeIds({ lightThemeId, darkThemeId, darkMode }) {
  try {
    if (lightThemeId) {
      localStorage.setItem(LIGHT_THEME_STORAGE_KEY, lightThemeId);
    }
    if (darkThemeId) {
      localStorage.setItem(DARK_THEME_STORAGE_KEY, darkThemeId);
    }
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(!!darkMode));
  } catch {
    /* ignore */
  }
}

function syncTheme(state) {
  applyActiveTheme({
    darkMode: state.darkMode,
    lightThemeId: state.lightThemeId,
    darkThemeId: state.darkThemeId,
  });
}

function getInitialState() {
  let lightThemeId =
    normalizePresetId(
      'light',
      readStoredId(LIGHT_THEME_STORAGE_KEY, DEFAULT_LIGHT_THEME_ID),
    ) || DEFAULT_LIGHT_THEME_ID;
  let darkThemeId =
    normalizePresetId(
      'dark',
      readStoredId(DARK_THEME_STORAGE_KEY, DEFAULT_DARK_THEME_ID),
    ) || DEFAULT_DARK_THEME_ID;

  let darkMode = true;
  if (typeof window !== 'undefined') {
    try {
      const savedMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (savedMode !== null) {
        darkMode = savedMode === 'true';
      } else {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      darkMode = true;
    }
  }

  const state = { darkMode, lightThemeId, darkThemeId };
  if (typeof document !== 'undefined') {
    syncTheme(state);
  }

  return state;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialState(),
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      cacheThemeIds(state);
      syncTheme(state);
    },
    setDarkMode: (state, action) => {
      state.darkMode = !!action.payload;
      cacheThemeIds(state);
      syncTheme(state);
    },
    setLightThemeId: (state, action) => {
      const id = normalizePresetId('light', action.payload) || action.payload;
      if (!id) return;
      state.lightThemeId = id;
      cacheThemeIds(state);
      syncTheme(state);
    },
    setDarkThemeId: (state, action) => {
      const id = normalizePresetId('dark', action.payload) || action.payload;
      if (!id) return;
      state.darkThemeId = id;
      cacheThemeIds(state);
      syncTheme(state);
    },
    setPresetForCurrentMode: (state, action) => {
      const id = action.payload;
      if (!id) return;
      if (state.darkMode) {
        state.darkThemeId = normalizePresetId('dark', id) || id;
      } else {
        state.lightThemeId = normalizePresetId('light', id) || id;
      }
      cacheThemeIds(state);
      syncTheme(state);
    },
    selectThemePreset: (state, action) => {
      const { mode, presetId } = action.payload || {};
      if (!mode || !presetId) return;
      if (mode === 'dark') {
        state.darkMode = true;
        state.darkThemeId = normalizePresetId('dark', presetId) || presetId;
      } else {
        state.darkMode = false;
        state.lightThemeId = normalizePresetId('light', presetId) || presetId;
      }
      cacheThemeIds(state);
      syncTheme(state);
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  setLightThemeId,
  setDarkThemeId,
  setPresetForCurrentMode,
  selectThemePreset,
} = themeSlice.actions;

export const selectThemeState = (state) => state.theme;

export const selectActivePresetId = createSelector([selectThemeState], (theme) =>
  theme.darkMode ? theme.darkThemeId : theme.lightThemeId,
);

export default themeSlice.reducer;
