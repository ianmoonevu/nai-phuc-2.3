# Admin content and backup v4

## Deploy on the existing Tenten installation

Sync the GitHub repository, run the existing `build` script, and reload the page. No Node startup-file changes or database reset are needed. This release does not seed or overwrite cloud content on startup.

## Products

Admin → Products edits the catalogue, images, technical fields, application lists and key metrics. Home and Products use this same catalogue. Home product links select the matching product. Saves wait for Supabase and read the saved document back before reporting success. Failed saves keep the editor open.

The catalogue is a separate JSON document in the existing `site_branding` table with ID `product-catalogue`; branding remains at ID `default`. Branding subscriptions filter that ID. Existing Supabase policies must permit the document read/write; denied writes are reported, never replaced with a local-only success. The default catalogue is read-only fallback until the cloud read succeeds. Other browsers refresh on load, focus and every 30 seconds.

## Full backup

Version 4 exports the current admin state: projects, articles, products, media, consultation requests, branding (including phone, social links, logos, favicon and video), About Us, leadership, advisory members, EPC partners and configuration. It excludes credentials, authentication sessions and connection keys. Save pending form edits before exporting.

Embedded images remain embedded; external and site-relative image URLs remain references. This is a content JSON backup, not an archive of the Storage bucket or hosting filesystem. Keep those image files separately. Consultation data can contain personal information; keep backups private.

Restore validates the file, downloads a before-restore recovery copy, then merges by ID. Matching items use the imported values; existing items and sections absent from an older backup are retained. Version 3 project/knowledge files remain supported. Restore does not delete items. Existing leadership/advisory local-storage behavior is retained; these lists are included in backup and restored in the current browser. Sections already stored in Supabase, including Products, are saved there on restore. A multi-section restore is not a database transaction: if a write fails, the UI reports failure and earlier sections may already be saved; keep the recovery copy and retry after fixing connectivity/permissions.

## Validation

`node --test --test-isolation=none tests/contentBackup.test.mjs tests/documentStore.test.mjs tests/mergeProjects.test.mjs`

Also run TypeScript and the production build. Browser checks cover product editing, a separate browser context reading the edit, Home/Products consistency, denied writes, full JSON export, legacy merge and full restore. Use mocked Supabase requests for mutation tests; never use customer content as test fixtures.
