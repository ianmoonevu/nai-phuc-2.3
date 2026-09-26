# Admin content and backup v4

## Deploy on the existing Tenten installation

Sync the GitHub repository, run the existing `build` script, and reload the page. No Node startup-file changes or database reset are needed. This release does not seed or overwrite cloud content on startup.

## Products

Admin → Products edits the catalogue, images, technical fields, application lists and key metrics. Home and Products use this same catalogue. Home product links select the matching product. Saves wait for Supabase and read the saved document back before reporting success. Failed saves keep the editor open.

The catalogue is a separate JSON document in the existing `site_branding` table with ID `product-catalogue`; branding remains at ID `default`. Branding subscriptions filter that ID. Existing Supabase policies must permit the document read/write; denied writes are reported, never replaced with a local-only success. The default catalogue is read-only fallback until the cloud read succeeds. Other browsers refresh on load, focus and every 30 seconds.

## Full backup

Version 4 exports the current admin state: projects, articles, products, media, consultation requests, branding (including phone, social links, logos, favicon and video), About Us, leadership, advisory members, EPC partners and configuration. It excludes credentials, authentication sessions and connection keys. Save pending form edits before exporting.

Embedded images remain embedded; external and site-relative image URLs remain references. This is a content JSON backup, not an archive of the Storage bucket or hosting filesystem. Keep those image files separately. Consultation data can contain personal information; keep backups private.

Restore validates the file, downloads a before-restore recovery copy, then merges by ID. Matching items use the imported values; existing items and sections absent from an older backup are retained. Version 3 project/knowledge files remain supported. Restore does not delete items. About Us, leadership and advisory members are restored together to the shared cloud document, so the restored content is visible in other browsers. A multi-section restore is not a database transaction: if a write fails, the UI reports failure and earlier sections may already be saved; keep the recovery copy and retry after fixing connectivity/permissions.

## About Us

Admin → About Us Page (also accessible from Branding → About Us Pictures) now edits the complete page: story, mission, banner images, leaders and portraits, Foundation, manufacturing, quality process, partner regions, advisors and corporate timeline. Click **Lưu toàn bộ About Us** to publish all sections together. Uploading/selecting a portrait only changes the draft until this save succeeds.

The existing `about_page_info` row `default` stores the page fields plus `leadershipHeads` and `advisoryMembers` in its `data` JSON column. No additional table or hosting setting is required. A save reads back the document to verify it. The `updated_at` revision prevents a stale editor from overwriting a newer save. Connection errors keep the draft available; a separate draft-backup button can export pending edits. Ordinary System Backup exports saved content.

For the first save after upgrading, open the same browser/profile that holds the previous personnel edits. If the cloud document has no personnel lists yet, those local edits are retained for review and publication. After publication, the cloud arrays are authoritative, including intentional empty lists. Older editor aliases are migrated when read, without deleting unknown fields. There are no automatic startup writes or resets. Other browsers refresh on load, focus and every 30 seconds.

The deployment cannot recover browser-only edits from a different device automatically. Use an existing JSON backup or the original browser. Existing hero/factory images and legacy branding portrait overrides are carried forward; image editing is consolidated into the About editor.

## Validation

`node --test --test-isolation=none tests/aboutContent.test.mjs tests/contentBackup.test.mjs tests/documentStore.test.mjs tests/mergeProjects.test.mjs`

Also run TypeScript and the production build. Browser checks cover product editing, a separate browser context reading the edit, Home/Products consistency, denied writes, full JSON export, legacy merge and full restore. Use mocked Supabase requests for mutation tests; never use customer content as test fixtures.
