/* ============================================================
   soylauta — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- bilingual toggle ---------- */
  var adjectives = {
    es: ['VALIENTES', 'REBELDES', 'RAROS', 'AUDACES', 'CURIOSOS', 'INQUIETOS', 'SOÑADORES', 'INTENSOS', 'DISTINTOS', 'VISIONARIOS', 'INADAPTADOS', 'IMPARABLES'],
    en: ['BRAVE', 'REBELS', 'WEIRD', 'BOLD', 'DARING', 'RESTLESS', 'DREAMERS', 'MISFITS', 'FEARLESS', 'VISIONARIES', 'MAVERICKS', 'UNSTOPPABLE']
  };

  function getLang() {
    return localStorage.getItem('soylauta-lang') || 'es';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-es]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val !== null) el.textContent = val;
    });
    document.querySelectorAll('[data-ph-es]').forEach(function (el) {
      var val = el.getAttribute('data-ph-' + lang);
      if (val !== null) el.placeholder = val;
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    localStorage.setItem('soylauta-lang', lang);
    rebuildRotator(lang);
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  /* ---------- adjective cloud (faithful to reference) ---------- */
  var adjEl = document.getElementById('adjectives');
  var adjTimer = null, adjIdx = 0, adjLang = getLang();

  function rebuildRotator(lang) {
    adjLang = lang;
    if (!adjEl) return;
    var words = adjectives[lang] || adjectives.es;
    adjEl.innerHTML = words.map(function (w) { return '<span>' + w + '</span>'; }).join(' ');
    adjIdx = 0;
    highlightAdj();
  }

  function highlightAdj() {
    if (!adjEl) return;
    var spans = adjEl.querySelectorAll('span');
    spans.forEach(function (s) { s.classList.remove('on'); });
    if (spans[adjIdx]) spans[adjIdx].classList.add('on');
  }

  function tickAdj() {
    if (!adjEl) return;
    var spans = adjEl.querySelectorAll('span');
    if (!spans.length) return;
    adjIdx = (adjIdx + 1) % spans.length;
    highlightAdj();
  }
  if (adjEl) adjTimer = setInterval(tickAdj, 1300);

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- sticker scroll ---------- */
  document.querySelectorAll('.sticker').forEach(function (s, i) {
    s.style.animationDelay = (i * 0.35) + 's';
    s.style.transform = 'rotate(' + ((i % 2 === 0 ? -1 : 1) * (2 + i % 3)) + 'deg)';
    s.addEventListener('click', function () {
      var t = document.querySelector(s.getAttribute('data-target'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 0.06) + 's';
    io.observe(el);
  });

  /* ---------- work modal ---------- */
  var modal = document.getElementById('modal');
  var modalPill = document.getElementById('modalPill');
  function openModal(name) {
    if (modalPill) modalPill.textContent = name || 'Proyecto';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.work-card').forEach(function (c) {
    c.addEventListener('click', function () { openModal(c.getAttribute('data-name')); });
  });
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- newsletter ---------- */
  var form = document.getElementById('clubForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name=name]');
      var email = form.querySelector('[name=email]');
      var ok = true;
      [name, email].forEach(function (i) {
        if (!i.value.trim() || (i.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(i.value))) {
          i.style.borderColor = '#ff5a5a'; ok = false;
        } else { i.style.borderColor = ''; }
      });
      if (ok) document.getElementById('club').classList.add('done');
    });
  }

  /* ---------- nav shadow on scroll ---------- */
  var nav = document.querySelector('header.nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 0 rgba(13,13,12,.06)' : 'none';
  }, { passive: true });

  /* ============================================================
     TWEAKS PANEL (host protocol)
     ============================================================ */
  var TWEAK_DEFS = {
    accent: '#c9f23a',
    font: 'Anton'
  };
  var ACCENTS = {
    'Acid lime': '#c9f23a',
    'Electric blue': '#3b5bff',
    'Hot coral': '#ff5a3c',
    'Cyber pink': '#ff4fd8'
  };
  var FONTS = {
    'Anton': "'Anton', sans-serif",
    'Archivo Black': "'Archivo Black', sans-serif",
    'Syne': "'Syne', sans-serif"
  };

  function loadTweaks() {
    try { return JSON.parse(localStorage.getItem('soylauta-tweaks')) || {}; }
    catch (e) { return {}; }
  }
  function saveTweaks(t) { localStorage.setItem('soylauta-tweaks', JSON.stringify(t)); }

  function ensureFont(name) {
    if (name === 'Anton') return;
    var id = 'font-' + name.replace(/\s/g, '');
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + name.replace(/\s/g, '+') + ':wght@400;700;800&display=swap';
    document.head.appendChild(l);
  }

  function applyTweaks(t) {
    var root = document.documentElement;
    if (t.accent) {
      root.style.setProperty('--accent', t.accent);
      // pick readable ink for accent
      var dark = ['#3b5bff', '#ff5a3c', '#ff4fd8'].indexOf(t.accent) !== -1;
      root.style.setProperty('--accent-ink', dark ? '#fff' : '#0d0d0c');
    }
    if (t.font && FONTS[t.font]) {
      ensureFont(t.font);
      root.style.setProperty('--font-display', FONTS[t.font]);
    }
  }
  var current = Object.assign({}, TWEAK_DEFS, loadTweaks());
  applyTweaks(current);

  // Build a lightweight in-page tweaks panel that respects the host on/off toggle
  var panel = null;
  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'tweaksPanel';
    panel.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:500;width:240px;background:#fff;border:2px solid #0d0d0c;box-shadow:5px 5px 0 #0d0d0c;font-family:var(--font-text);padding:16px;display:none';
    var swatches = Object.keys(ACCENTS).map(function (k) {
      return '<button data-accent="' + ACCENTS[k] + '" title="' + k + '" style="width:30px;height:30px;border:2px solid #0d0d0c;cursor:pointer;background:' + ACCENTS[k] + '"></button>';
    }).join('');
    var fontOpts = Object.keys(FONTS).map(function (k) {
      return '<option value="' + k + '">' + k + '</option>';
    }).join('');
    panel.innerHTML =
      '<div style="font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px">Tweaks</div>' +
      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Accent</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:16px">' + swatches + '</div>' +
      '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Display font</div>' +
      '<select id="tw-font" style="width:100%;padding:8px;border:2px solid #0d0d0c;font-family:var(--font-text);font-size:14px">' + fontOpts + '</select>';
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-accent]').forEach(function (b) {
      b.addEventListener('click', function () {
        current.accent = b.getAttribute('data-accent');
        applyTweaks(current); saveTweaks(current);
      });
    });
    var sel = panel.querySelector('#tw-font');
    sel.value = current.font;
    sel.addEventListener('change', function () {
      current.font = sel.value; applyTweaks(current); saveTweaks(current);
    });
    return panel;
  }

  // Host protocol: show/hide tweaks panel
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'tweaks:visibility' || d.type === 'tweaks-visibility') {
      buildPanel().style.display = d.visible ? 'block' : 'none';
    }
  });

  /* ---------- init ---------- */
  applyLang(getLang());

  /* hero entrance — gated so content is always visible if anims can't run */
  var codeHero = document.querySelector('.code-hero');
  if (codeHero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { codeHero.classList.add('anim'); });
    });
  }
})();
