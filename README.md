# Weather & Clock Dashboard — Firefox New Tab Extension

> Replace your Firefox new tab with a live weather dashboard, world clocks, and search.

[![Mozilla Add-ons](https://img.shields.io/badge/Firefox-Install%20Free-orange?logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/weather-clock-dashboard/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[Install on Firefox →](https://addons.mozilla.org/en-US/firefox/addon/weather-clock-dashboard/)**

---

## What It Does

Weather & Clock Dashboard replaces the default Firefox new tab page with a clean, information-rich dashboard:

- **Live Weather** — Current conditions and 3-day forecast via [wttr.in](https://wttr.in). Set any city worldwide. No API key needed.
- **World Clocks** — Track time across multiple time zones simultaneously. Add, remove, and reorder your clock list.
- **Search Bar** — Prominent search bar that uses your default Firefox search engine.
- **Dark & Light Mode** — One-click theme toggle. Your preference is remembered.
- **Fast & Lightweight** — Pure HTML/CSS/JS, zero frameworks. Loads instantly on every new tab.
- **Privacy-Friendly** — No personal data collected. No tracking cookies. Only anonymous, local usage analytics.

---

## Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| *(screenshot)* | *(screenshot)* |

---

## Install

### From Firefox Add-ons (Recommended)

1. Visit the [Firefox Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/weather-clock-dashboard/)
2. Click **Add to Firefox**
3. Open a new tab — your dashboard is live

### Development Install

1. Clone this repository
2. Open Firefox → `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select `manifest.json` from the `weather-clock-dashboard/` folder
5. Open a new tab

---

## Usage

| Feature | How to Use |
|---------|-----------|
| Set weather city | Click the pin icon on the weather widget |
| Add a world clock | Use the time zone dropdown |
| Remove a world clock | Click the X on any clock |
| Toggle dark/light mode | Click the sun/moon icon (top right) |

All preferences are saved locally via `browser.storage.local` and persist across sessions.

---

## Project Structure

```
weather-clock-dashboard/
├── manifest.json      # WebExtension manifest (v2)
├── dashboard.html     # New tab page HTML
├── dashboard.js       # All logic: clock, weather, search, world clocks, theme
├── styles.css         # Dark/light themed styles
├── analytics.js       # Privacy-friendly anonymous analytics
├── icons/
│   ├── icon-48.svg
│   └── icon-96.svg
├── AMO_LISTING.md     # Store listing copy and screenshot guide
├── PRIVACY_POLICY.md  # Privacy policy
└── README.md
```

No build step required. Vanilla JavaScript and CSS — loads instantly.

---

## Privacy

- **No personal data collected.** Your city name and time zone preferences stay on your device.
- **No tracking cookies.**
- **Anonymous analytics only** — tracks aggregate events like `tab_open`, `theme_toggle`, `weather_load` (never query text or personal info).
- **Only external request:** weather data from [wttr.in](https://wttr.in) — a free, open weather API.

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for the full policy.

---

## Technical Notes

- **Manifest V2** for Firefox compatibility
- **No remote code loading** — all assets bundled locally (Mozilla policy compliant)
- **Permissions:** `storage` (save preferences), access to `wttr.in` (weather data)

---

## Contributing

Feedback and pull requests welcome. Open an issue to suggest features or report bugs.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

**[Install Weather & Clock Dashboard on Firefox →](https://addons.mozilla.org/en-US/firefox/addon/weather-clock-dashboard/)**
