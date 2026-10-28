const User = require('../models/User');

function sanitizeUsernameBase(raw) {
  const lowered = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '')
    .replace(/^[._-]+/, '')
    .slice(0, 32);

  if (lowered.length >= 3) {
    return lowered;
  }

  return `user${lowered}`.slice(0, 32).replace(/^[._-]+/, '') || 'user1';
}

async function generateUniqueUsername(seed) {
  const base = sanitizeUsernameBase(seed);
  let attempt = 0;

  while (attempt < 200) {
    const suffix = attempt === 0 ? '' : `_${attempt}`;
    const trimmedBase = base.slice(0, Math.max(3, 32 - suffix.length));
    const candidate = `${trimmedBase}${suffix}`;
    const exists = await User.exists({ username: candidate });
    if (!exists) {
      return candidate;
    }
    attempt += 1;
  }

  return `user${Date.now().toString(36).slice(-8)}`;
}

module.exports = { generateUniqueUsername };
