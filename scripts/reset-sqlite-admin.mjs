import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db, dataRoot, readRecovery, transaction } from '../server/storage.js';

try {
  const recovery = readRecovery();
  const username = (recovery.RESET_ADMIN_USERNAME || process.env.RESET_ADMIN_USERNAME || 'admin').trim();
  const password = recovery.RESET_ADMIN_PASSWORD || process.env.RESET_ADMIN_PASSWORD || crypto.randomBytes(24).toString('base64url');
  if (process.argv.includes('--check-config')) {
    console.log(JSON.stringify({ mode: 'sqlite', databaseReady: true, usernamePresent: Boolean(username), passwordValidLength: password.length >= 12 && Buffer.byteLength(password) <= 72 }));
  } else {
    if (!username || username.length > 100 || password.length < 12 || Buffer.byteLength(password) > 72) throw new Error('Use an ID of 1–100 characters and a password of at least 12 characters, at most 72 UTF-8 bytes.');
    const hash = bcrypt.hashSync(password, 12);
    transaction(() => {
      db.prepare('INSERT INTO admins(username,password_hash) VALUES (?,?) ON CONFLICT(username) DO UPDATE SET password_hash=excluded.password_hash').run(username, hash);
      const admin = db.prepare('SELECT id FROM admins WHERE username=?').get(username);
      for (const row of db.prepare('SELECT session_id,data FROM admin_sessions').all()) {
        const value = JSON.parse(row.data);
        if (String(value.adminUserId) === String(admin.id)) db.prepare('DELETE FROM admin_sessions WHERE session_id=?').run(row.session_id);
      }
      fs.writeFileSync(path.join(dataRoot, 'ADMIN-LOGIN.json'), JSON.stringify({ username, password }, null, 2), { mode: 0o600 });
    });
    console.log('Admin account reset successfully. Read private/hoki-cms/ADMIN-LOGIN.json in File Manager. No MySQL configuration is needed.');
  }
} catch (error) {
  console.error('Reset failed:', error.message);
  process.exitCode = 1;
} finally { db.close(); }
