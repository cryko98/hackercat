// Paste the pump.fun coin page here once you want to deep-link it,
// e.g. "https://pump.fun/coin/<mint>". Every [data-buy] button uses it.
const PUMP_URL = "https://pump.fun";

document.querySelectorAll("[data-buy]").forEach(a => (a.href = PUMP_URL));
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- digital rain ---------- */
(() => {
  const canvas = document.getElementById("rain");
  const ctx = canvas.getContext("2d");
  const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0101011001HACKERCAT$".split("");
  const size = 16;
  let cols = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -60);
  }

  function frame() {
    ctx.fillStyle = "rgba(3, 6, 3, 0.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px "IBM Plex Mono", monospace`;
    cols.forEach((y, i) => {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      ctx.fillStyle = Math.random() > 0.975 ? "#d6ffe2" : "#39ff7a";
      ctx.fillText(ch, i * size, y * size);
      cols[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) {
    for (let i = 0; i < 80; i++) frame();
  } else {
    setInterval(frame, 55);
  }
})();

/* ---------- hero typing ---------- */
(() => {
  const el = document.getElementById("typed");
  const lines = ["whoami", "cat lives.log | tail -1", "sudo hood --up", "./launch --chain solana --via pump.fun"];
  if (reduceMotion) { el.textContent = lines[0]; return; }
  let li = 0, ci = 0, deleting = false;
  (function tick() {
    const line = lines[li];
    el.textContent = line.slice(0, ci);
    if (!deleting && ci < line.length) ci++;
    else if (!deleting) { deleting = true; return setTimeout(tick, 1600); }
    else if (ci > 0) ci--;
    else { deleting = false; li = (li + 1) % lines.length; }
    setTimeout(tick, deleting ? 35 : 85);
  })();
})();

/* ---------- title glitch ---------- */
(() => {
  const title = document.querySelector(".title");
  if (reduceMotion) return;
  setInterval(() => {
    title.classList.add("glitch");
    setTimeout(() => title.classList.remove("glitch"), 320);
  }, 3800);
})();

/* ---------- reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll(".section-head, .story-text, .dossier, .life, .card, .term, .spec, .steps li");
  els.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ---------- lightbox ---------- */
(() => {
  const box = document.getElementById("lightbox");
  const img = box.querySelector("img");
  const cap = box.querySelector(".lb-cap");
  const open = card => {
    const src = card.querySelector("img");
    img.src = src.src;
    img.alt = src.alt;
    cap.textContent = card.querySelector("figcaption").textContent.replace(/^FILE_\d+/, "").trim();
    box.hidden = false;
  };
  const close = () => { box.hidden = true; };
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(card); } });
  });
  box.addEventListener("click", e => { if (e.target !== img) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();

/* ---------- terminal ---------- */
(() => {
  const body = document.getElementById("termBody");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termIn");
  const history = [];
  let hIdx = 0;

  const commands = {
    help: () => [
      "available commands:",
      "  whoami      who is this cat",
      "  story       the short version",
      "  lives       check the life counter",
      "  specs       token info",
      "  buy         how to get $HACKERCAT",
      "  meow        say hi",
      "  sudo rug    try it, see what happens",
      "  clear       wipe the screen",
    ],
    whoami: () => ["Hacker Cat. Black fur, green eyes, one life left.", "Ex server-room stray. Current occupation: bad luck for ruggers."],
    story: () => [
      "Born in a validator's server room.",
      "Lost lives 1 to 8 to rugs, drains and honeypots.",
      "Life 9: found the hoodie. Pulled the hood up.",
      "Now he crosses the chains of ruggers. $HACKERCAT is his calling card.",
    ],
    lives: () => ["[########-] 8/9 lives used", { t: "1 life remaining. status: HOOD UP", c: "hi" }],
    specs: () => ["name     Hacker Cat", "ticker   $HACKERCAT", "chain    Solana", "launch   pump.fun", "supply   1,000,000,000", "presale  none"],
    buy: () => [
      "1. get a Solana wallet (Phantom / Solflare)",
      "2. load it with SOL",
      "3. go to pump.fun and search $HACKERCAT",
      "4. swap, hood up, welcome to the clowder",
      { t: "opening pump.fun...", c: "hi" },
    ],
    meow: () => [pick(["meow.", "mrrrp?", "purr.exe running...", "MEOW (translation: wagmi)", "*knocks your bags off the table*"])],
    "sudo rug": () => [{ t: "[sudo] password for guest: ********", c: "out" }, { t: "Permission denied. A black cat just crossed your chain.", c: "err" }, { t: "This incident will be reported to the clowder.", c: "err" }],
    sudo: () => [{ t: "usage: sudo rug   (go on, try it)", c: "out" }],
    ls: () => ["hoodie.txt  lives.log  laser_pointer.exe  case_files/"],
    "cat hoodie.txt": () => ["HACKERCAT. size: one size fits all cats."],
    "cat lives.log": () => ["01-08 RUGGED", { t: "09    ACTIVE", c: "hi" }],
    "rm -rf rug": () => [{ t: "rug removed. the trenches thank you.", c: "hi" }],
    exit: () => ["there is no exit. there is only the hood."],
  };

  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function print(text, cls = "out") {
    const p = document.createElement("p");
    p.className = cls;
    p.textContent = text;
    body.appendChild(p);
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;
    print(`guest@hackercat:~$ ${raw}`, "cmd");
    history.push(raw);
    hIdx = history.length;
    if (cmd === "clear") { body.innerHTML = ""; return; }
    const fn = commands[cmd];
    if (!fn) {
      print(`command not found: ${cmd}. type 'help'`, "err");
    } else {
      fn().forEach(line => (typeof line === "string" ? print(line) : print(line.t, line.c)));
      if (cmd === "buy") setTimeout(() => window.open(PUMP_URL, "_blank", "noopener"), 700);
    }
    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && hIdx > 0) { hIdx--; input.value = history[hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; e.preventDefault(); }
  });
  document.querySelectorAll(".term-quick button").forEach(btn =>
    btn.addEventListener("click", () => { run(btn.dataset.cmd); input.focus({ preventScroll: true }); })
  );
  document.getElementById("term").addEventListener("click", e => {
    if (!e.target.closest("button")) input.focus({ preventScroll: true });
  });
})();
