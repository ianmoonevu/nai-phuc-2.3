# Deploy HOKI Metal CMS: GitHub -> TENTEN 1-Click -> hokimetal.vn

This repository is the single source of truth for `hokimetal.vn`.

Production flow:

```text
GitHub main
   -> TENTEN 1-Click Launch Website
   -> Sync / Đồng bộ
   -> Node.js application
   -> MySQL
   -> https://hokimetal.vn
```

## 1. Current TENTEN project

The production project is already linked to:

```text
https://github.com/ianmoonevu/nai-phuc-2.3
```

Production branch:

```text
main
```

Current application root shown by TENTEN:

```text
/var/www/vhosts/hokimetal.vn/httpdocs
```

The current TENTEN project is running on Node.js 24.

No GitHub SSH deployment secrets are required for this hosting mode. Do not configure `TENTEN_SSH_HOST`, `TENTEN_SSH_USER`, `TENTEN_SSH_PRIVATE_KEY`, `TENTEN_SSH_KNOWN_HOSTS`, or `TENTEN_APP_PATH` for this project.

## 2. Deploying a code update

For every production code update:

1. Merge or push the change to GitHub `main`.
2. Open **Tenten 1-Click Launch Website**.
3. Locate the `hokimetal.vn` project.
4. Click **Đồng bộ**.
5. Wait for TENTEN to pull the latest GitHub revision and redeploy the Node.js application.
6. If needed, click **Khởi động lại**.
7. Verify `https://hokimetal.vn/api/health`.

Do not maintain a second deployment path for this project.

## 3. MySQL database

Create a MySQL database and database user on TENTEN/Plesk if they do not already exist.

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

## 4. Production environment

The Node.js backend requires a production `.env` file in the application root:

```text
/var/www/vhosts/hokimetal.vn/httpdocs/.env
```

Do not commit the real `.env` to GitHub.

Recommended contents:

```env
NODE_ENV=production
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

- TENTEN/Plesk can supply the runtime `PORT`; do not force a custom port if the 1-Click service manages it automatically.
- `ADMIN_PASSWORD` bootstraps the initial Admin account only when that username does not already exist in MySQL.
- Keep `SESSION_SECRET` stable or existing Admin sessions will be invalidated.

## 5. Runtime entry point

The production server entry point is:

```text
server.js
```

The package command is:

```bash
npm start
```

The repository also contains:

```bash
npm run lint
npm run build
```

for validation and frontend production builds.

## 6. Health check

After every TENTEN Sync / Đồng bộ, open:

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

If the page returns 404, the domain is probably not currently routed through `server.js`.

If it returns HTTP 503 with `database: false`, re-check the MySQL configuration and `.env` values.

## 7. First Admin login and migration of old browser data

The previous Admin implementation saved content into browser `localStorage`.

To safely migrate old content:

1. Use the browser that contains the newest Admin edits.
2. Sync/deploy the new server-backed version through TENTEN.
3. Open `https://hokimetal.vn` in that same browser.
4. Log into Admin with the new server-side Admin account.
5. Missing CMS keys are copied to MySQL during the first successful Admin login.
6. Refresh the site.
7. Verify the same content in Incognito or on another device.

Existing MySQL content is not overwritten by this first-login migration.

Do not clear browser storage until the server copy has been verified.

## 8. Uploaded images

New Admin uploads use:

```text
POST /api/media/upload
```

Physical files are stored under:

```text
/var/www/vhosts/hokimetal.vn/httpdocs/uploads/
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

The `uploads/` directory is runtime data and is ignored by Git. Back it up separately from the repository.

## 9. Production verification checklist

After syncing a new revision verify:

- `https://hokimetal.vn/` loads normally.
- `https://hokimetal.vn/api/health` returns `ok: true` and `database: true`.
- Admin login works using the MySQL-backed account.
- Edit an About field, save, refresh, and confirm it remains.
- Edit a project and article, then refresh.
- Open another browser/device and confirm the same content is visible.
- Upload an image and confirm its URL starts with `/uploads/`, not `data:image/...`.
- Submit a consultation request and confirm it appears in Admin.
- Restart the Node.js app and confirm MySQL content remains.

## 10. Production rule

From now on, use only this path:

```text
edit code
-> push/merge to GitHub main
-> TENTEN 1-Click: Đồng bộ
-> Khởi động lại if required
-> check /api/health
-> verify hokimetal.vn
```
