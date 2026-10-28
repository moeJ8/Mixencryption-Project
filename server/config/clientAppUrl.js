function getClientAppUrl() {
  const raw =
    process.env.CLIENT_APP_URL ||
    process.env.CLIENT_ORIGIN ||
    'http://localhost:5173';
  return String(raw).split(',')[0].trim().replace(/\/$/, '');
}

module.exports = { getClientAppUrl };
