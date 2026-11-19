# Universal Ad Skip — Remote Rules

This public repository hosts **data-only JSON rules** for the Universal Ad Skip Chrome extension (Manifest V3).

## Feed

- `ad-rules.json` — versioned rule data, schema version 1
- [Raw GitHub JSON](https://raw.githubusercontent.com/6921414501-del/universal-ad-skip-rules/main/ad-rules.json)
- GitHub Pages URL (only after enabling Pages): `https://6921414501-del.github.io/universal-ad-skip-rules/ad-rules.json`

## Setup

1. Open **Settings → Pages** on this repository.
2. Choose **Deploy from a branch**, `main`, `/(root)`, and save.
3. When Pages is published, paste the Pages URL above into **Extension → Options → Remote rules URL**, then run an update.
4. The extension periodically fetches the JSON; refresh open sites to apply it.

## Updating rules with ChatGPT

Ask ChatGPT to modify `ad-rules.json` in this repository and validate the JSON before committing. Use a pull request for changes you'd like to review.

## Rules format

```json
{
  "schemaVersion": 1,
  "version": "2026.11.19",
  "rules": [
    {
      "id": "example",
      "domains": ["example.com", "*.example.com"],
      "enabled": true,
      "actions": [
        {"type": "hide", "selector": ".ad-banner"},
        {"type": "click", "selector": "button.skip-ad"}
      ]
    }
  ]
}
```

Only add domains and CSS selectors you've verified. Treat remote JSON as configuration, **not executable JavaScript**. Do not add arbitrary remote script evaluation. Behavior depends on page structure and extension host permissions. Server-side countdowns and ad verification are not bypassed.

## Privacy

This repo contains no browsing history, credentials, or user data.
