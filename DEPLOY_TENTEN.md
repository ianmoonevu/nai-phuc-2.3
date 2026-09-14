# Deploy HOKI Metal CMS: GitHub -> TENTEN -> hokimetal.vn

This repository is the single source of truth for `hokimetal.vn`.

Production flow:

```text
GitHub main
   -> GitHub Actions build/type-check
   -> TENTEN Hosting
   -> Node.js server.js
   -> MySQL
   -> https://hokimetal.vn
```

## 1. TENTEN project setup

TENTEN Vibe Code Hosting / Tenten 1-Click Launch Website supports deploying from a GitHub repository.

Repository:

```text
https://github.com/ianmoonevu/nai-phuc-2.3
```

Production branch:

```text
main
```

Initial TENTEN setup:

1. Open **Tenten 1-Click Launch Website** / Vibe Code Hosting, or classic **Setup Node.js App** if that is the hosting product in use.
2. Create/link the project to the GitHub repository above.
3. Assign `hokimetal.vn` to the Node.js application.
4. Use Node.js 20.x when available.
5. Startup file: `server.js`.
6. Configure the production environment variables below.
7. Confirm the app can be restarted from the TENTEN panel/SSH.

TENTEN's Git-based project UI also has **Sync / Đồng bộ**, which pulls the latest revision from GitHub. That remains a manual fallback if automatic SSH deployment is temporarily unavailable.

## 2. Automatic deployment from GitHub to TENTEN

The repository contains:

```text
.github/workflows/deploy-tenten.yml
```

Every push/merge to `main` now does the following:

1. Checks out the code.
2. Uses Node.js 20.
3. Runs `npm install`.
4. Runs `npm run lint`.
5. Runs `npm run build`.
6. Packages only the production runtime (`dist`, `server.js`, `package.json`, `database`).
7. Uploads the package to TENTEN over SSH.
8. Installs production Node dependencies on TENTEN.
9. Restarts the Node application.
10. Verifies `https://hokimetal.vn/api/health`.

This avoids building Vite on the hosting server and does not overwrite `.env` or `uploads/`.

### Required GitHub Actions secrets

Open the GitHub repository -> **Settings -> Secrets and variables -> Actions -> New repository secret** and configure:

```text
TENTEN_SSH_HOST
TENTEN_SSH_USER
TENTEN_SSH_PRIVATE_KEY
TENTEN_SSH_KNOWN_HOSTS
TENTEN_APP_PATH
```

Optional:

```text
TENTEN_SSH_PORT
TENTEN_RESTART_COMMAND
```

Meanings:

- `TENTEN_SSH_HOST`: SSH hostname/IP supplied by TENTEN.
- `TENTEN_SSH_USER`: hosting SSH/cPanel user.
- `TENTEN_SSH_PRIVATE_KEY`: private key corresponding to a public key authorized on the TENTEN account.
- `TENTEN_SSH_KNOWN_HOSTS`: trusted `known_hosts` entry for the TENTEN SSH host. Obtain it from a trusted machine/control-panel source; do not disable host-key checking.
- `TENTEN_APP_PATH`: absolute application root on the hosting account, the folder containing production `.env`, `server.js`, `dist`, and `uploads`.
- `TENTEN_SSH_PORT`: omit for port 22 or set the TENTEN SSH port.
- `TENTEN_RESTART_COMMAND`: exact hosting restart command if the default Passenger-style `tmp/restart.txt` marker is not appropriate.

Until the five required secrets exist, the GitHub workflow still performs lint/build but intentionally skips the deployment steps instead of failing production.

## 3. MySQL database

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

## 4. Production environment variables

Configure these values in the TENTEN Node.js/Vibe Code project environment or the production `.env` file in `TENTEN_APP_PATH`. Do not commit the real values to GitHub.

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

## 5. Manual build/runtime commands

For manual maintenance or troubleshooting:

```bash
npm install
npm run lint
npm run build
npm start
```

Startup file:

```text
server.js
```

If using classic cPanel **Setup Node.js App** instead of Vibe Code Hosting:

- Node.js version: 20.x
- Application mode: Production
- Application root: repository/application folder
- Application URL: `hokimetal.vn`
- Application startup file: `server.js`

## 6. Health check

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

## 7. First Admin login and migration of old browser data

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

## 8. Uploaded images

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

## 9. Production verification after every deployment

Verify:

- GitHub Actions lint/build succeeds.
- If TENTEN SSH secrets are configured, the Deploy to TENTEN job uploads and activates the release.
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

## 10. Production rule

From now on, production changes should follow only this path:

```text
edit code
-> push/merge to GitHub main
-> GitHub Actions lint/build
-> automatic SSH deploy to TENTEN (when secrets are configured)
-> restart Node.js app
-> check /api/health
-> verify hokimetal.vn
```

Manual TENTEN **Sync / Đồng bộ** remains the fallback path.
