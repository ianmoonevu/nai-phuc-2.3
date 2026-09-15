import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import session from 'express-session';

export const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const dataRoot = path.resolve(process.env.HOKI_DATA_DIR || path.join(appRoot, '..', 'private', 'hoki-cms'));
if (dataRoot === appRoot || dataRoot.startsWith(appRoot + path.sep)) {
  throw new Error('HOKI_DATA_DIR must be outside the application/public directory.');
}
fs.mkdirSync(dataRoot, { recursive: true, mode: 0o700 });
export const uploadRoot = path.join(dataRoot, 'uploads');
fs.mkdirSync(uploadRoot, { recursive: true, mode: 0o700 });
export const db = new DatabaseSync(path.join(dataRoot, 'cms.sqlite'));
db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS site_content (content_key TEXT PRIMARY KEY, content_json TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS consultation_requests (id TEXT PRIMARY KEY, payload_json TEXT NOT NULL, status TEXT NOT NULL, submitted_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS media_uploads (id TEXT PRIMARY KEY, original_name TEXT NOT NULL, stored_name TEXT NOT NULL, url TEXT NOT NULL, mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, category TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS admin_sessions (session_id TEXT PRIMARY KEY, data TEXT NOT NULL, expires INTEGER NOT NULL);
  CREATE INDEX IF NOT EXISTS session_expiry ON admin_sessions(expires);`);

export function transaction(action) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = action(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}

export function readRecovery() {
  const file = path.join(appRoot, '..', 'private', 'hoki-admin-reset.env');
  return fs.existsSync(file) ? dotenv.parse(fs.readFileSync(file)) : {};
}

export function initializeAdmin() {
  transaction(() => {
    if (db.prepare('SELECT id FROM admins LIMIT 1').get()) return;
    const recovery = readRecovery();
    const selectedUser = recovery.RESET_ADMIN_USERNAME || process.env.ADMIN_USERNAME || 'admin';
    const selectedPassword = recovery.RESET_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
    const valid = selectedPassword && selectedPassword.length >= 12 && Buffer.byteLength(selectedPassword) <= 72;
    const credentialsFile = path.join(dataRoot, 'ADMIN-LOGIN.json');
    // Preserve the generated credential if an earlier boot stopped before its DB commit.
    let generated;
    if (!valid && fs.existsSync(credentialsFile)) generated = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    const username = String(generated?.username || selectedUser).trim();
    const password = valid ? selectedPassword : generated?.password || crypto.randomBytes(24).toString('base64url');
    if (!username || username.length > 100) throw new Error('Invalid initial admin username');
    if (!valid && !generated) fs.writeFileSync(credentialsFile, JSON.stringify({ username, password }, null, 2), { flag: 'wx', mode: 0o600 });
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, bcrypt.hashSync(password, 12));
  });
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run('session-secret', crypto.randomBytes(48).toString('hex'));
}

export class SQLiteSessionStore extends session.Store {
  get(id, callback) {
    try {
      const row = db.prepare('SELECT data FROM admin_sessions WHERE session_id = ? AND expires > ?').get(id, Date.now());
      callback(null, row ? JSON.parse(row.data) : null);
    } catch (error) { callback(error); }
  }
  set(id, value, callback = () => {}) {
    try {
      const expires = value.cookie?.expires ? new Date(value.cookie.expires).getTime() : Date.now() + 8 * 3600000;
      db.prepare('INSERT INTO admin_sessions VALUES (?, ?, ?) ON CONFLICT(session_id) DO UPDATE SET data=excluded.data, expires=excluded.expires').run(id, JSON.stringify(value), expires);
      db.prepare('DELETE FROM admin_sessions WHERE expires <= ?').run(Date.now());
      callback(null);
    } catch (error) { callback(error); }
  }
  destroy(id, callback = () => {}) {
    try { db.prepare('DELETE FROM admin_sessions WHERE session_id=?').run(id); callback(null); }
    catch (error) { callback(error); }
  }
  touch(id, value, callback) { this.set(id, value, callback); }
}
