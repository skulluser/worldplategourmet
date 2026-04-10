/* ============================================================
   WORLD PLATE GOURMET — Main JavaScript
   ============================================================ */

'use strict';

/* ── Page Loader ── */
(function initLoader() {
  const loader     = document.getElementById('page-loader');
  const progressBar = document.querySelector('.loader-progress-bar');
  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
    if (progressBar) progressBar.style.width = progress + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ── Custom Cursor ── */
(function initCursor() {
  const cursor   = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects
  const hoverTargets = 'a, button, .menu-tab, .gallery-item, .team-card, .value-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '20px';
      cursor.style.height  = '20px';
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.background = 'rgba(201,168,76,0.08)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '10px';
      cursor.style.height  = '10px';
      follower.style.width  = '38px';
      follower.style.height = '38px';
      follower.style.background = '';
    });
  });
})();

/* ── Navbar scroll behavior ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mark active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Mobile Menu ── */
(function initMobileMenu() {
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const closeBtn   = document.querySelector('.nav-mobile-close');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    animateHamburger(true);
  });

  const close = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    animateHamburger(false);
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  function animateHamburger(open) {
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }
})();

/* ── Scroll Reveal ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── Count Up Animation ── */
(function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── Menu Tabs ── */
(function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        if (p.dataset.panel === target) {
          p.classList.remove('hidden');
          p.classList.add('fade-in');
          setTimeout(() => p.classList.remove('fade-in'), 400);
        } else {
          p.classList.add('hidden');
        }
      });
    });
  });
})();

/* ── Parallax Effect ── */
(function initParallax() {
  const slowEls = document.querySelectorAll('.parallax-slow');
  const medEls  = document.querySelectorAll('.parallax-med');
  if (!slowEls.length && !medEls.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        slowEls.forEach(el => {
          el.style.transform = `translateY(${y * 0.08}px)`;
        });
        medEls.forEach(el => {
          el.style.transform = `translateY(${y * 0.15}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
})();

/* ── Particles Canvas ── */
(function initParticles() {
  const canvas = document.querySelector('.particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
    ctx.fill();
  };

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Hero text typewriter ── */
(function initTypewriter() {
  const el = document.querySelector('.typewriter-target');
  if (!el) return;

  const words = el.dataset.words ? el.dataset.words.split('|') : [];
  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = words[wordIndex];
    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    el.textContent = word.substring(0, charIndex);

    let delay = deleting ? 60 : 100;
    if (!deleting && charIndex === word.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();

/* ── Smooth Page Transitions ── */
(function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Skip anchors, external links, mailto, tel
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('slide-in');
      setTimeout(() => {
        window.location = href;
      }, 600);
    });
  });

  // Slide out on load
  window.addEventListener('load', () => {
    overlay.classList.remove('slide-in');
    overlay.classList.add('slide-out');
    setTimeout(() => overlay.classList.remove('slide-out'), 600);
  });
})();

/* ── Reservation form handling ── */
(function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const origText = btn.textContent;
    btn.textContent = 'Confirming...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Reservation Received';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--gold)';
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
})();

/* ── Contact form handling ── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const origText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--gold)';
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
})();

/* ── Ticker strip ── */
(function initTicker() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  // Duplicate items for seamless loop
  const items = ticker.innerHTML;
  ticker.innerHTML = items + items;
})();

/* ── Gallery lightbox hint ── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.style.cursor = 'pointer';
  });
})();
