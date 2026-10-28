const crypto = require('crypto');

const TOKEN_BYTES = 32;

function generateSecureToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

module.exports = { generateSecureToken, hashToken };
