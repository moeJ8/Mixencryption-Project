export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 32;

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;

/** Align with server registerSchema email check. */
export function isValidEmail(value) {
  const trimmed = String(value || "")
    .trim()
    .toLowerCase();
  if (!trimmed || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validateUsername(value) {
  const username = String(value || "")
    .trim()
    .toLowerCase();
  if (!username) {
    return {
      ok: false,
      message:
        "Username is required. Pick at least 4 characters using letters, numbers, dots, underscores, or hyphens.",
    };
  }
  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      ok: false,
      message: `Username is too short (${username.length} of ${USERNAME_MIN_LENGTH} characters). Use at least ${USERNAME_MIN_LENGTH} characters: letters, numbers, dots, underscores, or hyphens only.`,
    };
  }
  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `Username is too long (${username.length} characters, max ${USERNAME_MAX_LENGTH}). Shorten it and use only letters, numbers, dots, underscores, or hyphens.`,
    };
  }
  if (!USERNAME_PATTERN.test(username)) {
    const invalidChars = [
      ...new Set(username.replace(/[a-z0-9._-]/g, "")),
    ].join(" ");
    const extra =
      invalidChars.length > 0 ? ` Remove or replace: ${invalidChars}.` : "";
    return {
      ok: false,
      message: `Username has invalid characters.${extra} Allowed: letters (a-z), numbers, dots (.), underscores (_), and hyphens (-).`,
    };
  }
  return { ok: true, value: username };
}

export function validateRegisterFields({ name, username, email }) {
  /** @type {Record<string, string>} */
  const fieldErrors = {};

  if (!String(name || "").trim()) {
    fieldErrors.name = "Name is required.";
  }

  const usernameCheck = validateUsername(username);
  if (!usernameCheck.ok) {
    fieldErrors.username = usernameCheck.message;
  }

  const mail = String(email || "")
    .trim()
    .toLowerCase();
  if (!mail) {
    fieldErrors.email = "Email is required.";
  } else if (!isValidEmail(mail)) {
    fieldErrors.email = "A valid email is required.";
  }

  return {
    ok: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export const USERNAME_HINT =
  "4–32 characters: letters, numbers, dots, underscores, hyphens.";
