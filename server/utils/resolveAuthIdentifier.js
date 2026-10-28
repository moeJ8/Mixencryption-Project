function normalizeLoginIdentifier(raw) {
  return String(raw).trim().toLowerCase();
}

function buildUserLookupQuery(identifier) {
  const normalized = normalizeLoginIdentifier(identifier);
  if (normalized.includes('@')) {
    return { email: normalized };
  }
  return { username: normalized };
}

module.exports = {
  normalizeLoginIdentifier,
  buildUserLookupQuery,
};
