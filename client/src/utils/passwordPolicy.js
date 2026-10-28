export const PASSWORD_HINT =
  "At least 8 characters, with one uppercase letter, one number, and one special character.";

export function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return {
      ok: false,
      message:
        "Password must be at least 8 characters and include one uppercase letter, one number, and one special character.",
    };
  }
  if (password.length > 128) {
    return { ok: false, message: "Password is too long." };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      message: "Password must include at least one uppercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Password must include at least one number." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      ok: false,
      message: "Password must include at least one special character.",
    };
  }
  return { ok: true, message: "" };
}
