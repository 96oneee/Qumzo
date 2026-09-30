// Renders config.js (PROJECT) into the page. You normally don't need to edit this file.
(function () {
  const P = PROJECT;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // simple text / html fields
  $$("[data-text]").forEach(el => { el.textContent = P[el.dataset.text] ?? ""; });
  $$("[data-html]").forEach(el => { el.innerHTML = P[el.dataset.html] ?? ""; });

  // links (hide buttons whose link is empty)
  $$("[data-link]").forEach(el => {
    const url = P.links[el.dataset.link];
    if (!url || url === "#") { el.style.display = "none"; } else { el.href = url; }
  });

  // traits
  $("#traits").innerHTML = P.traits.map(t =>
    `<article class="card reveal"><div class="ico">${esc(t.icon)}</div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></article>`).join("");

  // how to buy
  $("#steps").innerHTML = P.howToBuy.map((s, i) =>
    `<article class="card reveal"><div class="num">0${i + 1}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("");

  // tokenomics
  $("#tokenGrid").innerHTML = P.tokenomics.map(x =>
    `<div class="reveal"><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join("");

  // roadmap
  const pillText = { done: "DONE", now: "NOW", next: "UPCOMING" };
  $("#roadmapGrid").innerHTML = P.roadmap.map(r =>
    `<div class="phase ${r.status} reveal"><div class="dot"></div><article class="card">
      <div class="label">${esc(r.phase)}<span class="pill">${pillText[r.status] || ""}</span></div>
      <h3>${esc(r.title)}</h3>
      <ul>${r.items.map(([t, ok]) => `<li class="${ok ? "ok" : ""}">${esc(t)}</li>`).join("")}</ul>
    </article></div>`).join("");

  // stickers
  const moods = ["default", "happy", "wink", "love", "cool", "shocked", "sleepy", "confused"];
  $("#stickerGrid").innerHTML = moods.map(m =>
    `<a class="sticker reveal" href="qumzo-${m}.png" download="qumzo-${m}.png" title="Download ${m}">
      <img src="qumzo-${m}.svg" alt="QUMZO ${m}" loading="lazy"><span>${m.toUpperCase()}</span></a>`).join("");

  // faq
  $("#faqList").innerHTML = P.faq.map((f, i) =>
    `<details class="reveal"${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

  // ticker
  const words = [P.ticker, "WEIRD BY DESIGN", "PART ALIEN", "PART INTERNET", "PART ANCIENT", "SOLANA"];
  const line = words.map(w => `<span>${esc(w)}</span><b>✦</b>`).join("");
  $("#ticker").innerHTML = line + line + line + line;

  $("#year").textContent = new Date().getFullYear();

  // copy contract
  const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800); };
  $$(".copy").forEach(b => b.addEventListener("click", async () => {
    if (/TBA/i.test(P.contract)) { toast("Contract drops at launch — stay tuned 👽"); return; }
    try { await navigator.clipboard.writeText(P.contract); toast("Contract copied ✓"); b.textContent = "COPIED"; setTimeout(() => b.textContent = "COPY", 1400); }
    catch (e) { toast("Copy failed — select it manually"); }
  }));

  // mobile menu
  const burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  // boop the mascot -> cycles moods
  const img = $("#mascotImg"), btn = $("#mascot");
  moods.forEach(m => { const i = new Image(); i.src = `qumzo-${m}.svg`; }); // preload
  let mi = 0;
  btn.addEventListener("click", () => {
    mi = (mi + 1) % moods.length;
    img.src = `qumzo-${moods[mi]}.svg`;
    btn.classList.add("boop"); setTimeout(() => btn.classList.remove("boop"), 150);
  });

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));

  // starfield
  const c = $("#stars"), ctx = c.getContext("2d");
  let stars = [], W, H;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 5000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .2, p: Math.random() * 6.28, s: Math.random() * .02 + .005 }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.p += s.s;
      ctx.globalAlpha = .35 + Math.sin(s.p) * .35 + .2;
      ctx.fillStyle = s.r > 1.2 ? "#cdbfff" : "#fff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size(); draw(); addEventListener("resize", size);
})();
