const { z } = require('zod');
const {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_MESSAGE,
  passwordMeetsPolicy,
} = require('../utils/passwordPolicy');

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS_MESSAGE)
  .max(PASSWORD_MAX_LENGTH, 'Password is too long.')
  .refine(passwordMeetsPolicy, PASSWORD_REQUIREMENTS_MESSAGE);

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, 'Username must be at least 4 characters.')
  .max(32, 'Username must be at most 32 characters.')
  .regex(/^[a-z0-9._-]+$/, 'Username may only use letters, numbers, dots, underscores, and hyphens.');

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email('A valid email is required.'),
  password: passwordSchema,
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

const resendVerificationSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or username is required.'),
});

const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email is required.'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required.'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  password: passwordSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
  emailOnlySchema,
  verifyEmailSchema,
  resetPasswordSchema,
};
