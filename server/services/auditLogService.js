const AuditLog = require('../models/AuditLog');

async function writeAuditLog({ userId = null, action, ipAddress = '', status, details = '' }) {
  await AuditLog.create({
    userId,
    action,
    ipAddress,
    status,
    details,
  });
}

module.exports = { writeAuditLog };
