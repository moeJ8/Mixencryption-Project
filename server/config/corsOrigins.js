function normalizeOrigin(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/\/$/, '');
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getAllowedOrigins() {
  const raw =
    process.env.CORS_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    'http://localhost:5173';

  const origins = raw
    .split(',')
    .map((part) => normalizeOrigin(part))
    .filter(Boolean);

  return [...new Set(origins)];
}

module.exports = { getAllowedOrigins };
