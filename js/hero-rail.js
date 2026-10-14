/* Horizonte Automotores · carrusel del hero: cambia de foto solo, con puntos para elegir.
   Pausa al pasar el mouse, al enfocar o con la pestaña oculta. Sin auto-avance si hay reduced-motion. */
(function () {
  'use strict';
  var root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  var slides = [].slice.call(root.querySelectorAll('[data-hero-slide]'));
  if (slides.length < 2) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, timer = null, paused = false, dots = [];
  var nav = document.createElement('div');
  nav.className = 'hero-dots'; nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', 'Elegir fotografía');
  slides.forEach(function (s, k) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'Fotografía ' + (k + 1) + ' de ' + slides.length);
    b.addEventListener('click', function () { if (k !== i) { go(k); restart(); } });
    nav.appendChild(b); dots.push(b);
  });
  root.appendChild(nav);
  function go(k) {
    var prev = slides[i];
    k = (k + slides.length) % slides.length;
    if (k !== i && prev) { prev.classList.add('is-leaving'); setTimeout(function () { prev.classList.remove('is-leaving'); }, 900); }
    i = k;
    slides.forEach(function (s, n) {
      var on = n === i;
      s.classList.toggle('is-active', on);
      if (on) s.classList.remove('is-leaving');
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      var img = s.querySelector('img'); if (on && img && img.loading === 'lazy') img.loading = 'eager';
    });
    dots.forEach(function (d, n) { d.setAttribute('aria-current', n === i ? 'true' : 'false'); });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { if (reduce || paused || timer || document.hidden) return; timer = setInterval(function () { go(i + 1); }, 6500); }
  function restart() { stop(); start(); }
  root.addEventListener('mouseenter', function () { paused = true; stop(); });
  root.addEventListener('mouseleave', function () { paused = false; start(); });
  root.addEventListener('focusin', function () { paused = true; stop(); });
  root.addEventListener('focusout', function () { paused = false; start(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  var nx = slides[1].querySelector('img'); if (nx) nx.loading = 'eager';
  dots.forEach(function (d, n) { d.setAttribute('aria-current', n === 0 ? 'true' : 'false'); });
})();
