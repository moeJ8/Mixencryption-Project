const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    authProvider: { type: String, enum: ['local'], default: 'local' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    publicKeyPem: { type: String, default: null },
    wrappedPrivateKey: { type: String, default: null },
    wrapIv: { type: String, default: null },
    kdfSalt: { type: String, default: null },
    kdfIterations: { type: Number, default: null },
    profileImageUrl: { type: String, default: null, trim: true, maxlength: 2048 },
  },
  { timestamps: true },
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    username: this.username,
    email: this.email,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    hasCryptoKeys: Boolean(this.publicKeyPem),
    profileImageUrl: this.profileImageUrl || null,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
