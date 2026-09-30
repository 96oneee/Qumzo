# QUMZO — Weird by design.

Static website for the QUMZO Solana community meme project.

## Files
- `index.html` — the page layout
- `style.css` — the design (dark cosmic theme)
- `config.js` — **all text, links, roadmap, FAQ and tokenomics. Edit this to change the site.**
- `script.js` — puts config.js into the page (no need to edit)
- `editor.html` — visual editor for the main fields → exports a new config.js
- `assets/` — QUMZO character (8 moods, SVG), wordmark logo, favicon
- `brand/` — X profile picture, X banners, transparent sticker PNGs

## Launch day checklist
1. In `config.js`, paste the real contract address into `contract`.
2. Replace `buy` with the exact pump.fun page of the coin.
3. Update `Total supply` / `Creator fee` in `tokenomics` with the real values.
4. In `roadmap`, flip `["Fair launch on pump.fun", false]` to `true`.
5. When a DexScreener page exists, paste it in `links.chart` (the CHART button appears automatically).

Never publish placeholder numbers as live facts.

## Deployment
Static site — Vercel redeploys automatically when files change on GitHub.
