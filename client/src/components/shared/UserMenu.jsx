import { LogOut, User } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserAvatarUrl } from '../../utils/userAvatar';
import { useAnimatedOpen } from '../../hooks/useAnimatedOpen';
import AnimatedDropdown from './AnimatedDropdown';
import { headerFlyoutPanelClass, navMenuItemClass } from './navStyles';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const menuId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const flyout = useAnimatedOpen(open);

  const avatarUrl = getUserAvatarUrl(user);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('click', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div
      ref={rootRef}
      className={`relative shrink-0 transition-transform duration-200 ${
        open || flyout.shouldRender ? 'z-[60]' : ''
      }`}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={`group relative flex size-9 items-center justify-center rounded-full transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-header ${
          open
            ? 'ring-2 ring-primary/70'
            : 'ring-2 ring-border hover:ring-primary/50 hover:scale-105 active:scale-95'
        }`}
      >
        <img
          src={avatarUrl}
          alt=""
          className="size-8 rounded-full border border-border object-cover transition-transform duration-200 group-hover:brightness-110"
          width={32}
          height={32}
          referrerPolicy="no-referrer"
        />
        <span className="sr-only">Account menu for {user.name}</span>
      </button>

      <AnimatedDropdown
        shouldRender={flyout.shouldRender}
        isShown={flyout.isShown}
        id={menuId}
        role="menu"
        className={`${headerFlyoutPanelClass} w-52 py-1 max-sm:w-auto`}
        onClick={(event) => event.stopPropagation()}
      >
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-subtle-foreground">{user.email}</p>
          </div>
          <div className="p-1">
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={navMenuItemClass}
            >
              <User className="size-4 shrink-0" aria-hidden />
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className={navMenuItemClass}
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              Sign out
            </button>
          </div>
      </AnimatedDropdown>
    </div>
  );
}
