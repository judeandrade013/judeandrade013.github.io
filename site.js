/* Jude Andrade — site behaviour.
   1 Theme (the inline script in <head> sets it before first paint)
   2 Header: shadow when scrolled, hides on scroll down, returns on scroll up
   3 Mobile menu dialog
   4 Copy email
   5 Case studies: reading depth, section rail, mobile section bar          */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* 1 ─ Theme */
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var meta = document.querySelector('meta[name="theme-color"]');
  var COLORS = { light: '#F5F2EA', dark: '#141414' };
  function saved() { var t = store('theme'); return t === 'light' || t === 'dark' ? t : null; }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', COLORS[theme]);
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', String(theme === 'dark'));
      var l = b.querySelector('.tt-label'); if (l) l.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }
  applyTheme(saved() || (media.matches ? 'dark' : 'light'));
  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store('theme', next); applyTheme(next);
    });
  });
  var onSystem = function (e) { if (!saved()) applyTheme(e.matches ? 'dark' : 'light'); };
  if (media.addEventListener) media.addEventListener('change', onSystem); else if (media.addListener) media.addListener(onSystem);
  var beforePrint = null;
  window.addEventListener('beforeprint', function () { beforePrint = root.getAttribute('data-theme'); root.setAttribute('data-theme', 'light'); });
  window.addEventListener('afterprint', function () { if (beforePrint) root.setAttribute('data-theme', beforePrint); beforePrint = null; });

  /* 2 ─ Header */
  var header = document.querySelector('.site-header');
  var lastY = window.scrollY, ticking = false;
  var menuOpen = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
      var hide = !menuOpen && y > 480 && y > lastY + 4 && !reduce.matches && !header.contains(document.activeElement);
      if (hide) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 480) header.classList.remove('is-hidden');
    }
    lastY = y;
    if (caseScroll) caseScroll();
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  if (header) header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  /* 3 ─ Menu */
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn && menu.showModal) {
    menuBtn.addEventListener('click', function () { menu.showModal(); menuOpen = true; menuBtn.setAttribute('aria-expanded', 'true'); });
    menu.addEventListener('close', function () { menuOpen = false; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); });
    menu.querySelectorAll('[data-close], .menu-list a').forEach(function (el) { el.addEventListener('click', function () { menu.close(); }); });
  }

  /* 4 ─ Copy email */
  var toast = document.querySelector('.toast');
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(say.t); say.t = setTimeout(function () { toast.classList.remove('is-on'); }, 2000);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { say('Email copied'); }, function () { say(text); });
      else say(text);
    });
  });

  /* 5 ─ Case studies */
  var caseScroll = null;
  var body = document.querySelector('.case-body');
  if (!body) return;
  var stages = [].slice.call(document.querySelectorAll('.stage'));
  var article = document.querySelector('[data-depth]');

  // reading depth
  var seg = document.querySelector('.seg');
  if (seg && article) {
    var buttons = [].slice.call(seg.querySelectorAll('button'));
    var allowed = buttons.map(function (b) { return b.value; });
    var setDepth = function (d, focus) {
      if (allowed.indexOf(d) < 0) d = 'full';
      article.setAttribute('data-depth', d);
      buttons.forEach(function (b) {
        var on = b.value === d;
        b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      stages.forEach(function (s) { s.classList.remove('is-open'); });
      document.querySelectorAll('.stage details.more').forEach(function (det) {
        if (d === 'deep') { det.open = true; det.dataset.auto = '1'; }
        else if (det.dataset.auto) { det.open = false; delete det.dataset.auto; }
      });
      if (caseScroll) caseScroll();
    };
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { store('depth', b.value); setDepth(b.value); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = buttons[(i + 1) % buttons.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = buttons[(i - 1 + buttons.length) % buttons.length];
        if (n) { e.preventDefault(); store('depth', n.value); setDepth(n.value, true); }
      });
    });
    setDepth(store('depth') || 'full');
    document.querySelectorAll('.expand').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var s = btn.closest('.stage'); s.classList.add('is-open');
        var first = s.querySelector('.stage-body > :not(.q)');
        if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
      });
    });
    // a link into hidden content opens its section
    var reveal = function () {
      var id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
      var el = document.getElementById(id); if (!el) return;
      var s = el.closest('.stage'); if (s && el.offsetParent === null) { s.classList.add('is-open'); el.scrollIntoView(); }
      var det = el.closest('details'); if (det) det.open = true;
    };
    window.addEventListener('hashchange', reveal); reveal();
  }

  // rail + mobile bar
  var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
  var rail = document.querySelector('.rail');
  var bar = document.querySelector('.railbar');
  var sheet = document.getElementById('sections');
  var sheetLinks = sheet ? [].slice.call(sheet.querySelectorAll('ol a')) : [];
  var rbN = bar && bar.querySelector('.rb-n'), rbS = bar && bar.querySelector('.rb-s');
  if (bar) document.body.classList.add('has-railbar');
  var current = -1;
  caseScroll = function () {
    var mark = window.innerHeight * 0.35, idx = 0;
    stages.forEach(function (s, i) { if (s.getBoundingClientRect().top <= mark) idx = i; });
    var r = body.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (mark - r.top) / Math.max(1, r.height - mark)));
    if (rail) rail.style.setProperty('--p', p.toFixed(3));
    if (bar) bar.style.setProperty('--p', p.toFixed(3));
    if (idx !== current) {
      current = idx;
      railLinks.concat(sheetLinks).forEach(function (a) {
        if (a.getAttribute('href') === '#' + stages[idx].id) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      if (rbN) rbN.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(stages.length).padStart(2, '0');
      if (rbS) rbS.textContent = stages[idx].getAttribute('data-name') || '';
    }
  };
  if (sheet && sheet.showModal && bar) {
    bar.querySelector('.railbar-btn').addEventListener('click', function () { sheet.showModal(); });
    sheet.querySelectorAll('[data-close], ol a').forEach(function (el) { el.addEventListener('click', function () { sheet.close(); }); });
  }
  caseScroll();
})();
