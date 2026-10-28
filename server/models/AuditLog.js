const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    action: { type: String, required: true, trim: true },
    ipAddress: { type: String, default: '' },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], required: true },
    details: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } },
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
