# Deploy Nai Phuc CMS on TENTEN cPanel

This branch changes the Admin Panel from browser-only `localStorage` persistence to an Express + MySQL backend.

## 1. Requirements

- TENTEN hosting plan with **Setup Node.js App** support.
- Node.js 20.x recommended.
- MySQL database and database user in cPanel.
- HTTPS enabled for the production domain.

## 2. Create the MySQL database

In cPanel:

1. Open **MySQL Databases**.
2. Create a database.
3. Create a database user with a strong password.
4. Assign that user to the database with the required privileges.

The application automatically creates the required tables on startup. You can also import `database/schema.sql` manually through phpMyAdmin.

## 3. Configure environment variables

Copy `.env.example` to `.env` on the server and replace all placeholder values.

Required values:

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpanel_database_name
DB_USER=cpanel_database_user
DB_PASSWORD=your-database-password
SESSION_SECRET=use-a-long-random-secret-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-strong-admin-password
UPLOAD_DIR=uploads
```

Important:

- Do **not** commit `.env`.
- The old frontend password `123qwe` is no longer used.
- `ADMIN_PASSWORD` is only used to bootstrap the admin account when that username does not already exist in MySQL. After the first successful startup and login, remove `ADMIN_PASSWORD` from the production environment if desired.
- Keep `SESSION_SECRET` stable. Changing it logs out existing Admin sessions.

## 4. Install and build

From the application root:

```bash
npm install
npm run lint
npm run build
```

Production starts with:

```bash
npm start
```

The startup file is:

```text
server.js
```

The server uses `process.env.PORT`, which is compatible with cPanel/Passenger-style Node hosting.

## 5. Configure Setup Node.js App

In TENTEN cPanel open **Setup Node.js App** and create/edit the application:

- Node.js version: 20.x if available
- Application mode: Production
- Application root: repository/application folder
- Application URL: your production domain or subdomain
- Application startup file: `server.js`

Install dependencies from the Node.js App interface or Terminal, then restart the application.

## 6. Verify the backend

Open:

```text
https://your-domain.com/api/health
```

Expected response:

```json
{
  "ok": true,
  "database": true
}
```

If `database` is false, re-check the MySQL hostname, database name, database user, password, and user privileges.

## 7. First Admin login and local-data migration

The frontend keeps the existing browser data only as a migration/fallback source.

On the browser that contains the latest Admin edits:

1. Deploy this server-backed version.
2. Open the production website in that same browser.
3. Log in to Admin using `ADMIN_USERNAME` and `ADMIN_PASSWORD` configured on the server.
4. During successful login, any CMS content key that does not yet exist on the server is copied from the current in-browser data/default data to MySQL.
5. Refresh the page.
6. Open an Incognito window or another device and confirm that the new content is visible there too.

Migration does not overwrite content keys that already exist in MySQL.

Do not clear browser storage before verifying that the server copy is complete.

## 8. Uploaded images

New Admin image uploads are sent to:

```text
POST /api/media/upload
```

Files are stored under the runtime `uploads/` directory and served from:

```text
/uploads/<generated-file-name>
```

Allowed upload types:

- JPG/JPEG
- PNG
- WebP

Maximum upload size: 10 MB.

The `uploads/` directory is intentionally ignored by Git. Back it up separately when moving hosting accounts or servers.

## 9. API overview

Public read endpoints:

```text
GET  /api/health
GET  /api/content
GET  /api/content/:key
POST /api/consultations
```

Admin session endpoints:

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Authenticated Admin write endpoints:

```text
PUT    /api/content/:key
POST   /api/content/batch
POST   /api/media/upload
GET    /api/consultations
PATCH  /api/consultations/:id
DELETE /api/consultations/:id
```

## 10. Production verification checklist

After deployment verify all of the following:

- Admin login succeeds with the MySQL-backed account.
- The old hard-coded `admin / 123qwe` login no longer works unless you intentionally configured that password server-side.
- Edit About content, refresh, and confirm the change remains.
- Edit a project, refresh, and confirm the change remains.
- Edit an article, refresh, and confirm the change remains.
- Edit Branding/EPC/Leadership/Advisory and confirm persistence.
- Open another browser/device and confirm it sees the same content.
- Upload a JPG/PNG/WebP and confirm the URL begins with `/uploads/` rather than `data:image/...`.
- Submit the consultation form and confirm Admin can see the request after authentication.
- Restart the Node.js application and verify content remains because it is stored in MySQL.

## 11. Troubleshooting

### Admin can view the site but saving returns 401

The Admin session is missing or expired. Log out and log in again. Confirm cookies are not being blocked and production uses HTTPS.

### `/api/health` returns 503

Database connectivity failed. Check the DB environment variables and cPanel MySQL user privileges.

### Website HTML loads but `/api/*` returns 404

The domain is probably still serving only a static `dist` folder instead of the Node.js application. Configure the cPanel Node.js App so `server.js` is the application entrypoint.

### Images upload but disappear after hosting migration

The physical files live in the runtime `uploads/` folder. Back up and restore that folder together with the MySQL database.
