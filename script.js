/* ─────────────────────────────────────────
   DIYA PARIKH PORTFOLIO — script.js
───────────────────────────────────────── */

/* ── NAVBAR: add .scrolled class on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE BURGER ── */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');

  if (!burger || !navLinks) return;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  // Close menu if clicking outside
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      burger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

/* ── PARTICLE CANVAS ── */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#3b82f6', '#a78bfa'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.r     = Math.random() * 1.8 + 0.4;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const force = (90 - dist) / 90;
        this.vx += (dx / dist) * force * 0.4;
        this.vy += (dy / dist) * force * 0.4;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x   += this.vx;
      this.y   += this.vy;
      this.pulse += 0.015;
      if (this.y < -10 || this.x < -20 || this.x > W + 20) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    const count = Math.min(Math.floor((W * H) / 7000), 150);
    particles   = Array.from({ length: count }, () => new Particle());
  }
  init();

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.globalAlpha = (1 - d / 100) * 0.07;
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth   = 0.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── TYPING EFFECT ── */
(function () {
  const el = document.getElementById('typingText');
  if (!el) return; // Skip if typingText doesn't exist
  
  const words = ['Python', 'SQL', 'Power BI', 'Data Analysis', 'Data Visualisation', 'Pandas', 'Excel'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 900);
})();

/* ── INTERSECTION OBSERVER: reveal animations + skill bar fills ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .skill-category, .project-card').forEach(el => revealObs.observe(el));

/* Hero section — trigger immediately */
const heroReveals = document.querySelectorAll('#hero .reveal');
if (heroReveals.length) {
  setTimeout(() => heroReveals.forEach(el => el.classList.add('visible')), 100);
}

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => secObs.observe(s));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── SUBTLE CURSOR GLOW (desktop) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:     'fixed',
    top:          '0', left: '0',
    width:        '350px', height: '350px',
    background:   'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents:'none',
    zIndex:       '9997',
    transform:    'translate(-50%,-50%)',
    transition:   'opacity 0.3s',
  });
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ── 3D TILT on cards (desktop) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card, .skill-category, .info-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const dy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      card.style.transform  = `translateY(-8px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

/* ═══════════════════════════════════════════
   TECHY EXTRA FEATURES
═══════════════════════════════════════════ */

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrollTop / scrollMax) * 100).toFixed(2) + '%';
}, { passive: true });

/* ── COUNTER ANIMATION for stats ── */
function animateCounter(el, rawText, duration = 1500) {
  if (rawText.includes('∞')) { el.textContent = '∞'; return; }
  const num = parseInt(rawText, 10);
  if (isNaN(num)) return;
  const suffix = rawText.replace(String(num), '');
  const start  = performance.now();
  function step(now) {
    const t       = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, el.textContent.trim());
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObs.observe(statsEl);

/* ── STAGGERED CARD ENTRANCE ── */
const gridEntranceObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.skill-category, .project-card, .edu-card');
      cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(40px) scale(0.96)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
          card.style.opacity    = '1';
          card.style.transform  = '';
          card.classList.add('visible');
        }, i * 110);
      });
      gridEntranceObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.skills-categories, .projects-grid, .education-grid').forEach(g => {
  g.querySelectorAll('.skill-category, .project-card, .edu-card').forEach(c => {
    c.style.opacity = '0';
  });
  gridEntranceObs.observe(g);
});

/* ── MAGNETIC BUTTONS ── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.terminal-btn, .project-link').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      btn.style.transform  = `translate(${(e.clientX - cx) * 0.22}px, ${(e.clientY - cy) * 0.22}px)`;
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}

/* ── NEON RIPPLE on click ── */
document.querySelectorAll('.terminal-btn, .project-link').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => {
    const ripple  = document.createElement('span');
    const rect    = btn.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height) * 2;
    Object.assign(ripple.style, {
      position:     'absolute',
      borderRadius: '50%',
      width:        size + 'px',
      height:       size + 'px',
      left:         (e.clientX - rect.left - size / 2) + 'px',
      top:          (e.clientY - rect.top  - size / 2) + 'px',
      background:   'rgba(255,255,255,0.18)',
      transform:    'scale(0)',
      animation:    'rippleAnim 0.65s ease-out forwards',
      pointerEvents:'none',
    });
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ── HERO PARALLAX on scroll ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const hero    = document.getElementById('hero');
  if (!hero || scrollY > hero.offsetHeight) return;
  const pct = scrollY / hero.offsetHeight;
  
  const heroGlows = document.querySelectorAll('.hero-glow');
  if (heroGlows.length) {
    heroGlows.forEach((g, i) => {
      const dir = i === 1 ? -1 : 1;
      g.style.transform = `translateY(${pct * 90 * dir}px)`;
    });
  }
  
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${pct * 60}px)`;
}, { passive: true });

/* ── DATA STREAM: subtle random neon flashes in hero shapes ── */
(function () {
  const shapes = document.querySelectorAll('.shape');
  if (!shapes.length) return;
  setInterval(() => {
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    const colors = ['rgba(99,102,241,0.7)', 'rgba(6,182,212,0.7)', 'rgba(139,92,246,0.7)'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    s.style.borderColor  = c;
    s.style.boxShadow    = `0 0 14px ${c}`;
    s.style.transition   = 'border-color 0.2s, box-shadow 0.2s';
    setTimeout(() => {
      s.style.borderColor = '';
      s.style.boxShadow   = '';
    }, 400);
  }, 900);
})();

/* ── TYPEWRITER cursor color cycle ── */
(function () {
  const cursor = document.querySelector('.typing-cursor');
  if (!cursor) return;
  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899'];
  let ci = 0;
  setInterval(() => {
    ci = (ci + 1) % colors.length;
    cursor.style.color       = colors[ci];
    cursor.style.borderColor = colors[ci];
  }, 2500);
})();

/* ── DOWNLOAD RESUME ── */
function downloadResume(e) {
  if (e) e.preventDefault();
  
  // Fetch and download resume file
  fetch('Resume_new.pdf')
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Diya_Parikh_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
    .catch(err => {
      console.error('Error downloading resume:', err);
      alert('Error downloading resume. Please try again.');
    });
}

