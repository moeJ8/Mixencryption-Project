function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badge(label, tone) {
  const cls =
    tone === 'ok'
      ? 'badge-ok'
      : tone === 'warn'
        ? 'badge-warn'
        : tone === 'off'
          ? 'badge-off'
          : 'badge-neutral';
  return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
}

function getMongoStatus(readyState) {
  if (readyState === 1) {
    return { label: 'Connected', tone: 'ok' };
  }
  if (readyState === 2) {
    return { label: 'Connecting', tone: 'warn' };
  }
  if (readyState === 0) {
    return { label: 'Disconnected', tone: 'off' };
  }
  return { label: 'Unavailable', tone: 'off' };
}

function renderApiRootPage({ clientAppUrl, mongoReadyState, cloudinary, googleOAuth, nodeEnv }) {
  const mongo = getMongoStatus(mongoReadyState);
  const safeAppUrl = escapeHtml(clientAppUrl);

  const rows = [
    { label: 'Service', value: badge('mixencryption-api', 'ok') },
    { label: 'Environment', value: badge(nodeEnv || 'development', 'neutral') },
    {
      label: 'MongoDB',
      value: badge(mongo.label, mongo.tone),
    },
    {
      label: 'Profile photos',
      value: cloudinary ? badge('Cloudinary', 'ok') : badge('Not configured', 'neutral'),
    },
    {
      label: 'Google sign-in',
      value: googleOAuth ? badge('Enabled', 'ok') : badge('Not configured', 'neutral'),
    },
  ];

  const statusHtml = rows
    .map(
      (row) => `<li class="status-row">
  <span class="status-label">${escapeHtml(row.label)}</span>
  <span class="status-value">${row.value}</span>
</li>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MixEncryption API</title>
  <link rel="stylesheet" href="/static/api-root.css">
</head>
<body>
  <main class="page">
    <p class="brand">MixEncryption</p>
    <h1 class="title">API host</h1>
    <p class="lead">This URL is the REST backend. Authentication, profiles, and admin run here. The web UI is deployed separately; open the app link below for login, docs, and lab pages.</p>
    <div class="grid">
      <section class="card" aria-labelledby="status-heading">
        <h2 id="status-heading" class="card-title">Backend status</h2>
        <ul class="status-list">
${statusHtml}
        </ul>
      </section>
      <section class="card" aria-labelledby="client-heading">
        <h2 id="client-heading" class="card-title">Web application</h2>
        <p class="card-note">Production UI</p>
        <p class="mono">${safeAppUrl}</p>
        <p class="card-note">JSON health check for monitors and load balancers:</p>
        <p class="mono"><a class="link-inline" href="/api/health">/api/health</a></p>
      </section>
    </div>
    <div class="actions">
      <a class="btn btn-primary" href="${safeAppUrl}">Open MixEncryption app</a>
      <a class="btn btn-secondary" href="/api/health">View health JSON</a>
    </div>
    <p class="footer-note">Hybrid encryption workspace and vault features are client-side and ship in the web app. This host stores identity and metadata only.</p>
  </main>
</body>
</html>`;
}

module.exports = { renderApiRootPage };
