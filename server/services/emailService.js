const nodemailer = require('nodemailer');
const { getClientAppUrl } = require('../config/clientAppUrl');
const {
  buildPasswordResetEmailHtml,
  buildVerificationEmailHtml,
} = require('./emailTemplates');

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

let transporter = null;

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

function getFromAddress() {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const name = process.env.SMTP_FROM_NAME || 'MixEncryption';
  return { name, address: from };
}

function getTransporter() {
  if (transporter) return transporter;

  if (!isSmtpConfigured()) {
    transporter = null;
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function deliverMail({ to, subject, text, html }) {
  const from = getFromAddress();
  const payload = {
    from: `${from.name} <${from.address}>`,
    to,
    subject,
    text,
    html,
  };

  const transport = getTransporter();
  if (!transport) {
    console.log('[mixencryption-email:dev]', subject, '\n', text);
    return { dev: true };
  }

  return transport.sendMail(payload);
}

function verificationUrl(token) {
  const base = getClientAppUrl();
  return `${base}/verify-email?token=${encodeURIComponent(token)}`;
}

function resetPasswordUrl(token) {
  const base = getClientAppUrl();
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

async function sendVerificationEmail(user, token) {
  const url = verificationUrl(token);
  const subject = 'Verify your MixEncryption email';
  const text = `Hello ${user.name},

Verify your email (expires in 24 hours):
${url}

If you did not create an account, you can ignore this message.

MixEncryption`;

  const html = buildVerificationEmailHtml(user, url);

  return deliverMail({ to: user.email, subject, text, html });
}

async function sendPasswordResetEmail(user, token) {
  const url = resetPasswordUrl(token);
  const subject = 'Reset your MixEncryption password';
  const text = `Hello ${user.name},

Reset your password (expires in 1 hour):
${url}

If you did not request a reset, you can ignore this message.

MixEncryption`;

  const html = buildPasswordResetEmailHtml(user, url);

  return deliverMail({ to: user.email, subject, text, html });
}

module.exports = {
  VERIFICATION_TTL_MS,
  RESET_TTL_MS,
  isSmtpConfigured,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
