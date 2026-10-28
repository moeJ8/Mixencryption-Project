const { z } = require('zod');

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters.')
  .max(32, 'Username must be at most 32 characters.')
  .regex(/^[a-z0-9._-]+$/, 'Username may only use letters, numbers, dots, underscores, and hyphens.');

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email('A valid email is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email is required.'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required.'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.'),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailOnlySchema,
  verifyEmailSchema,
  resetPasswordSchema,
};
