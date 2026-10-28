const { z } = require('zod');

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, 'Username must be at least 4 characters.')
  .max(32, 'Username must be at most 32 characters.')
  .regex(/^[a-z0-9._-]+$/, 'Username may only use letters, numbers, dots, underscores, and hyphens.');

const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'Role must be user or admin.' }),
  }),
});

const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email('A valid email is required.'),
  role: z.enum(['user', 'admin']),
});

module.exports = {
  updateUserRoleSchema,
  updateUserSchema,
};
