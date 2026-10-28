function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Table-based layout for Gmail/Outlook. Palette matches Slate Console theme tokens.
 */
function renderActionEmail({
  preheader,
  title,
  greetingName,
  bodyLines,
  buttonLabel,
  actionUrl,
  expiryNote,
  footerNote,
}) {
  const safeName = escapeHtml(greetingName);
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);
  const safeButton = escapeHtml(buttonLabel);
  const safeUrl = escapeHtml(actionUrl);
  const safeExpiry = escapeHtml(expiryNote);
  const safeFooter = escapeHtml(footerNote);

  const bodyHtml = bodyLines
    .map((line) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">${escapeHtml(line)}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${safeTitle}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Segoe UI, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#e2e8f0;font-family:system-ui,Segoe UI,Roboto,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#e2e8f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;">
          <tr>
            <td style="padding:0 0 16px;text-align:center;">
              <span style="font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#0e7490;">MixEncryption</span>
            </td>
          </tr>
          <tr>
            <td style="background-color:#020617;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height:3px;background-color:#0891b2;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:28px 28px 8px;">
                    <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:600;color:#f1f5f9;">${safeTitle}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 28px 24px;">
                    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#f1f5f9;">Hello ${safeName},</p>
                    ${bodyHtml}
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 24px;">
                      <tr>
                        <td style="border-radius:8px;background-color:#0891b2;">
                          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${safeButton}</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#94a3b8;">${safeExpiry}</p>
                    <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;word-break:break-all;">Or copy this link:<br /><a href="${safeUrl}" style="color:#22d3ee;text-decoration:underline;">${safeUrl}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#64748b;">${safeFooter}</p>
              <p style="margin:0;font-size:11px;line-height:1.4;color:#94a3b8;">Hybrid cryptographic framework · Üsküdar University course project</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildVerificationEmailHtml(user, url) {
  return renderActionEmail({
    preheader: 'Confirm your email to activate your MixEncryption account.',
    title: 'Verify your email',
    greetingName: user.name,
    bodyLines: [
      'Thanks for signing up. Confirm your email address to finish setting up your account and access the workspace.',
    ],
    buttonLabel: 'Verify email address',
    actionUrl: url,
    expiryNote: 'This link expires in 24 hours.',
    footerNote: 'If you did not create an account, you can ignore this message.',
  });
}

function buildPasswordResetEmailHtml(user, url) {
  return renderActionEmail({
    preheader: 'Reset your MixEncryption password.',
    title: 'Reset your password',
    greetingName: user.name,
    bodyLines: [
      'We received a request to reset the password for your account. Use the button below to choose a new password.',
    ],
    buttonLabel: 'Reset password',
    actionUrl: url,
    expiryNote: 'This link expires in 1 hour.',
    footerNote: 'If you did not request a reset, you can ignore this message.',
  });
}

module.exports = {
  escapeHtml,
  buildVerificationEmailHtml,
  buildPasswordResetEmailHtml,
};
