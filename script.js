/* ============================================================
   Olitha Induvara — Portfolio scripts
   Works across all pages: index.html, projects.html,
   achievements.html, events.html, skills.html, experience.html
   ============================================================ */

(function () {
  'use strict';

  /* ---------------- Theme toggle (with persistence) ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('portfolio-theme');

  if (storedTheme) {
    root.dataset.theme = storedTheme;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.dataset.theme = 'dark';
  }

  /* Label next to the icon shows the mode you switch TO (matches the icon) */
  const themeLabel = themeToggle.querySelector('.theme-label');
  function syncThemeLabel() {
    if (themeLabel) themeLabel.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark';
  }
  syncThemeLabel();

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
    syncThemeLabel();
  });

  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  /* ---------------- Reveal-on-scroll animations ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------------- Quick search overlay ---------------- */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchBtn = document.getElementById('searchBtn');

  const searchIndex = [
    { label: 'Bio — About me & profile', href: 'index.html' },
    { label: 'Education — BSc Electrical & Electronic Engineering, University of Peradeniya', href: 'index.html#education' },
    { label: 'Highlights — special moments in photos', href: 'index.html#highlights' },
    { label: 'Projects — FloodLink: real-time river monitoring & flood prediction (2nd place I-to-I 2025)', href: 'projects.html#project-floodlink' },
    { label: 'Projects — SkyAQ real-time air quality measurement drone (EngEx 2025)', href: 'projects.html#project-skyaq' },
    { label: 'Projects — Smart voice-based attendance system (MFCC & GMM)', href: 'projects.html#project-voice' },
    { label: 'Projects — First projector mapping at FoE UoP (Resolume Arena)', href: 'projects.html#project-projmap' },
    { label: 'Projects — Microcontroller-free line following robot', href: 'projects.html#project-line' },
    { label: 'Projects — RPM-to-voltage sensor (RPM meter)', href: 'projects.html#project-rpm' },
    { label: 'Projects — Rock Paper Scissors Lizard Spock game (Arduino + Python)', href: 'projects.html#project-rpsls' },
    { label: 'Projects — Bottle Mate: smart hydration reminder (ATmega328P, Assembly)', href: 'projects.html#project-bottlemate' },
    { label: 'Projects — ML-based flood prediction for a tropical river basin (ongoing, FloodLink 2.0)', href: 'projects.html#project-ml' },
    { label: 'Experience — Secretary, Gauge Society; IEEE PES Web Team; clubs & societies', href: 'experience.html' },
    { label: 'Achievements — FloodLink 2nd Place, Idea to Invention 2025 (UPAA-USA)', href: 'achievements.html#ach-floodlink' },
    { label: 'Achievements — FloodLink winner meeting with Dr. Upul Aththanayaka & Dr. Vijitha Herath', href: 'achievements.html#ach-meeting' },
    { label: 'Achievements — International Asteroid Search Campaign (SEDS Sri Lanka)', href: 'achievements.html#ach-asteroid' },
    { label: 'Achievements — Pera Beat media coverage (Gauge crew)', href: 'achievements.html#ach-perabeat' },
    { label: 'Skills — Photography', href: 'skills.html#skill-photo' },
    { label: 'Skills — Videography (gimbal & live events)', href: 'skills.html#skill-video' },
    { label: 'Skills — Aerial cinematography (drone)', href: 'skills.html#skill-aerial' },
    { label: 'Skills — Astronomy enthusiast', href: 'skills.html#skill-astro' },
    { label: 'Skills — Photo & video editing', href: 'skills.html#skill-edit' },
    { label: 'Skills — Leadership & event coordinating', href: 'skills.html#skill-lead' },
    { label: 'Participations — EngEx 2025 media production & first university drone show', href: 'events.html#event-engex' },
    { label: 'Participations — Techno 2025 (UoP stall media)', href: 'events.html#event-techno25' },
    { label: 'Participations — Techno 2024 (organising & Gauge media crew)', href: 'events.html#event-techno24' },
    { label: 'Participations — PERA BOTS 2025 live streaming', href: 'events.html#event-perabots' },
    { label: 'Participations — Solar Observation Camp (IOSA)', href: 'events.html#event-solar' },
    { label: 'Participations — Stardust Sanctuary 2024 night-sky camp (SEDS)', href: 'events.html#event-seds' },
    { label: 'Participations — Nebula Night stargazing', href: 'events.html#event-nebula' },
    { label: 'Participations — Sandhwani show videography (Vibhawa)', href: 'events.html#event-sandhwani' },
    { label: 'Participations — Wasanthaye Aga 2024 & 2025 videography', href: 'events.html#event-wa2024' },
    { label: 'Participations — Quad Game Drone Workshop', href: 'events.html#event-drone' },
    { label: 'Participations — Nilambe Hydropower & Kiribathkumbura grid field visit', href: 'events.html#event-field' },
    { label: 'Participations — Project Nanthambara / Linequest photography (GAUGE)', href: 'events.html#event-linequest' },
    { label: 'Participations — Spaghetti Tower Competition, SLIIT Tower Fest (40.18 kg)', href: 'events.html#event-tower' },
    { label: 'Contact — Email & LinkedIn', href: '#contact' },
  ];

  if (searchOverlay) {
    function renderResults(query) {
      const q = query.trim().toLowerCase();
      const matches = q
        ? searchIndex.filter((item) => item.label.toLowerCase().includes(q))
        : searchIndex;
      searchResults.innerHTML = matches.length
        ? matches
            .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
            .join('')
        : '<li style="padding:11px 14px;color:var(--muted);font-size:.94rem">No matches found</li>';
    }

    function openSearch() {
      searchOverlay.hidden = false;
      renderResults('');
      setTimeout(() => searchInput.focus(), 30);
    }
    function closeSearch() {
      searchOverlay.hidden = true;
      searchInput.value = '';
    }

    searchBtn.addEventListener('click', openSearch);
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });
    searchInput.addEventListener('input', () => renderResults(searchInput.value));
    searchResults.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchOverlay.hidden) closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    });
  }

  /* ---------------- Photo gallery lightbox (projects page) ---------------- */
  const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  if (galleryImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Photo viewer');
    lightbox.innerHTML = `
      <button class="lb-btn lb-close" aria-label="Close">&times;</button>
      <button class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>
      <figure class="lb-figure">
        <img class="lb-img" src="" alt="">
        <figcaption class="lb-cap"></figcaption>
      </figure>
      <button class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lb-img');
    const lbCap = lightbox.querySelector('.lb-cap');
    let current = 0;

    function show(index) {
      current = (index + galleryImages.length) % galleryImages.length;
      const img = galleryImages[current];
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      const cap = img.closest('figure').querySelector('.g-cap');
      lbCap.textContent = cap ? cap.textContent : img.alt;
    }
    function openLightbox(index) {
      show(index);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    galleryImages.forEach((img, i) => {
      img.closest('.gallery-item').addEventListener('click', () => openLightbox(i));
    });

    lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------------- Interactive particle network (Bio page only) ----------------
     A soft "net" of drifting dots that links to your mouse pointer as it moves. */
  const netCanvas = document.getElementById('netCanvas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (netCanvas && !reduceMotion) {
    const ctx = netCanvas.getContext('2d');
    const mouse = { x: null, y: null };
    let particles = [];
    let W = 0;
    let H = 0;

    function netResize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      netCanvas.width = Math.floor(W * dpr);
      netCanvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(90, Math.max(35, Math.floor((W * H) / 18000)));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 1.1,
      }));
    }

    window.addEventListener('resize', netResize);
    window.addEventListener('pointermove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function netColor(alpha) {
      const dark = document.documentElement.dataset.theme === 'dark';
      return dark
        ? `rgba(168, 140, 250, ${alpha})`
        : `rgba(106, 77, 246, ${alpha})`;
    }

    const LINK_DIST = 120;   // distance for particle-to-particle links
    const MOUSE_DIST = 175;  // distance for mouse-to-particle links

    function netFrame() {
      ctx.clearRect(0, 0, W, H);

      // move particles (with a gentle pull towards the cursor)
      for (const p of particles) {
        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_DIST && d > 35) {
            p.vx += (dx / d) * 0.012;
            p.vy += (dy / d) * 0.012;
          }
        }
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = 0.6;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        else if (p.y > H + 20) p.y = -20;
      }

      // draw links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = netColor(0.16 * (1 - d / LINK_DIST));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.x !== null) {
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dm < MOUSE_DIST) {
            ctx.strokeStyle = netColor(0.45 * (1 - dm / MOUSE_DIST));
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // draw dots
      ctx.fillStyle = netColor(0.5);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(netFrame);
    }

    netResize();
    requestAnimationFrame(netFrame);
  }

  /* ---------------- Read more: collapsible card details ----------------
     Each card shows header + short description + photos first;
     the full story unfolds behind the "Read more" arrow button. */
  function recalcOpenCollapses() {
    document.querySelectorAll('.details-collapse.open').forEach((c) => {
      c.style.maxHeight = c.scrollHeight + 'px';
    });
  }

  document.querySelectorAll('.read-more-btn').forEach((btn) => {
    const article = btn.closest('.project-feature');
    const collapse = article ? article.querySelector(':scope > .details-collapse') : null;
    if (!collapse) return;
    const label = btn.querySelector('.rm-text');
    btn.addEventListener('click', () => {
      const open = collapse.classList.toggle('open');
      collapse.style.maxHeight = open ? collapse.scrollHeight + 'px' : '0px';
      btn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Show less' : 'Read more';
    });
  });

  window.addEventListener('resize', recalcOpenCollapses);


  /* ---------------- Photography hire form (opens WhatsApp) ---------------- */
  const hireForm = document.getElementById('hireForm');
  if (hireForm) {
    const WA_NUM = '94715148655';
    hireForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
      const name = val('hf-name'), type = val('hf-type'), date = val('hf-date'), msg = val('hf-msg');
      let text = 'Hello Olitha! I found your photography page.';
      if (name) text += '\nName: ' + name;
      if (type) text += '\nService: ' + type;
      if (date) text += '\nDate: ' + date;
      if (msg) text += '\nMessage: ' + msg;
      window.open('https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text), '_blank');
    });
  }


  /* ---------------- Photography page background parallax ---------------- */
  const pbgInner = document.querySelector('.page-bg-inner');
  if (pbgInner && !reduceMotion) {
    let pbgTicking = false;
    function pbgUpdate() {
      pbgInner.style.transform = 'translate3d(0,' + (window.scrollY * 0.10) + 'px,0)';
      pbgTicking = false;
    }
    window.addEventListener('scroll', () => {
      if (!pbgTicking) { pbgTicking = true; requestAnimationFrame(pbgUpdate); }
    }, { passive: true });
    pbgUpdate();
  }


  /* ---------------- Stats count-up (Photography page) ---------------- */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const animateStat = (el) => {
      const target = +el.dataset.target || 0;
      const suffix = el.dataset.suffix || '';
      const step = Math.max(1, Math.ceil(target / 40));
      let cur = 0;
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + suffix; }
        else { el.textContent = cur + suffix; requestAnimationFrame(tick); }
      };
      tick();
    };
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateStat(e.target); statObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    statNums.forEach((el) => statObs.observe(el));
  }

  /* ---------------- Footer year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
