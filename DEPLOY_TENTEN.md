# Deploy HOKI Metal CMS: GitHub -> TENTEN -> hokimetal.vn

This repository is the single source of truth for `hokimetal.vn`.

Production flow:

```text
GitHub main
   -> TENTEN Hosting
   -> Node.js server.js
   -> MySQL
   -> https://hokimetal.vn
```

Vercel is not part of the production architecture.

## 1. Recommended TENTEN deployment method: GitHub repository

TENTEN Vibe Code Hosting / Tenten 1-Click Launch Website supports deploying directly from a GitHub repository.

Repository:

```text
https://github.com/ianmoonevu/nai-phuc-2.3
```

Branch used for production:

```text
main
```

In TENTEN:

1. Open **Tenten 1-Click Launch Website** / Vibe Code Hosting.
2. Create a project.
3. Select deployment from **GitHub**.
4. Paste the repository URL above.
5. Select `hokimetal.vn` as the application domain.
6. Use Node.js 20.x when available.
7. Startup file: `server.js`.
8. Configure the production environment variables listed below.
9. Deploy.

For later code updates:

1. Merge/push the change into GitHub `main`.
2. In the TENTEN project dashboard use **Sync / Đồng bộ** to pull the latest GitHub revision.
3. Restart the Node.js application if TENTEN does not restart it automatically.
4. Verify `https://hokimetal.vn/api/health`.

Do not upload a separate Vercel build and do not point DNS to Vercel.

## 2. MySQL database

Create a MySQL database and database user on TENTEN.

The application creates the required tables when `server.js` starts. The schema is also available at:

```text
database/schema.sql
```

Required database values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_tenten_database
DB_USER=your_tenten_database_user
DB_PASSWORD=your_database_password
```

Make sure the database user has privileges on the selected database.

## 3. Production environment variables

Configure these values in the TENTEN Node.js/Vibe Code project environment. Do not commit the real values to GitHub.

```env
NODE_ENV=production
PORT=3000
APP_URL=https://hokimetal.vn

DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_tenten_database
DB_USER=your_tenten_database_user
DB_PASSWORD=your_database_password
DB_POOL_SIZE=10

SESSION_SECRET=replace-with-a-long-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-admin-password

UPLOAD_DIR=uploads
VITE_WEBHOOK_URL=
GEMINI_API_KEY=
```

Notes:

- The application listens on `process.env.PORT`; TENTEN/cPanel can override the example `3000` value.
- `ADMIN_PASSWORD` is only used to create the initial Admin account if that username does not already exist in MySQL.
- After the Admin account is created and login has been verified, `ADMIN_PASSWORD` can be removed from the production environment.
- Keep `SESSION_SECRET` stable or existing Admin sessions will be invalidated.

## 4. Build and runtime

Install and verify before production deployment:

```bash
npm install
npm run lint
npm run build
```

Production command:

```bash
npm start
```

Startup file:

```text
server.js
```

If using classic cPanel **Setup Node.js App** instead of Vibe Code Hosting:

- Node.js version: 20.x
- Application mode: Production
- Application root: repository folder
- Application URL: `hokimetal.vn`
- Application startup file: `server.js`

## 5. Health check

After each deployment open:

```text
https://hokimetal.vn/api/health
```

Expected response:

```json
{
  "ok": true,
  "database": true
}
```

If the page returns 404, the domain is probably serving only static files and is not routed to the Node.js application.

If it returns HTTP 503 with `database: false`, re-check the MySQL configuration and privileges.

## 6. First Admin login and migration of old browser data

The previous Admin implementation saved content into browser `localStorage`.

To safely migrate old content:

1. Use the browser that contains the newest Admin edits.
2. Deploy the new server-backed version to TENTEN.
3. Open `https://hokimetal.vn` in that same browser.
4. Log into Admin with the new server-side Admin account.
5. Missing CMS keys are copied to MySQL during the first successful Admin login.
6. Refresh the site.
7. Verify the same content in Incognito or on another device.

Existing MySQL content is not overwritten by this first-login migration.

Do not clear browser storage until the server copy has been verified.

## 7. Uploaded images

New Admin uploads use:

```text
POST /api/media/upload
```

Physical files are stored in:

```text
uploads/
```

and are served as:

```text
https://hokimetal.vn/uploads/<generated-file-name>
```

Allowed formats:

- JPG/JPEG
- PNG
- WebP

Maximum upload size: 10 MB.

The `uploads/` directory is runtime data and is ignored by Git. Back it up separately from the Git repository.

## 8. Production verification after every deployment

Verify:

- `https://hokimetal.vn/` loads normally.
- `https://hokimetal.vn/api/health` returns `ok: true` and `database: true`.
- Admin login works using the MySQL-backed account.
- The old frontend hard-coded password is no longer used.
- Edit an About field, save, refresh, and confirm it remains.
- Edit a project and article, then refresh.
- Open another browser/device and confirm the changes are visible.
- Upload an image and confirm its URL starts with `/uploads/`, not `data:image/...`.
- Submit a consultation request and confirm it appears in Admin.
- Restart the Node.js app and confirm all MySQL content remains.

## 9. Production rule

From now on, production changes should follow only this path:

```text
edit code
-> push/merge to GitHub main
-> TENTEN Sync / Đồng bộ
-> restart Node.js app if required
-> check /api/health
-> verify hokimetal.vn
```

Do not deploy production from Vercel or maintain a second production copy elsewhere unless the architecture is intentionally changed later.
