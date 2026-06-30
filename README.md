# Pivot-Signal.com

Landing page for Pivot-Signal — algorithmic pivot point trading signals + MT5 Expert Advisor.

**Live:** https://pivot-signal.com

## Stack

- Plain HTML / CSS / JavaScript
- No build step
- Static site, deployed on Netlify
- Bilingual: English (`/en/`) + German (`/de/`)

## Local development

Just open `index.html` in a browser. The root redirects to `/en/`.

For local URL previews:

```bash
# from repo root
python -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
/
├── index.html                  # language switcher / EN default
├── en/
│   ├── index.html              # EN landing
│   ├── expert-advisor.html
│   ├── custom-ea.html
│   ├── all-eas.html
│   ├── about.html
│   ├── impressum.html          # EN legal notice
│   └── privacy.html            # EN privacy policy
├── de/
│   ├── index.html              # DE landing
│   ├── expert-advisor.html
│   ├── custom-ea.html
│   ├── all-eas.html
│   ├── about.html
│   ├── impressum.html          # DE Impressum (§5 TMG)
│   └── datenschutz.html        # DE Datenschutzerklärung (DSGVO)
├── imgs/                       # shared image assets
├── en/imgs/                    # EN-specific images
├── de/imgs/                    # DE-specific images
├── netlify.toml                # Netlify config
├── _redirects                  # URL redirects
├── _headers                    # Cache / security headers
├── robots.txt
└── sitemap.xml
```

## Deployment

The site auto-deploys to Netlify on every push to `main`:

- Push to `main` → Netlify build runs (no build step, just serves files) → live at `pivot-signal.com`

## Editing legal pages

The legal pages (`impressum.html`, `datenschutz.html`, `privacy.html`) currently contain a placeholder email address. Before going live in production, replace:

```
kontakt@pivot-signal.com
```

with the real business contact email in:

- `de/impressum.html`
- `de/datenschutz.html`
- `en/impressum.html`
- `en/privacy.html`

## Adding a new page

1. Create the HTML in both `en/` and `de/`
2. Add a `<url>` entry to `sitemap.xml`
3. (Optional) Add a redirect rule in `_redirects`
4. Link from the footer / relevant sections

## Brand

- **Orange:** `#FF6B1A`
- **Mint-Celadon:** `#88D8C0`
- **Headline gradient:** teal → mint → orange

Do not change brand colors without consulting the owner.

## License

Proprietary — all rights reserved.