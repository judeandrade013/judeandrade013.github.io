/* Light/dark theme toggle.
   The inline script in each page's <head> sets data-theme before first paint
   (saved choice, otherwise the system setting), so there is no flash.
   This file wires up the nav button and follows system changes until the
   visitor makes a choice of their own. */
(function () {
  'use strict';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var meta = document.querySelector('meta[name="theme-color"]');
  var COLORS = { light: '#FAF8F3', dark: '#16191F' };

  function saved() {
    try { var t = localStorage.getItem('theme'); return t === 'light' || t === 'dark' ? t : null; }
    catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', COLORS[theme]);
    var dark = theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
    });
  }

  apply(saved() || (media.matches ? 'dark' : 'light'));

  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      apply(next);
    });
  });

  // print on the light palette, then restore
  var beforePrint = null;
  window.addEventListener('beforeprint', function () { beforePrint = root.getAttribute('data-theme'); root.setAttribute('data-theme', 'light'); });
  window.addEventListener('afterprint', function () { if (beforePrint) root.setAttribute('data-theme', beforePrint); beforePrint = null; });

  var onSystem = function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); };
  if (media.addEventListener) media.addEventListener('change', onSystem);
  else if (media.addListener) media.addListener(onSystem);
})();
