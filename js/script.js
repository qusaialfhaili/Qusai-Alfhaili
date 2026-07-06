'use strict';

function swapLogosToProfile() {
  try {
    const profileSrc = './images/my.jpg';
    const selectors = ['.load-logo img'];
    const imgs = new Set();
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(i => imgs.add(i)));

    imgs.forEach(img => {
      if (!img || img.dataset.replaced === '1') return;
      img.style.transition = 'opacity .45s ease';
      img.style.opacity = '0';
      const tmp = new Image();
      tmp.src = profileSrc;
      tmp.onload = () => {
        img.src = profileSrc;
        img.classList.add('user-logo');
        img.dataset.replaced = '1';
        img.alt = 'صورة شخصية';
        requestAnimationFrame(() => { img.style.opacity = '1'; });
      };
      tmp.onerror = () => {
        img.style.opacity = '1';
      };
    });
  } catch (e) {
    console.warn('Logo swap failed', e);
  }
}

const loadingScreen = document.getElementById('loadingScreen');
window.addEventListener('load', () => {
  swapLogosToProfile();

  setTimeout(() => {
    loadingScreen?.classList.add('gone');
    kickAnimations();
  }, 2600);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  const mIcon = themeToggleMobile?.querySelector('i');
  if (mIcon) {
    mIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

themeToggle?.addEventListener('click', toggleTheme);
themeToggleMobile?.addEventListener('click', toggleTheme);

const langToggle = document.getElementById('langToggle');
const langToggleMobile = document.getElementById('langToggleMobile');

function setLang(lang) {
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-ar], [data-en]').forEach(el => {
    const txt = el.getAttribute(`data-${lang}`);
    if (txt !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = txt;
      } else {
        el.innerHTML = txt;
      }
    }
  });

  const label = lang === 'ar' ? 'EN' : 'AR';
  if (langToggle) langToggle.querySelector('span').textContent = label;
  if (langToggleMobile) langToggleMobile.querySelector('span').textContent = label;

  const track = document.querySelector('.expertise-slide');
  if (track) {
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animation = '';
  }
}

const savedLang = localStorage.getItem('lang') || 'ar';
setLang(savedLang);

function toggleLang() {
  const current = html.getAttribute('data-lang') || 'ar';
  setLang(current === 'ar' ? 'en' : 'ar');
}

langToggle?.addEventListener('click', toggleLang);
langToggleMobile?.addEventListener('click', toggleLang);

const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  mobileDrawer?.classList.add('open');
  drawerOverlay?.classList.add('show');
  menuToggle?.classList.add('open');
  menuToggle?.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  mobileDrawer?.classList.remove('open');
  drawerOverlay?.classList.remove('show');
  menuToggle?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
  mobileDrawer?.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerOverlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id?.startsWith('#')) {
      e.preventDefault();
      closeDrawer();
      const target = document.querySelector(id);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      }
    }
  });
});

document.querySelectorAll('.snav-link').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.snav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-section') === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(s => spyObserver.observe(s));

const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.goals-grid, .projects-grid, .tech-cards, .portfolio-grid').forEach(container => {
  Array.from(container.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.06}s`;
    child.classList.add('reveal-up');
    revealObserver.observe(child);
  });
});

const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObserver.observe(el));

(function initCertSlider() {
  const slider    = document.getElementById('certSlider');
  const prevBtn   = document.querySelector('.cert-prev');
  const nextBtn   = document.querySelector('.cert-next');
  const dotsWrap  = document.getElementById('certDots');
  const currEl    = document.getElementById('certCurrent');
  const totalEl   = document.getElementById('certTotal');

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.cert-slide'));
  const total  = slides.length;
  let current  = 0;
  let autoTimer = null;
  let isDragging = false;
  let startX = 0;
  let diffX = 0;

  if (totalEl) totalEl.textContent = total;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function getDots() {
    return dotsWrap ? Array.from(dotsWrap.querySelectorAll('.cert-dot')) : [];
  }

  function getVisibleCount() {
    const wrapW = slider.parentElement?.clientWidth || window.innerWidth;
    const slideW = 280 + 22;
    return Math.max(1, Math.floor((wrapW - 100) / slideW));
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    const slideW = slides[0].offsetWidth + 22;
    slider.style.transform = `translateX(${
      document.documentElement.dir === 'rtl'
        ? current * slideW
        : -(current * slideW)
    }px)`;
    if (currEl) currEl.textContent = current + 1;
    slides.forEach((s, i) => s.classList.toggle('active-slide', i === current));
    const dots = getDots();
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { next(); resetAuto(); }
    if (e.key === 'ArrowRight') { prev(); resetAuto(); }
  });

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    diffX = e.touches[0].clientX - startX;
  }, { passive: true });
  slider.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(diffX) > 40) {
      diffX > 0 ? prev() : next();
      resetAuto();
    }
    diffX = 0;
  });

  slider.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    slider.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    diffX = e.clientX - startX;
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.cursor = '';
    if (Math.abs(diffX) > 40) {
      diffX > 0 ? prev() : next();
      resetAuto();
    }
    diffX = 0;
  });

  function startAuto() {
    autoTimer = setInterval(() => next(), 3500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  goTo(0);
  startAuto();

  slider.parentElement?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.parentElement?.addEventListener('mouseleave', () => startAuto());
})();

document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.cert-img-wrap')) {
    e.preventDefault();
    return false;
  }
});

document.querySelectorAll('.cert-img-wrap img').forEach(img => {
  img.addEventListener('dragstart', e => e.preventDefault());
});

(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const prog = this.life / this.maxLife;
      const fade = prog < 0.1 ? prog / 0.1 : prog > 0.9 ? (1 - prog) / 0.1 : 1;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(99,210,190,${this.a * fade})`
        : `rgba(14,138,120,${this.a * 0.5 * fade})`;
      ctx.fill();
    }
  }

  function drawLines() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = isDark
            ? `rgba(99,210,190,${alpha})`
            : `rgba(14,138,120,${alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

function kickAnimations() {
  document.querySelectorAll('#home .reveal-up').forEach(el => {
    el.classList.add('visible');
  });
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-section') === hash));
});