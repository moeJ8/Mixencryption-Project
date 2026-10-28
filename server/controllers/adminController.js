const User = require('../models/User');
const {
  listAuditLogsForAdmin,
  writeAuditLog,
} = require('../services/auditLogService');
const getClientIp = require('../utils/getClientIp');
const { parsePagination } = require('../utils/parsePagination');
const { updateUserSchema } = require('../validators/adminSchemas');

async function assertCanDemoteAdmin(user) {
  if (user.role !== 'admin') return null;
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount <= 1) {
    return 'Cannot demote the last admin account.';
  }
  return null;
}

async function listUsers(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [users, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name username email role isEmailVerified createdAt publicKeyPem')
        .lean(),
      User.countDocuments(),
    ]);

    const items = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      hasCryptoKeys: Boolean(user.publicKeyPem),
      createdAt: user.createdAt,
    }));

    return res.json({
      items,
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
}

async function listAuditLogs(req, res, next) {
  try {
    const result = await listAuditLogsForAdmin(req.query);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateUser(req, res, next) {
  const ip = getClientIp(req);
  try {
    const body = updateUserSchema.parse(req.body);
    const targetId = req.params.id;

    if (!targetId) {
      return res.status(400).json({ message: 'User id is required.' });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin' && body.role === 'user') {
      const block = await assertCanDemoteAdmin(user);
      if (block) {
        return res.status(400).json({ message: block });
      }
    }

    const previousRole = user.role;
    user.name = body.name;
    user.username = body.username;
    user.email = body.email;
    user.role = body.role;
    await user.save();

    const roleChanged = previousRole !== body.role;
    await writeAuditLog({
      userId: req.user.id,
      action: roleChanged ? 'USER_ROLE_CHANGED' : 'USER_UPDATED',
      ipAddress: ip,
      status: 'SUCCESS',
      details: roleChanged
        ? `target=${user.username} from=${previousRole} to=${body.role}`
        : `target=${user.username}`,
    });

    return res.json({ user: user.toSafeJSON() });
  } catch (err) {
    return next(err);
  }
}

async function deleteUser(req, res, next) {
  const ip = getClientIp(req);
  try {
    const targetId = req.params.id;

    if (!targetId) {
      return res.status(400).json({ message: 'User id is required.' });
    }

    if (req.user.id === targetId) {
      return res.status(400).json({ message: 'You cannot delete your own account from the dashboard.' });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      const block = await assertCanDemoteAdmin(user);
      if (block) {
        return res.status(400).json({ message: 'Cannot delete the last admin account.' });
      }
    }

    const username = user.username;
    await User.findByIdAndDelete(targetId);

    await writeAuditLog({
      userId: req.user.id,
      action: 'USER_DELETED',
      ipAddress: ip,
      status: 'SUCCESS',
      details: `target=${username}`,
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listUsers,
  listAuditLogs,
  updateUser,
  deleteUser,
};
