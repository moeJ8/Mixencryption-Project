import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { dropdownMenuPositionClass, useDropdownFlip } from '../../hooks/useDropdownFlip';
import { useAnimatedOpen } from '../../hooks/useAnimatedOpen';
import AnimatedDropdown from '../shared/AnimatedDropdown';
import Label from './Label';
import ScrollArea from './ScrollArea';

const triggerBase =
  'flex w-full items-center justify-between gap-2 rounded-lg border bg-input px-3 text-left text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50';

const sizeClasses = {
  sm: 'h-8 text-xs',
  md: 'h-9 text-sm',
};

const ITEM_HEIGHT = {
  sm: 32,
  md: 36,
};

const MAX_MENU_HEIGHT = 192;

/**
 * Compact themed select (custom listbox, not native <select>).
 */
export default function Select({
  id: idProp,
  label,
  required,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  disabled = false,
  invalid = false,
  size = 'md',
  className = '',
}) {
  const generatedId = useId();
  const id = idProp || generatedId;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const flyout = useAnimatedOpen(open);

  const itemHeight = ITEM_HEIGHT[size] || ITEM_HEIGHT.md;

  const { openUpward, shouldPortal, portalStyle, isPositioned } = useDropdownFlip(triggerRef, open, {
    menuRef,
    optionCount: options.length,
    itemHeight,
    maxMenuHeight: MAX_MENU_HEIGHT,
    portalMenu: true,
  });

  const selected = options.find((option) => option.value === value);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (!open) return undefined;

    function onDocumentClick(event) {
      const inTrigger = rootRef.current?.contains(event.target);
      const inMenu = menuRef.current?.contains(event.target);
      if (!inTrigger && !inMenu) {
        setOpen(false);
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocumentClick, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const menuShellClass = `rounded-lg border border-border bg-card p-1 shadow-flyout ${
    shouldPortal ? '' : `absolute left-0 right-0 z-50 ${dropdownMenuPositionClass(openUpward)}`
  }`;

  const menuNode =
    flyout.shouldRender && isPositioned ? (
      <AnimatedDropdown
        ref={menuRef}
        shouldRender
        isShown={flyout.isShown}
        id={listboxId}
        role="listbox"
        aria-labelledby={id}
        className={menuShellClass}
        style={shouldPortal ? portalStyle : undefined}
      >
        <ScrollArea maxHeight={MAX_MENU_HEIGHT} ariaLabel="Options">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-surface text-accent'
                    : 'text-foreground hover:bg-surface hover:text-accent'
                } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check className="size-3.5 shrink-0 text-accent" aria-hidden /> : null}
              </button>
            );
          })}
        </ScrollArea>
      </AnimatedDropdown>
    ) : null;

  return (
    <div
      className={`relative ${className} ${open && !shouldPortal ? 'z-50' : ''}`}
      ref={rootRef}
      {...(open && !shouldPortal ? { 'data-dropdown-open': '' } : {})}
    >
      {label ? (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      ) : null}

      <div ref={triggerRef}>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-invalid={invalid ? 'true' : undefined}
          className={`${triggerBase} ${sizeClasses[size] || sizeClasses.md} ${
            invalid ? 'border-danger focus-visible:ring-danger/40' : 'border-input-border'
          } ${open ? 'border-primary/50 ring-2 ring-focus/40' : ''}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={`truncate ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
      </div>

      {shouldPortal && menuNode ? createPortal(menuNode, document.body) : menuNode}
    </div>
  );
}
