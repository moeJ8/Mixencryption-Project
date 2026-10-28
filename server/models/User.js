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
    passwordHash: {
      type: String,
      required() {
        return this.authProvider !== 'google';
      },
      select: false,
    },
    googleId: { type: String, default: null, unique: true, sparse: true, select: false },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
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
    profileImagePublicId: { type: String, default: null, select: false, trim: true, maxlength: 512 },
  },
  { timestamps: true },
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    username: this.username,
    email: this.email,
    authProvider: this.authProvider,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    hasCryptoKeys: Boolean(this.publicKeyPem),
    profileImageUrl: this.profileImageUrl || null,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
