import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Run manually through Plesk "Run script": admin:reset.
// Never run automatically on startup and never put passwords in command arguments.
const username = (process.env.RESET_ADMIN_USERNAME || '').trim();
const password = process.env.RESET_ADMIN_PASSWORD || '';
let connection;
try {
  if (!username || username.length > 100 || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Set RESET_ADMIN_USERNAME (1–100 characters) and RESET_ADMIN_PASSWORD (at least 12 characters, at most 72 UTF-8 bytes) in the private hosting environment.');
  }
  if (!process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error('Configure DB_USER and DB_NAME first. No account was changed.');
  }
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  });
  const hash = await bcrypt.hash(password, 12);
  await connection.beginTransaction();
  await connection.execute(
    'INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
    [username, hash]
  );
  const [admins] = await connection.execute('SELECT id FROM admins WHERE username = ?', [username]);
  // Revoke existing sessions for this account; preserve sessions of other admins.
  const [tables] = await connection.execute(
    'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
    [process.env.DB_NAME, 'admin_sessions']
  );
  if (tables.length) {
    const [sessions] = await connection.query('SELECT session_id, data FROM admin_sessions');
    for (const row of sessions) {
      let data;
      try { data = JSON.parse(row.data); } catch { continue; }
      if (String(data.adminUserId) === String(admins[0].id)) {
        await connection.execute('DELETE FROM admin_sessions WHERE session_id = ?', [row.session_id]);
      }
    }
  }
  await connection.commit();
  console.log('Admin account reset successfully. Remove RESET_ADMIN_PASSWORD and RESET_ADMIN_USERNAME from the hosting environment, then sign in with the credentials you selected.');
} catch (error) {
  if (connection) await connection.rollback().catch(() => {});
  // Do not print SQL, connection options or password values to hosting logs.
  const safeCode = ['ER_NO_SUCH_TABLE', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ECONNREFUSED'].includes(error.code) ? error.code : 'RESET_FAILED';
  console.error(connection || error.code ? safeCode + ': Reset failed. Check database configuration and ensure server.js has initialized the CMS tables.' : error.message);
  process.exitCode = 1;
} finally {
  if (connection) await connection.end();
}
