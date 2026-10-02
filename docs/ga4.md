# Google Analytics 4

Admin → Google Analytics: enter the web stream Measurement ID (`G-…`), enable measurement and save. The page reloads only after a server readback confirms the saved values. Failed saves keep the form open. Existing branding is fetched before updating it. Configuration is part of the full System Backup (`branding.ga4MeasurementId`, `branding.ga4Enabled`). No database schema or authentication changes are needed.

Before enabling, in GA4 Admin → Data streams → Web stream → Enhanced measurement → Page views → Advanced settings, disable **Page changes based on browser history events**. This application sends manual page_view events with `send_page_view: false`. Do not install the same GA4 property again through GTM. Other enhanced measurement events are controlled separately in GA4.

No Google script is loaded without an enabled valid ID. Authenticated Admin sessions are excluded. Public navigation is measured after a short debounce, duplicate locations are ignored, and arbitrary query parameters/hashes are stripped (only content `product`/`id` values are retained). Form contents are not sent by this implementation. This release implements page views, not custom contact/conversion events.

Verify in a separate logged-out window using GA4 Realtime/DebugView and Tag Assistant: initial page, Products, a Project detail, Back. Each navigation should produce one page_view. Ad blockers can prevent measurement. No real Measurement ID was available during development; real collection must be checked after configuration.

When moving to hokimetal.com, the tracker uses the actual browser origin. Keep the same Measurement ID if you want reporting continuity and update the web stream Website URL. DNS, redirects, Search Console and canonical SEO configuration are separate.

Reference: https://developers.google.com/analytics/devguides/collection/ga4/views
