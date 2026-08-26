// Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ---------- Starfield canvas ----------
const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;
let stars = [];
let w = 0, h = 0;

const isTouchLike = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shouldUseLightEffects = isTouchLike || prefersReducedMotion;

function resize() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, shouldUseLightEffects ? 1.25 : 2);
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  initStars();
}

function initStars() {
  const densityDivisor = shouldUseLightEffects ? 4200 : 3000;
  const count = Math.floor((window.innerWidth * window.innerHeight) / densityDivisor);
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1.5 + 0.2,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      tws: 0.005 + Math.random() * 0.02,
      hue: Math.random() < 0.15
        ? (Math.random() < 0.5 ? 200 : 280)
        : null,
    });
  }
}

let scrollY = 0;
window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

function draw() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    s.tw += s.tws;
    const alpha = 0.5 + Math.sin(s.tw) * 0.4;
    const offsetY = (scrollY * s.z * 0.3) % h;
    const y = (s.y - offsetY + h) % h;
    if (s.hue !== null) {
      ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${alpha})`;
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    }
    ctx.beginPath();
    ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

if (canvas && ctx && !prefersReducedMotion) {
  resize();
  window.addEventListener("resize", resize);
  draw();
}

// ---------- Mobile nav ----------
const nav = document.querySelector(".nav");
const navToggle = document.getElementById("nav-toggle");
const navLinksList = document.getElementById("nav-links");
if (nav && navToggle && navLinksList) {
  const setOpen = (isOpen) => {
    nav.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("nav-open");
    setOpen(!isOpen);
  });

  navLinksList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

// ---------- Theme toggle ----------
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("galaxy-theme");
if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  themeIcon.textContent = "☀️";
}
themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "🌌";
    localStorage.setItem("galaxy-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.textContent = "☀️";
    localStorage.setItem("galaxy-theme", "light");
  }
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => io.observe(el));

// ---------- Stat counters ----------
const stats = document.querySelectorAll(".stat-num");
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      const display = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
      el.textContent = display + suffix;
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });
stats.forEach((el) => statsObserver.observe(el));

// ---------- Cursor follow ----------
const dot = document.querySelector(".cursor-dot");
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  const loop = () => {
    dx += (mx - dx) * 0.18;
    dy += (my - dy) * 0.18;
    dot.style.left = dx + "px";
    dot.style.top = dy + "px";
    requestAnimationFrame(loop);
  };
  loop();
  document.querySelectorAll("a, button, .chip, .skill-tags span, .proj-card, .tl-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.style.width = "44px"; dot.style.height = "44px"; dot.style.opacity = "0.4";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.width = "18px"; dot.style.height = "18px"; dot.style.opacity = "0.7";
      });
    });
}

// ---------- Tilt ----------
if (!isTouchLike && !prefersReducedMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// ---------- Nav highlight ----------
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 140;
  let activeIdx = -1;
  sections.forEach((sec, i) => { if (sec && sec.offsetTop <= y) activeIdx = i; });
  navLinks.forEach((l, i) => { l.style.color = i === activeIdx ? "var(--text)" : ""; });
});


// ---------- Hero chat ----------
(function () {
  // Served from Vercel (or localhost) the function is same-origin, so a
  // relative path works and CORS never applies. From GitHub Pages it's a
  // different origin and needs the absolute URL.
  const VERCEL_API = "https://myportfolio-murex-six-91.vercel.app/api/chat";
  const sameOrigin =
    location.hostname.endsWith(".vercel.app") ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  const API_URL = sameOrigin ? "/api/chat" : VERCEL_API;

  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const suggestions = document.getElementById("chat-suggestions");
  const resetBtn = document.getElementById("chat-reset");
  const fab = document.getElementById("chat-fab");
  const heroChat = document.querySelector(".hero-chat");

  if (!form || !input || !log) return;

  let history = [];
  let busy = false;
  let started = false; // true once a question has actually been sent

  // --- greeting engage/disengage ------------------------------------------

  // The greeting clears as soon as there's something to say — matching the way
  // Claude's greeting steps aside when you start typing. If the visitor clears
  // the box before ever sending, it comes back.
  function setEngaged(on) {
    document.body.classList.toggle("chat-engaged", on);
  }
  function syncEngaged() {
    setEngaged(started || input.value.trim().length > 0);
  }
  input.addEventListener("input", syncEngaged);

  // Bring the composer to the middle of the screen when it's focused. Without
  // this the greeting collapses around the visitor while the page stays put,
  // so the input appears to jump rather than the view following it.
  const composer = form;
  function centerComposer() {
    composer.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }
  input.addEventListener("focus", centerComposer);

  // The greeting collapse moves the composer after focus, so re-centre once
  // that animation finishes — but only while the input still has focus, so we
  // never yank the page out from under someone who has clicked away.
  const greeting = document.getElementById("hero-greeting");
  greeting?.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "max-height") return;
    if (document.activeElement !== input) return;
    centerComposer();
  });

  // --- rendering -----------------------------------------------------------

  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);

  // Minimal markdown. Everything is escaped first, so model output can never
  // inject markup into the page.
  function renderMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
      )
      .replace(
        /(^|\s)((?:https?:\/\/|mailto:)[^\s<]+)/g,
        '$1<a href="$2" target="_blank" rel="noopener">$2</a>'
      )
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  const atBottom = () =>
    log.scrollHeight - log.scrollTop - log.clientHeight < 60;

  function scrollDown(force) {
    if (force || atBottom()) log.scrollTop = log.scrollHeight;
  }

  function addMessage(role, text) {
    log.hidden = false;
    const el = document.createElement("div");
    el.className = `chat-msg ${role}`;
    if (role === "user") el.textContent = text;
    else el.innerHTML = renderMarkdown(text);
    log.appendChild(el);
    scrollDown(true);
    return el;
  }

  function addTyping() {
    log.hidden = false;
    const el = document.createElement("div");
    el.className = "chat-msg bot";
    el.innerHTML =
      '<span class="chat-typing"><span></span><span></span><span></span></span>';
    log.appendChild(el);
    scrollDown(true);
    return el;
  }

  // --- reset ---------------------------------------------------------------

  resetBtn?.addEventListener("click", () => {
    if (busy) return;
    history = [];
    started = false;
    log.innerHTML = "";
    log.hidden = true;
    resetBtn.hidden = true;
    if (suggestions) suggestions.hidden = false;
    input.value = "";
    syncEngaged();
    input.focus();
  });

  suggestions?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || busy) return;
    input.value = btn.textContent.trim();
    form.requestSubmit();
  });

  // --- sending -------------------------------------------------------------

  function setBusy(state) {
    busy = state;
    sendBtn.disabled = state;
    input.disabled = state;
  }

  async function send(question) {
    started = true;
    setEngaged(true);
    addMessage("user", question);
    history.push({ role: "user", content: question });
    if (suggestions) suggestions.hidden = true;
    if (resetBtn) resetBtn.hidden = false;

    const typing = addTyping();
    setBusy(true);

    let bubble = null;
    let answer = "";

    const show = (chunk) => {
      answer += chunk;
      if (!bubble) {
        typing.remove();
        bubble = addMessage("bot", "");
      }
      bubble.innerHTML = renderMarkdown(answer);
      scrollDown(false);
    };

    const fail = (msg) => {
      if (bubble) bubble.remove();
      typing.remove();
      addMessage("bot", msg).classList.add("error");
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        let msg = "Something went wrong. Try again in a moment?";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch { /* non-JSON error body */ }
        fail(msg);
        return;
      }

      // Parse the SSE stream: frames are separated by a blank line.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let errored = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          let event = "message";
          let data = "";
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;

          let payload;
          try {
            payload = JSON.parse(data);
          } catch {
            continue;
          }

          if (event === "delta" && payload.text) show(payload.text);
          else if (event === "error") {
            errored = true;
            fail(payload.message || "Something went wrong.");
          }
        }
      }

      if (!errored && answer.trim()) {
        history.push({ role: "assistant", content: answer });
      } else if (!errored && !answer.trim()) {
        fail("I didn't catch that — mind rephrasing?");
      }
    } catch (err) {
      console.error(err);
      fail(
        "I couldn't reach the server. You can always email sumeethaldipur.work@gmail.com."
      );
    } finally {
      setBusy(false);
      if (history.length > 12) history = history.slice(-12);
      input.focus();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    input.value = "";
    send(question);
  });

  // --- scroll-back button --------------------------------------------------

  // There's only ever one conversation. Once the hero scrolls away the button
  // brings the visitor back to it rather than opening a second copy.
  if (fab && heroChat) {
    fab.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => input.focus(), 500);
    });

    const fabObserver = new IntersectionObserver(
      ([entry]) => {
        fab.hidden = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    fabObserver.observe(heroChat);
  }
})();
