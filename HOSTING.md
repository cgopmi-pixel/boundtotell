# Hosting (moved from ChatGPT Sites on 2026-10-27)

- Live site: https://boundtotell.com, served by GitHub Pages from the `main` branch of this repository (root folder).
- This `source` branch holds the editable source. To publish a change:
  1. Edit content/*.json, src/render.cjs or public/*
  2. `node scripts/build.cjs` and `node tests/interactions.cjs`
  3. Copy `dist/` contents to the `main` branch root (keep the `CNAME` and `.nojekyll` files), commit, push.
- DNS (Namecheap): four A records @ -> 185.199.108.153 / 109 / 110 / 111.153, CNAME www -> cgopmi-pixel.github.io.
- Email: Namecheap Private Email (Mail Settings in Namecheap). Do not change MX records.
