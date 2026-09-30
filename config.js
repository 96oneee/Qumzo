/*
  QUMZO PROJECT CONFIG
  ====================
  All the website text, links and roadmap live here.
  Edit the values between the quotes, save, upload to GitHub -> Vercel updates the site.
  (Or open /editor.html on your site to edit the main fields visually.)
*/

const PROJECT = {
  name: "QUMZO",
  ticker: "$QUMZO",
  badge: "A COSMIC CREATURE ON SOLANA",

  heroTitle: "Weird by<br><span>design.</span>",
  heroText: "QUMZO fell out of the sky somewhere between the stars and the internet. Galaxy eyes, a cracked shell older than time, and an antenna that only picks up memes.",

  // Paste the real contract address here after launch
  contract: "TBA — LAUNCH PENDING",

  links: {
    buy: "https://pump.fun/",
    x: "https://x.com/QUMZOCOIN",
    telegram: "https://t.me/+IoHMI-nxkt83YWQ0",
    chart: "" // e.g. your DexScreener link once it exists (leave empty to hide)
  },

  aboutTitle: "Part alien. Part internet. Part ancient.",
  aboutText: "Nobody knows exactly what QUMZO is — and that's the point. A tiny creature that crash-landed into the timeline, curious about everything and fluent in memes.",
  traits: [
    { icon: "✦", title: "From another world", text: "Galaxy eyes and a glowing antenna tuned to frequencies only the internet can hear." },
    { icon: "▦", title: "Born online", text: "Raised on memes, glitches and group chats. QUMZO is at home wherever the internet is weird." },
    { icon: "◈", title: "Older than time", text: "Those cracks aren't damage. They're history. QUMZO has been waiting a very long time for you." }
  ],

  howToBuy: [
    { title: "Get a wallet", text: "Download Phantom (or any Solana wallet) from the official app store or phantom.com." },
    { title: "Get some SOL", text: "Buy SOL on an exchange or inside the wallet, and send it to your wallet address." },
    { title: "Go to pump.fun", text: "Open the official link from this site or our X. Connect your wallet." },
    { title: "Swap for $QUMZO", text: "Paste the contract address from this site, check it matches, and swap." }
  ],

  // status: "done" | "now" | "next"   —   each item: [text, finished?]
  roadmap: [
    { phase: "PHASE 01", title: "Signal detected", status: "now", items: [
      ["QUMZO character & brand created", true],
      ["X and Telegram launched", true],
      ["Website live", true],
      ["Fair launch on pump.fun", false],
      ["Contract published on site & X", false]
    ]},
    { phase: "PHASE 02", title: "First contact", status: "next", items: [
      ["Daily memes & QUMZO sticker packs", false],
      ["Community meme & art contests", false],
      ["Complete the bonding curve", false],
      ["DexScreener profile updated", false]
    ]},
    { phase: "PHASE 03", title: "QUMZO world", status: "next", items: [
      ["QUMZO mini-game (play in browser)", true],
      ["Game leaderboard & community challenges", false],
      ["Telegram sticker set & emoji pack", false],
      ["CoinGecko / CoinMarketCap applications", false]
    ]},
    { phase: "PHASE 04", title: "Beyond the orbit", status: "next", items: [
      ["Community-voted ideas", false],
      ["Collabs with other communities", false],
      ["More QUMZO lore & characters", false],
      ["Merch — if the community wants it", false]
    ]}
  ],

  tokenomics: [
    { value: "$QUMZO", label: "Ticker" },
    { value: "Solana", label: "Network" },
    { value: "TBA", label: "Total supply" },
    { value: "TBA", label: "Creator fee" }
  ],

  gameTitle: "The QUMZO game",
  gameText: "Help QUMZO dodge space junk and collect stars. Chain stars for combos, beat your best score, and share it on X.",

  communityTitle: "QUMZO is what we make of it.",
  communityText: "Memes, art, jokes and experiments. The website documents the project — the community creates the culture.",

  faq: [
    { q: "What is QUMZO?", a: "A community meme coin on Solana built around an original character: a small cosmic creature that's part alien, part internet, part ancient." },
    { q: "Does QUMZO have utility?", a: "QUMZO is a meme. The plan is fun: memes, art, stickers and a mini-game. There is no promise of profit, returns or financial value." },
    { q: "Where do I find the real contract?", a: "Only on this website and on our official X account. Always double-check the address before swapping." },
    { q: "Will an admin DM me?", a: "Never. Admins will never DM you first or ask for your seed phrase. Anyone who does is a scammer." }
  ],

  footerNote: "Experimental community meme project. Not financial advice. No promise of profit. Crypto is risky — only use what you can afford to lose."
};
