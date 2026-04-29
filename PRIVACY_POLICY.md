# Privacy Policy — Weather & Clock Dashboard

**Last updated:** 2026-04-18

## What data does this extension collect?

Weather & Clock Dashboard collects anonymous usage analytics to help us improve the extension. These analytics include:

- **Extension events**: new tab opens, searches performed (query length only — never the query itself), weather widget usage, theme preference changes, and timezone configuration changes (only whether a timezone was added or removed — not the timezone value itself).
- **Installation identifier**: a randomly generated, non-personal ID stored locally to distinguish unique installs. This ID cannot be linked back to your identity.
- **Session identifier**: a temporary, randomly generated ID that exists only for the duration of a browser tab session. It is never written to disk, is not linked to your identity, and is discarded when the tab closes.
- **Extension version**: the version number of the extension you are using.

## What data is NOT collected?

- No personally identifiable information (name, email, IP address)
- No search query content is collected in our analytics — only the length of search terms. Note: search queries are transmitted to SearchFan (third-party) as described above.
- No browsing history or page content
- No weather location names are sent to our analytics — only whether a location was set
- No cookies or cross-site tracking

## How is data stored?

Analytics events are stored locally in your browser using the WebExtensions `storage.local` API. Events are periodically sent to our analytics endpoint over HTTPS. If no analytics endpoint is configured, events remain local only.

## Third-party services

- **wttr.in**: Weather data is fetched from [wttr.in](https://wttr.in), a free weather service. Your configured city name is sent to wttr.in to retrieve weather data. Please refer to [wttr.in's privacy practices](https://github.com/chubin/wttr.in) for details.
- **SearchFan (Yahoo search feed)**: Search queries entered in the extension's search bar are routed through [SearchFan](https://searchfan.net) (a Yahoo-powered search feed) via `https://searchfan.net/s?pub=14&feed=35&q={term}`. The search query itself is transmitted to SearchFan as part of the URL. SearchFan's privacy practices apply to these queries.

## Data retention

Local analytics data is capped at 500 events. When transmitted to our servers, data is retained for up to 12 months for aggregate analysis, then deleted.

## Changes to this policy

We may update this privacy policy from time to time. Changes will be reflected in the "Last updated" date above.

## Contact

For privacy questions, contact: privacy@paperclip.ing
