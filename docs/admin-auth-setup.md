# Enable server-verified admin login

Do not deploy this branch until the Auth user is provisioned. The current ID and password can be retained. No password, password hash, service-role key or admin UUID is embedded in the website.

## One-time Supabase setup

1. Open the existing project `gfawpkgundnsrqnzrltl` → Authentication → Users → Add user → Create new user.
2. Use the existing lowercase ID followed by `@admin.hokimetal.vn` as the email identifier. Enter the existing password privately in Supabase and enable Auto Confirm. This alias is used only for login; do not send invitation/reset mail to it. Do not add these values to GitHub or Vite environment variables.
3. Copy the new user's UUID. Replace `REPLACE_WITH_AUTH_USER_UUID` in `supabase/admin-access.sql` with it. Keep an export of existing policies before executing the script. It changes access policies only, inside one transaction; it does not rewrite content.
4. Coordinate the SQL and frontend deployment: the SQL closes anonymous editing immediately. Deploy this branch, rebuild on Tenten and test login, a small saved edit, image upload, backup, logout, and a public consultation submission. Keep the dashboard available to fix setup errors. Do not restore the old open-write policies as a login workaround.

The frontend checks the Auth user and `is_site_admin()`. Database/storage policies enforce actual access even if someone changes browser state. Ordinary signed-up users are not admins. Public content remains readable; consultation records are readable only by admins, while visitors can insert new requests. Admin assignment is a private UUID allowlist editable only from the database owner/dashboard.

## Deployment cleanup

Publish only the newly built `dist` output. Remove obsolete built JavaScript files from the public hosting output and purge any CDN cache so old credential-bearing assets are no longer served. Keep a content backup separately, outside the public web directory. Check the deployed asset list before removing files; do not remove customer uploads.

Existing Git history and previously downloaded files may still contain the old password. Removing it from the current source cannot make those historical copies secret again. No password change is performed by this migration; the owner controls that separately.

## Limits / verification

Local tests cover Auth responses and the SQL policies in an isolated PostgreSQL-compatible database. They do not establish that the live Supabase setup has been completed. Until steps 1–4 are verified on production, this is a prepared migration, not a completed security change.
