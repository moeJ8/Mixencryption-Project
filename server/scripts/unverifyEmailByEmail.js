/**
 * Dev helper: set isEmailVerified=false and send a new verification email.
 * Usage: node scripts/unverifyEmailByEmail.js user@example.com
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const { issueEmailVerification } = require('../services/verificationService');

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error('Usage: node scripts/unverifyEmailByEmail.js <email>');
    process.exit(1);
  }

  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  user.isEmailVerified = false;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpires = null;
  await user.save();

  await issueEmailVerification(user);
  console.log(`Unverified ${email} and sent a new verification email.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
