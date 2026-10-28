import { Check, ChevronDown, Palette } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPresets, resolveActivePreset } from '../../theme/index.js';
import { selectThemeState, selectThemePreset } from '../../redux/themeSlice.js';
import { useAnimatedOpen } from '../../hooks/useAnimatedOpen';
import AnimatedDropdown from './AnimatedDropdown';
import { headerFlyoutPanelClass, navChromeButtonClass } from './navStyles';

function PresetSwatch({ preset }) {
  const { background, primary, accent, border } = preset.colors;
  return (
    <span className="flex shrink-0 overflow-hidden rounded border border-border">
      <span className="size-3" style={{ background: background }} aria-hidden />
      <span className="size-3" style={{ background: primary }} aria-hidden />
      <span className="size-3" style={{ background: accent }} aria-hidden />
      <span className="size-3" style={{ background: border }} aria-hidden />
    </span>
  );
}

function PresetOption({ preset, selected, onSelect }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(preset.id);
      }}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-200 ${
        selected
          ? 'bg-surface text-accent'
          : 'text-muted-foreground hover:bg-surface hover:text-accent'
      }`}
    >
      <PresetSwatch preset={preset} />
      <span className="flex-1 font-medium">{preset.label}</span>
      {selected ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : null}
    </button>
  );
}

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectThemeState);
  const { darkMode } = theme;
  const activePreset = resolveActivePreset(theme);
  const menuId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [panelTab, setPanelTab] = useState(darkMode ? 'dark' : 'light');
  const flyout = useAnimatedOpen(open);

  useEffect(() => {
    if (open) {
      setPanelTab(darkMode ? 'dark' : 'light');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDocumentClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocumentClick, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const lightPresets = listPresets('light');
  const darkPresets = listPresets('dark');
  const visiblePresets = panelTab === 'dark' ? darkPresets : lightPresets;
  const activeTabMatchesMode =
    (panelTab === 'dark' && darkMode) || (panelTab === 'light' && !darkMode);

  function isPresetActive(presetId) {
    return activeTabMatchesMode && activePreset?.id === presetId;
  }

  function handleSelect(presetId) {
    dispatch(selectThemePreset({ mode: panelTab, presetId }));
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={`relative shrink-0 ${open || flyout.shouldRender ? 'z-[60]' : ''}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className={`group gap-2 px-2.5 sm:max-w-[9.5rem] sm:px-3 ${navChromeButtonClass} ${
          open ? 'border-primary/60 bg-surface text-accent' : ''
        }`}
      >
        <Palette
          className={`size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:rotate-12 group-hover:text-accent ${
            open ? 'rotate-12 text-accent' : ''
          }`}
          aria-hidden
        />
        <span className="hidden max-w-[6.5rem] truncate text-sm font-medium sm:inline">
          {activePreset?.label ?? 'Theme'}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-accent ${
            open ? 'rotate-180 text-accent' : ''
          }`}
          aria-hidden
        />
      </button>

      <AnimatedDropdown
        shouldRender={flyout.shouldRender}
        isShown={flyout.isShown}
        id={menuId}
        role="listbox"
        aria-label="Theme"
        className={`${headerFlyoutPanelClass} p-2`}
        onClick={(event) => event.stopPropagation()}
      >
          <div
            role="tablist"
            aria-label="Theme mode"
            className="mb-2 flex rounded-lg border border-border bg-surface p-0.5"
          >
            {['light', 'dark'].map((mode) => {
              const isActive = panelTab === mode;
              const label = mode === 'light' ? 'Light' : 'Dark';
              return (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={(event) => {
                    event.stopPropagation();
                    setPanelTab(mode);
                  }}
                  className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-card text-accent shadow-sm'
                      : 'text-muted-foreground hover:bg-input hover:text-accent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-0.5">
            {visiblePresets.map((preset) => (
              <PresetOption
                key={preset.id}
                preset={preset}
                selected={isPresetActive(preset.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
      </AnimatedDropdown>
    </div>
  );
}
