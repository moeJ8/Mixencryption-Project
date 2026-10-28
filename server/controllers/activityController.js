const { listAuditLogsForUser } = require('../services/auditLogService');

async function listMyActivity(req, res, next) {
  try {
    const result = await listAuditLogsForUser(req.user.id, req.query);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { listMyActivity };
