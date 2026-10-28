import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Label from "./Label";

export default function FieldGroup({
  id,
  label,
  type = "text",
  required,
  error,
  invalid = false,
  helperText,
  helperVisible = "always",
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const fallbackId = useId();
  const fieldId = id || fallbackId;

  const errorId = error ? `${fieldId}-error` : undefined;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const showInvalid = Boolean(error) || invalid;
  const isPassword = type === "password";

  const showHelper =
    Boolean(helperText) &&
    !error &&
    (helperVisible === "always" ||
      (helperVisible === "focus-or-error" && focused && !showInvalid));

  const describedBy =
    [error && errorId, showHelper && helperId].filter(Boolean).join(" ") ||
    undefined;

  const inputType = isPassword && passwordVisible ? "text" : type;
  const { className: inputClassName, ...restInputProps } = inputProps;
  const mergedInputClass = [
    isPassword ? "password-field-input pr-10" : "",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <div className={isPassword ? "relative" : undefined}>
        <Input
          id={fieldId}
          type={inputType}
          invalid={showInvalid}
          aria-describedby={describedBy}
          required={required}
          className={mergedInputClass || undefined}
          onFocus={(event) => {
            setFocused(true);
            restInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            restInputProps.onBlur?.(event);
          }}
          {...restInputProps}
        />
        {isPassword ? (
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((value) => !value)}
          >
            {passwordVisible ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </Button>
        ) : null}
      </div>
      {showHelper ? (
        <p id={helperId} className="mt-1 text-xs text-subtle-foreground">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="mt-1 text-xs text-danger-foreground"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
