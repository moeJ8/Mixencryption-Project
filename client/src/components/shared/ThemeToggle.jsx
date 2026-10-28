import { Check, ChevronDown, Moon, Palette, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../common/Button";
import { listPresets, resolveActivePreset } from "../../theme/index.js";
import { selectThemeState, selectThemePreset } from "../../redux/themeSlice.js";
import { useAnimatedOpen } from "../../hooks/useAnimatedOpen";
import AnimatedDropdown from "./AnimatedDropdown";
import { headerFlyoutPanelClass } from "./navStyles";

const MODE_TAB_ACTIVE = "font-semibold text-accent";
const MODE_TAB_IDLE = "text-muted-foreground hover:text-foreground";

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
    <Button
      type="button"
      role="option"
      variant="menu"
      selected={selected}
      aria-selected={selected}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(preset.id);
      }}
      className="gap-3 px-2 py-2 text-left"
    >
      <PresetSwatch preset={preset} />
      <span className="flex-1 font-medium">{preset.label}</span>
      {selected ? (
        <Check className="size-4 shrink-0 text-primary" aria-hidden />
      ) : null}
    </Button>
  );
}

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector(selectThemeState);
  const { darkMode } = theme;
  const activePreset = resolveActivePreset(theme);
  const menuId = useId();
  const presetListId = `${menuId}-presets`;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [panelTab, setPanelTab] = useState(darkMode ? "dark" : "light");
  const flyout = useAnimatedOpen(open);

  function toggleOpen() {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        setPanelTab(darkMode ? "dark" : "light");
      }
      return !wasOpen;
    });
  }

  useEffect(() => {
    if (!open) return;
    function onDocumentClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const lightPresets = listPresets("light");
  const darkPresets = listPresets("dark");
  const visiblePresets = panelTab === "dark" ? darkPresets : lightPresets;
  const activeTabMatchesMode =
    (panelTab === "dark" && darkMode) || (panelTab === "light" && !darkMode);

  const tabSlideTransform =
    panelTab === "dark" ? "translateX(100%)" : "translateX(0)";

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
      className={`relative shrink-0 ${open || flyout.shouldRender ? "z-60" : ""}`}
    >
      <Button
        type="button"
        variant="chrome"
        size="md"
        active={open}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={presetListId}
        onClick={(event) => {
          event.stopPropagation();
          toggleOpen();
        }}
        className="group gap-2 px-2.5 focus-visible:ring-offset-background sm:max-w-36 sm:px-3"
      >
        <Palette
          className={`size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:rotate-12 group-hover:text-accent ${
            open ? "rotate-12 text-accent" : ""
          }`}
          aria-hidden
        />
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
          {activePreset?.label ?? "Theme"}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-accent ${
            open ? "rotate-180 text-accent" : ""
          }`}
          aria-hidden
        />
      </Button>

      <AnimatedDropdown
        shouldRender={flyout.shouldRender}
        isShown={flyout.isShown}
        id={menuId}
        role="group"
        aria-label="Theme"
        className={`${headerFlyoutPanelClass} p-2`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 overflow-hidden rounded-lg border border-border bg-muted-surface">
          <div
            role="tablist"
            aria-label="Theme mode"
            className="relative grid grid-cols-2 border-b border-border"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-1/2 rounded-full bg-accent transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: tabSlideTransform }}
            />
            {[
              {
                mode: "light",
                label: "Light",
                Icon: Sun,
                iconClass: "text-warning",
              },
              {
                mode: "dark",
                label: "Dark",
                Icon: Moon,
                iconClass: "text-primary",
              },
            ].map(({ mode, label, Icon, iconClass }) => {
              const isActive = panelTab === mode;
              const iconTone = isActive ? iconClass : "text-muted-foreground";
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
                  className={`relative z-1 flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:text-sm ${
                    isActive ? MODE_TAB_ACTIVE : MODE_TAB_IDLE
                  }`}
                >
                  <Icon
                    className={`size-3.5 shrink-0 sm:size-4 ${iconTone}`}
                    aria-hidden
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={presetListId}
          role="listbox"
          aria-label="Theme presets"
          className="flex flex-col gap-0.5"
        >
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
