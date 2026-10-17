#!/usr/bin/env node
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAdd this to .env.local and to your Vercel environment variables:\n");
console.log(`ADMIN_PASSWORD_HASH='${hash}'\n`);
