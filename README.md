# Universal Ad Skip — Chrome Extension + Remote Rules

Open-source Manifest V3 extension with a **data-only JSON rule feed** hosted for free in this GitHub repository.

## Install Chrome Extension

1. Download this repository via **Code → Download ZIP**, then extract it.
2. In Chrome open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the **extension/** directory (it contains `manifest.json`).
4. Open a website and refresh its page. Use the extension popup to toggle features or click **Update rules**.

> Chrome cannot load an unpacked extension from a GitHub URL. You must download or clone it first. The extension *rules* can update without reinstalling the extension.

## Automatic rules updates

- Current feed: [ad-rules.json](./ad-rules.json)
- Direct HTTPS URL: `https://raw.githubusercontent.com/6921414501-del/universal-ad-skip-rules/main/ad-rules.json`
- Automatic check: on installation, Chrome startup and approximately every 30 minutes while the browser is running.
- Manual check: click **Update rules** in the extension popup or **Update now** in Settings.
- Updates are validated, cached, and the previous successful feed is retained on fetch failure.

**GitHub Pages is optional**: the default feed uses GitHub Raw, so no separate hosting setup is required. If desired, enable **Settings → Pages → Deploy from a branch → main → /(root)**, then use:
`https://6921414501-del.github.io/universal-ad-skip-rules/ad-rules.json`

## Repository

```text
universal-ad-skip-rules/
├── ad-rules.json               # remote multi-site rules
├── extension/
│   ├── manifest.json           # Manifest V3
│   ├── background.js           # fetch, validate, cache and update
│   ├── content.js              # execute data-only page actions
│   ├── popup.html / popup.js   # enable/disable + update
│   ├── options.html / options.js # feed URL + local custom rules
│   └── README.md
├── scripts/validate.mjs        # validation / JavaScript syntax
├── .github/workflows/validate.yml
└── LICENSE
```

## Add a site

Edit `ad-rules.json` and add a rule:

```json
{
  "id": "example",
  "domains": ["example.com", "*.example.com"],
  "enabled": true,
  "actions": [
    {"type": "hide", "selector": ".ad-banner"},
    {"type": "click", "selector": "button.skip-ad", "text": "Skip", "exact": false}
  ]
}
```

The top-level document must have `schemaVersion: 1`, `version`, and a `rules` array. Supported operations are **hide** and **click** only. The extension does not run downloaded JavaScript.

Ask ChatGPT: **“Add a rule for example.com in this repository, validate JSON, and open a pull request.”**

## Development & validation

With Node 22+, run `node scripts/validate.mjs` from the repository root. GitHub Actions performs the same validation on pushes and PRs. Source is under the MIT license.

## Privacy and known limitations

- Rules only work with the correct domain and page selectors; not all sites are supported.
- The prototype requests broad `<all_urls>` host access; review permissions before using on private/sensitive pages. Narrower or optional permissions are recommended for a Chrome Web Store release.
- It does not defeat server-side ad verification or countdowns. Embedded cross-origin frames are not processed by default.
- No analytics or upload of browsing history is included. A feed-fetch network request is made to the configured HTTPS host.
