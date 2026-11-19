# Chrome Web Store listing — Universal Ad Skip

> Prepared for version 2.4.1. This file is a copy-and-paste reference for the developer, not evidence of submission or approval. Verify every statement against the uploaded ZIP. The Chrome Web Store developer dashboard cannot be completed by this repository alone.

## Store listing

**Name** (comes from manifest): Universal Ad Skip

**Category**: Productivity

**Language**: English (primary; extension labels include Thai)

**Short description** (manifest description): Auto skip and mute ads with updateable JSON rules.

**Detailed description**:

Universal Ad Skip helps you interact with supported ad controls on websites.

- Automatically click matching Skip Ad buttons on websites with supported rules.
- Close matching ad overlays and hide selected banner elements.
- Temporarily mute HTML5 audio or video when a supported Skip button is visible in the same page frame.
- Check for updated website-specific JSON rules from a configurable HTTPS source around every 30 minutes.
- Configure features from the popup; edit and export local custom rules from Settings.

Rules are data-only, validated before use, and stored locally. The extension does not execute JavaScript downloaded from the rules server. Ad skipping and muting are not guaranteed to work for all websites or all ads.

Source code: https://github.com/6921414501-del/universal-ad-skip-rules

**Support URL:** https://github.com/6921414501-del/universal-ad-skip-rules/issues

**Homepage URL:** https://github.com/6921414501-del/universal-ad-skip-rules

## Store images

- Store icon: 128x128 PNG: generate with `python scripts/generate_store_assets.py`, then upload `store-assets/store-icon-128.png`
- Small promotional image (optional as currently shown in the Dashboard): `store-assets/small-promo-440x280.png`
- Screenshot: at least one real, accurate screenshot of the installed extension (1280x800 RGB PNG). For example, show the actual popup and Settings controls. Do not show invented success messages or UI that is not implemented.
- Do not upload outer GitHub Actions artifact ZIP as the extension; extract that wrapper and upload its inner `universal-ad-skip-extension.zip`.

## Privacy practices

**Single purpose**:
Automate supported website ad controls to skip ads, close ad overlays, hide selected banners and temporarily mute HTML5 media while matching skip controls are detected.

**storage permission**:
Stores locally the user's feature preferences, downloaded website rules, custom rules, feed URL, last update time, and update errors.

**alarms permission**:
Schedules periodic refreshes of the user-configured HTTPS JSON rules feed, approximately every 30 minutes while Chrome is running.

**Host access (<all_urls>)**:
Page access is needed for multi-site support using user-configurable selectors to identify ad controls in web page content and perform permitted skipping, closing, hiding, and temporary HTML5 muting. This is broad access. Review whether the permission can be limited in a future version.

**Remote code**:
No remotely hosted executable JavaScript is fetched or executed. The downloaded rules are JSON data containing domains, CSS selectors, button labels, and limited predefined actions. Do not misrepresent remote rules as JavaScript code.

**Privacy Policy URL**:
https://github.com/6921414501-del/universal-ad-skip-rules/blob/main/PRIVACY.md

**User data declaration**:
The current code does not include telemetry or transfer browsing contents to a developer endpoint; however, the periodic feed request reaches the host selected in Settings, which can receive ordinary connection metadata (e.g., IP address). Decide each checkbox based on the actual production behavior and store policy; do not blindly claim no data is collected without reviewing the release.

## Distribution and review

- Choose **Public** only after testing and reading the Store developer policies.
- Fill required developer contact details and verify 2-Step Verification.
- Save draft and check for warnings.
- Review and submit the listing from your Chrome Web Store Developer Dashboard account. The dashboard is protected and is not programmatically editable using the repository tools.

## Updating

- JSON rules are fetched by the installed extension automatically; changes in the GitHub rules feed do not require Store review as long as they remain data-only and policy-compliant.
- JS, manifest, and binary asset changes require a new incremented extension version, a new Store ZIP upload, and Store review/publishing.
- GitHub Actions creates an extension ZIP artifact plus an images artifact after a successful push.
