# Sitemap on Tenten

`npm run build` creates `dist/sitemap.xml` and `dist/robots.txt` after Vite builds the website. The generator reads the existing public Projects and product catalogue without writing data. Projects use the same seed/override/deletion rules as the website. Product URLs use `?product=ID`. Knowledge currently has only a list page with article modals, so only `/knowledge` is included. Admin is excluded and gets a noindex tag in the rendered page.

Sync the repository and run **build** in Tenten as usual. Verify `https://hokimetal.vn/sitemap.xml` displays XML (not the homepage) and `https://hokimetal.vn/robots.txt` contains the Sitemap line. Submit `sitemap.xml` in Google Search Console → Sitemaps. Sitemap is independent of GA4.

This is a build-time snapshot: after adding, deleting or changing the URL of a Project/Product in Admin, rebuild and publish the generated files. Admin saves alone cannot update a static file on Tenten. Reads fail the build rather than silently substituting a stale catalogue. If the website uses a custom database configured only in browser storage, set matching `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` build environment variables; the build cannot read browser storage.

The default domain is `https://hokimetal.vn`. To migrate, set `VITE_SITE_URL=https://hokimetal.com` and rebuild; sitemap, robots and canonical metadata then use `.com`. DNS, HTTPS, redirects and Search Console verification must be configured separately. Do not switch this variable before the new domain is ready.

No made-up lastmod dates, priorities or change frequencies are emitted. The sitemap does not guarantee indexing. Page content still renders with React; server rendering is not added by this change.
