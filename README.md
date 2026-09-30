# QUMZO — Weird by design.

Static website for the QUMZO Solana community meme project.

## Files
- `index.html` — the page layout
- `style.css` — the design (dark cosmic theme)
- `config.js` — **all text, links, roadmap, FAQ and tokenomics. Edit this to change the site.**
- `script.js` — puts config.js into the page (no need to edit)
- `game.html` — QUMZO mini-game (dodge junk, collect stars; linked from the game card)
- `api/scores.js` — global leaderboard server (the only file outside the root: Vercel requires server code in `api/`)
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

## Global leaderboard setup (one time)
The game works without this — it then keeps scores on each player's device only.
1. Vercel dashboard → your project → **Storage** (or **Marketplace**) → add **Upstash Redis** (free plan) and connect it to this project.
   Vercel adds the `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_*`) variables automatically.
2. Optional: Settings → Environment Variables → add `LEADERBOARD_SECRET` = any long random text.
3. Redeploy. The scoreboard then says “worldwide”.

Anti-cheat is basic (signed single-use run tokens, time-based score limits, name checks, rate limits). It stops casual cheating, not a determined hacker. Usernames are not accounts — anyone can play under any name.

## Deployment
Static site — Vercel redeploys automatically when files change on GitHub.
