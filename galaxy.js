// Year
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Starfield canvas ----------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let w = 0, h = 0;

function resize() {
  w = canvas.width = window.innerWidth * window.devicePixelRatio;
  h = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  initStars();
}

function initStars() {
  const count = Math.floor((window.innerWidth * window.innerHeight) / 1600);
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
    ctx.arc(s.x, y, s.r * window.devicePixelRatio, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

resize();
window.addEventListener("resize", resize);
draw();

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
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// ---------- Nav highlight ----------
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 140;
  let activeIdx = -1;
  sections.forEach((sec, i) => { if (sec && sec.offsetTop <= y) activeIdx = i; });
  navLinks.forEach((l, i) => { l.style.color = i === activeIdx ? "var(--text)" : ""; });
});
