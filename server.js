import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { db, initializeAdmin, SQLiteSessionStore, uploadRoot, transaction } from './server/storage.js';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
  const register = app[method].bind(app);
  app[method] = (route, ...handlers) => register(route, ...handlers.map((handler) =>
    handler.constructor.name === 'AsyncFunction'
      ? (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
      : handler
  ));
}
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

initializeAdmin();
const database = {
  execute(sql, values = []) {
    const statement = db.prepare(sql);
    const args = values.map((value) => value instanceof Date ? value.toISOString() : value);
    return [sql.trimStart().toUpperCase().startsWith('SELECT') ? statement.all(...args) : statement.run(...args)];
  },
  query(sql, values = []) { return this.execute(sql, values); }
};

const CONTENT_KEYS = new Set([
  'projects',
  'articles',
  'media',
  'branding',
  'epc_partners',
  'epc_config',
  'about_info',
  'leadership',
  'advisory'
]);

function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function requireAdmin(req, res, next) {
  if (req.session?.adminUserId) return next();
  return res.status(401).json({ ok: false, error: 'Authentication required' });
}

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const sessionOptions = {
  name: 'np_admin_session',
  secret: db.prepare('SELECT value FROM settings WHERE key=?').get('session-secret').value,
  store: new SQLiteSessionStore(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: 'auto',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
};
app.use(session(sessionOptions));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many login attempts. Please try again later.' }
});

const consultationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' }
});

app.get('/api/health', (_req, res) => {
  db.prepare('SELECT 1').get();
  res.json({ ok: true, database: true, configured: true, mode: 'sqlite', version: 'sqlite-1' });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  if (!username || !password) {
    return res.status(400).json({ ok: false, error: 'Username and password are required' });
  }

  const [rows] = await database.execute(
    'SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1',
    [username]
  );
  const admin = Array.isArray(rows) ? rows[0] : null;
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  await new Promise((resolve, reject) => req.session.regenerate((error) => error ? reject(error) : resolve()));
  req.session.adminUserId = admin.id;
  req.session.adminUsername = admin.username;
  await new Promise((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve()))
  );
  return res.json({ ok: true, username: admin.username });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session?.adminUserId) {
    return res.status(401).json({ ok: false, authenticated: false });
  }
  return res.json({ ok: true, authenticated: true, username: req.session.adminUsername });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('np_admin_session');
    res.json({ ok: true });
  });
});

app.get('/api/content', async (_req, res) => {
  const [rows] = await database.query(
    'SELECT content_key, content_json, updated_at FROM site_content'
  );
  const content = {};
  const updatedAt = {};
  for (const row of rows) {
    if (!CONTENT_KEYS.has(row.content_key)) continue;
    content[row.content_key] = safeJsonParse(row.content_json, null);
    updatedAt[row.content_key] = row.updated_at;
  }
  return res.json({ ok: true, content, updatedAt, database: true });
});

app.get('/api/content/:key', async (req, res) => {
  const key = req.params.key;
  if (!CONTENT_KEYS.has(key)) {
    return res.status(404).json({ ok: false, error: 'Unknown content key' });
  }

  const [rows] = await database.execute(
    'SELECT content_json, updated_at FROM site_content WHERE content_key = ? LIMIT 1',
    [key]
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(404).json({ ok: false, error: 'Content not initialized' });
  }
  return res.json({
    ok: true,
    data: safeJsonParse(rows[0].content_json, null),
    updatedAt: rows[0].updated_at
  });
});

app.put('/api/content/:key', requireAdmin, async (req, res) => {
  const key = req.params.key;
  if (!CONTENT_KEYS.has(key)) {
    return res.status(404).json({ ok: false, error: 'Unknown content key' });
  }
  const value = req.body?.data;
  if (value === undefined) {
    return res.status(400).json({ ok: false, error: 'Missing data' });
  }

  const json = JSON.stringify(value);
  if (Buffer.byteLength(json, 'utf8') > 4 * 1024 * 1024) {
    return res.status(413).json({ ok: false, error: 'Content payload too large' });
  }

  await database.execute(
    `INSERT INTO site_content (content_key, content_json, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(content_key) DO UPDATE SET content_json = excluded.content_json, updated_at = excluded.updated_at`,
    [key, json, new Date().toISOString()]
  );
  return res.json({ ok: true, updatedAt: new Date().toISOString() });
});

app.post('/api/content/batch', requireAdmin, async (req, res) => {
  const entries = req.body?.content;
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
    return res.status(400).json({ ok: false, error: 'content must be an object' });
  }

  try {
    transaction(() => {
      for (const [key, value] of Object.entries(entries)) {
        if (!CONTENT_KEYS.has(key)) throw Object.assign(new Error('Unknown content key'), { status: 400 });
        const json = JSON.stringify(value);
        if (Buffer.byteLength(json, 'utf8') > 4 * 1024 * 1024) throw Object.assign(new Error('Content payload too large'), { status: 413 });
        db.prepare(`INSERT INTO site_content VALUES (?, ?, ?)
          ON CONFLICT(content_key) DO UPDATE SET content_json=excluded.content_json, updated_at=excluded.updated_at`)
          .run(key, json, new Date().toISOString());
      }
    });
    return res.json({ ok: true, updatedAt: new Date().toISOString() });
  } catch (error) { throw error; }
});

// First-login migration cannot overwrite keys created by another admin.
app.post('/api/content/initialize', requireAdmin, (req, res) => {
  const entries = req.body?.content;
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) return res.status(400).json({ ok: false, error: 'Invalid content' });
  transaction(() => {
    for (const [key, value] of Object.entries(entries)) {
      if (!CONTENT_KEYS.has(key)) throw Object.assign(new Error('Unknown content key'), { status: 400 });
      const json = JSON.stringify(value);
      if (Buffer.byteLength(json) > 4 * 1024 * 1024) throw Object.assign(new Error('Content too large'), { status: 413 });
      db.prepare('INSERT OR IGNORE INTO site_content VALUES (?, ?, ?)').run(key, json, new Date().toISOString());
    }
  });
  res.json({ ok: true });
});

app.post('/api/consultations', consultationLimiter, async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const firm = String(body.firm || '').trim();
  const email = String(body.email || '').trim();
  const projectType = String(body.projectType || '').trim();

  if (!name || !firm || !email || !projectType || !email.includes('@')) {
    return res.status(400).json({
      ok: false,
      error: 'Please provide name, company, valid email and project type'
    });
  }

  const record = {
    ...body,
    id: `req-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    name,
    firm,
    email,
    projectType,
    status: 'new',
    submittedAt: new Date().toISOString()
  };

  await database.execute(
    'INSERT INTO consultation_requests (id, payload_json, status, submitted_at) VALUES (?, ?, ?, ?)',
    [record.id, JSON.stringify(record), record.status, new Date(record.submittedAt)]
  );
  return res.status(201).json({ ok: true, data: record });
});

app.get('/api/consultations', requireAdmin, async (_req, res) => {
  const [rows] = await database.query(
    'SELECT payload_json, status FROM consultation_requests ORDER BY submitted_at DESC'
  );
  const data = rows.map((row) => ({
    ...safeJsonParse(row.payload_json, {}),
    status: row.status
  }));
  return res.json({ ok: true, data });
});

app.patch('/api/consultations/:id', requireAdmin, async (req, res) => {
  const status = String(req.body?.status || '');
  if (!['new', 'reviewed', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }

  const [rows] = await database.execute(
    'SELECT payload_json FROM consultation_requests WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(404).json({ ok: false, error: 'Request not found' });
  }

  const payload = { ...safeJsonParse(rows[0].payload_json, {}), status };
  await database.execute(
    'UPDATE consultation_requests SET payload_json = ?, status = ? WHERE id = ?',
    [JSON.stringify(payload), status, req.params.id]
  );
  return res.json({ ok: true, data: payload });
});

app.delete('/api/consultations/:id', requireAdmin, async (req, res) => {
  await database.execute('DELETE FROM consultation_requests WHERE id = ?', [req.params.id]);
  return res.json({ ok: true });
});

await fs.mkdir(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const extension = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp'
    }[file.mimetype];
    cb(null, `${Date.now()}-${crypto.randomBytes(10).toString('hex')}${extension || ''}`);
  }
});

const uploader = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const accepted = allowed.includes(file.mimetype);
    cb(accepted ? null : new Error('Only JPG, PNG and WebP files are allowed'), accepted);
  }
});

app.post(
  '/api/media/upload',
  requireAdmin,
  uploader.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const category = String(req.body?.category || 'general');
    const id = `media-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const url = `/uploads/${req.file.filename}`;

    await database.execute(
      'INSERT INTO media_uploads (id, original_name, stored_name, url, mime_type, size_bytes, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        req.file.originalname,
        req.file.filename,
        url,
        req.file.mimetype,
        req.file.size,
        category
      ]
    );

    return res.status(201).json({
      ok: true,
      data: {
        id,
        name: path.parse(req.file.originalname).name,
        url,
        size: `${Math.max(1, Math.round(req.file.size / 1024))} KB`,
        dimensions: 'Server Upload',
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        category
      }
    });
  }
);

app.use('/uploads', express.static(uploadRoot, { maxAge: '30d', index: false }));
// Preserve existing URLs from deployments made before private upload storage.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { index: false }));
app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'API endpoint not found' }));

{
  const distDir = path.join(__dirname, 'dist');
  app.use(express.static(distDir, {
    setHeaders(res, filePath) {
      res.setHeader('Cache-Control', filePath.endsWith('.html') ? 'no-store' : 'no-cache');
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  const message = isProduction ? 'Server error' : error.message;
  return res
    .status(error?.code === 'LIMIT_FILE_SIZE' ? 413 : error.status || 500)
    .json({ ok: false, error: message });
});

export const httpServer = app.listen(port, '0.0.0.0', () => {
  console.log(`HOKI CMS ready on port ${httpServer.address()?.port}; SQLite persistence enabled.`);
});
