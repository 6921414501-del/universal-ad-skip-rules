# Universal Ad Skip — Chrome Extension v2.2.0

**Install:** In Chrome open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select this **extension/** folder (not the repository root). Refresh any already-open pages.

**Update rule source:** Default: [raw GitHub JSON](https://raw.githubusercontent.com/6921414501-del/universal-ad-skip-rules/main/ad-rules.json). The extension fetches on install/browser startup and every ~30 minutes while Chrome is running. The popup's **Update rules** button forces a check. Updates are cached locally and previously fetched rules are retained if a refresh fails.

**Popup:** Toggles for Enabled, Auto Skip, Auto Close and Hide Banners. **Settings:** Feed URL and optional local rules JSON array.

**How it works:** `background.js` fetches and validates the JSON rules. `content.js` matches domains and executes only two fixed operations: `hide` (CSS `display:none!important`) and `click` (click matching visible elements after optional text check). It does not evaluate or download JavaScript.

**Permissions:** This prototype uses `<all_urls>` to run on arbitrary sites and fetch user-configured HTTPS feeds. That is broad access; review before using on sensitive websites. For a public Chrome Web Store release, consider optional host permissions / narrower scope.

**Limitations:** Not tested across arbitrary websites. Server-side waits and ad verification are not bypassed. Refresh tabs after first install or rule changes if necessary. Some embedded players/cross-origin frames are not covered because `all_frames` is false.

**Development:** `node scripts/validate.mjs` from repository root checks JSON, manifest and syntax. Submit PRs with a tested CSS selector, domain and minimal rule changes. GitHub Actions runs validation for pushes and PRs.
