import { forwardRef } from "react";
import Spinner from "./Spinner";

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

const shapes = {
  default: "rounded-lg",
  pill: "rounded-full",
  circle: "rounded-full",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  icon: "size-9 p-0 text-sm",
  iconSm: "size-8 p-0 text-xs",
};

function variantClasses(variant, { active, selected }) {
  switch (variant) {
    case "primary":
      return joinClasses(
        "border border-transparent bg-primary text-primary-foreground",
        "hover:bg-primary-hover active:bg-primary-hover",
      );
    case "secondary":
      return joinClasses(
        "border border-border bg-surface text-foreground",
        "hover:border-primary/50 hover:bg-muted-surface hover:text-foreground",
        "active:bg-muted-surface",
        active && "border-primary/60 bg-surface text-accent",
      );
    case "ghost":
      return joinClasses(
        "border border-transparent bg-transparent text-muted-foreground",
        "hover:bg-surface hover:text-foreground",
        active && "bg-surface text-accent",
      );
    case "danger":
      return joinClasses(
        "border border-transparent bg-danger text-primary-foreground",
        "hover:opacity-90 active:opacity-95",
      );
    case "chrome":
      return joinClasses(
        "border border-border bg-input text-foreground",
        "hover:border-primary/50 hover:bg-surface hover:text-accent",
        active && "border-primary/60 bg-surface text-accent",
      );
    case "menu":
      return joinClasses(
        "w-full justify-start rounded-md px-2 py-2 text-sm",
        selected
          ? "bg-surface text-accent"
          : "text-muted-foreground hover:bg-surface hover:text-accent",
      );
    case "tab":
      return joinClasses(
        "flex-1 rounded-md px-2 py-1.5 text-xs",
        active
          ? "bg-card text-accent shadow-sm"
          : "text-muted-foreground hover:bg-input hover:text-accent",
      );
    default:
      return variantClasses("primary", { active, selected });
  }
}

/**
 * @param {'primary'|'secondary'|'ghost'|'danger'|'chrome'|'menu'|'tab'} [variant]
 * @param {'sm'|'md'|'lg'|'icon'|'iconSm'} [size]
 * @param {'default'|'pill'|'circle'} [shape]
 */
export default forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    shape = "default",
    fullWidth = false,
    loading = false,
    active = false,
    selected = false,
    className = "",
    type = "button",
    disabled,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const resolvedSize =
    shape === "circle" && (size === "md" || size === "sm" || size === "lg")
      ? size === "sm"
        ? "iconSm"
        : "icon"
      : size;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={joinClasses(
        base,
        shapes[shape] || shapes.default,
        sizes[resolvedSize] || sizes.md,
        variantClasses(variant, { active, selected }),
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4 shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
