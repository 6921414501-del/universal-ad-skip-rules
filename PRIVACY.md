# Universal Ad Skip — Privacy Policy

Last updated: November 19, 2026

Universal Ad Skip is an open-source Chrome extension that automates supported ad-skipping controls, closes selected ad overlays, hides selected banners, and temporarily mutes HTML5 media while supported skip controls are detected.

## What the extension accesses

The extension can access web pages where it is permitted to run. It examines elements on the current page, including button text and attributes, to match website-specific rules. This processing happens locally in your browser.

## Data stored locally

The extension uses Chrome's local extension storage to save your preferences, the downloaded JSON rules, optional rules you create, the configured rules-feed URL, and the latest update time or error. It does not require an account.

## Network requests

The extension periodically requests its configured HTTPS JSON rules feed (by default, a public GitHub Raw URL) and may request it on startup or when you manually refresh. If you change the feed URL in Settings, requests go to the server you select. As with any web request, the receiving server may receive ordinary connection information such as your IP address and user agent.

The extension code does not intentionally send browsing history, visited-page contents, personal details, or custom rules to its rule-feed server. It does not contain advertising analytics or a developer-operated tracking endpoint.

## How features work

Rule actions operate on web pages in your browser. Automatic skipping, overlay closing, banner hiding, and muting are subject to the current rules and site behavior. Features may not work on every site.

## Sharing and selling

The extension does not sell user data or transmit it to the developer for advertising. Requests to the rules feed are handled by the selected feed provider under that provider's privacy practices.

## Retention and controls

Saved settings and rules remain in Chrome local extension storage until you change or clear them or remove the extension. You may disable features from the popup and choose a different rules-feed URL in Settings. The extension's local custom rules can be exported from Settings.

## Changes

This policy may be updated when extension behavior changes. Material changes to data handling should be disclosed before publication.

## Contact

For questions or concerns, please open an issue at:
https://github.com/6921414501-del/universal-ad-skip-rules/issues

## Chrome Web Store Limited Use

Use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
