// Grants or removes access to /admin. Run locally; needs serviceaccount.json.
//   node scratch/set_admin.mjs you@example.com
//   node scratch/set_admin.mjs you@example.com --remove
// The account must have signed in at /admin once, so that it exists.
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [email, flag] = process.argv.slice(2);
if (!email) {
  console.error('Usage: node scratch/set_admin.mjs <email> [--remove]');
  process.exit(1);
}

const key = JSON.parse(readFileSync(new URL('../serviceaccount.json', import.meta.url), 'utf8'));
initializeApp({ credential: cert(key) });

const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, flag === '--remove' ? {} : { admin: true });
console.log(`${flag === '--remove' ? 'Removed admin from' : 'Granted admin to'} ${email}. Sign out and back in at /admin.`);
