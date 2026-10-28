const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const { parsePagination } = require('../utils/parsePagination');

async function writeAuditLog({ userId = null, action, ipAddress = '', status, details = '' }) {
  await AuditLog.create({
    userId,
    action,
    ipAddress,
    status,
    details,
  });
}

function formatAuditLog(doc, { includeUser = false } = {}) {
  const entry = doc.toObject ? doc.toObject() : doc;
  const base = {
    id: entry._id.toString(),
    action: entry.action,
    status: entry.status,
    details: entry.details || '',
    ipAddress: entry.ipAddress || '',
    timestamp: entry.timestamp,
  };

  if (!includeUser) {
    return base;
  }

  if (entry.userId && typeof entry.userId === 'object') {
    base.user = {
      id: entry.userId._id.toString(),
      username: entry.userId.username,
      email: entry.userId.email,
      name: entry.userId.name,
    };
  } else {
    base.user = null;
  }

  return base;
}

function paginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

async function listAuditLogsForAdmin(query) {
  const { page, limit, skip } = parsePagination(query);
  const [rows, total] = await Promise.all([
    AuditLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email name')
      .lean(),
    AuditLog.countDocuments(),
  ]);

  return {
    items: rows.map((row) => formatAuditLog(row, { includeUser: true })),
    ...paginationMeta(page, limit, total),
  };
}

async function listAuditLogsForUser(userId, query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { userId: new mongoose.Types.ObjectId(userId) };

  const [rows, total] = await Promise.all([
    AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  return {
    items: rows.map((row) => formatAuditLog(row)),
    ...paginationMeta(page, limit, total),
  };
}

module.exports = {
  writeAuditLog,
  listAuditLogsForAdmin,
  listAuditLogsForUser,
};
