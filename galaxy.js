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
