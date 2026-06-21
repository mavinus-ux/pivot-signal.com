# Pivot-Signal Landing Page

Professional trading software, signals & Expert Advisors landing page.

🌐 **Live:** https://pivotsignal.com

## Stack

- Pure HTML/CSS/JavaScript (no build process)
- Hosted on Netlify with continuous deployment from GitHub
- Custom domain: pivotsignal.com
- SSL via Let's Encrypt (auto-provisioned by Netlify)

## Structure

```
pivot-signal-landing/
├── index.html              ← Root (redirects to /en/)
├── en/                     ← English pages
│   ├── index.html          ← Main landing page
│   ├── all-eas.html        ← All Expert Advisors comparison
│   ├── custom-ea.html      ← Custom EA development
│   ├── expert-advisor.html ← What is an EA + installation
│   └── about.html          ← About page
├── de/                     ← German pages (same structure)
├── imgs/                   ← All images (logos, badges, OG image)
├── netlify.toml            ← Netlify configuration
├── _redirects              ← URL redirects
├── _headers                ← Security headers
├── robots.txt              ← SEO
└── sitemap.xml             ← SEO
```

## Deployment

Auto-deploy on push to `main` branch:

1. Push to GitHub: `git push origin main`
2. Netlify auto-builds + deploys
3. Live in ~30 seconds at pivotsignal.com

## Local Development

```bash
# Just open the files directly
open en/index.html

# Or run a local server
python3 -m http.server 8000
# Visit http://localhost:8000/en/
```

## Languages

- `/en/` — English (default)
- `/de/` — German

The root `/` redirects to `/en/`.

## Adding Languages

1. Create `/[lang]/` directory with same structure as `/en/`
2. Update `netlify.toml` redirects if needed
3. Update `sitemap.xml` to include new language URLs

## License

© 2026 Pivot-Signal. All rights reserved.