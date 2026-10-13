/* Horizonte Automotores · navegación de sitio y comportamiento mobile-first. */
(function () {
  'use strict';
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  document.documentElement.classList.toggle('save-data', saveData);
  /* Entrada editorial: reveal progresivo sin bloquear el contenido. */
  if ('IntersectionObserver' in window && !saveData && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var revealObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.15 });
    document.querySelectorAll('section h2, .car, .card, .ct-c, .visit-card, .reveal').forEach(function (node, index) {
      node.classList.add('reveal');
      node.style.transitionDelay = (Math.min(index % 6, 5) * 60) + 'ms';
      revealObserver.observe(node);
    });
  }
  /* Parallax contenido: solo hero, solo puntero fino y nunca en móvil/reduced motion. */
  if (!saveData && window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine) and (min-width: 701px)').matches && !(window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var parallaxHero = document.querySelector('.hero');
    if (parallaxHero) {
      var parallaxTick = false;
      window.addEventListener('scroll', function () {
        if (parallaxTick) return; parallaxTick = true;
        window.requestAnimationFrame(function () { var y = Math.min(12, window.scrollY * .035); parallaxHero.style.setProperty('--hero-parallax', y + 'px'); parallaxTick = false; });
      }, { passive: true });
    }
  }
  /* Guía: en celulares arranca plegada (salvo la primera tarjeta) para acortar el recorrido; en desktop, abierta. */
  if (window.matchMedia && window.matchMedia('(max-width: 699px)').matches) {
    Array.prototype.slice.call(document.querySelectorAll('details.gd')).forEach(function (d, i) { if (i > 0) d.removeAttribute('open'); });
  }
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  var close = function () {
    document.documentElement.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  var open = function () {
    document.documentElement.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  toggle.addEventListener('click', function () {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) close();
  });
  document.querySelectorAll('.nav-more').forEach(function (more) { more.addEventListener('toggle', function () { if (more.open) document.querySelectorAll('.nav-more').forEach(function (other) { if (other !== more) other.removeAttribute('open'); }); }); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { close(); toggle.focus(); }
  });
  document.addEventListener('click', function (event) {
    if (document.documentElement.classList.contains('menu-open') && !event.target.closest('header')) close();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) close();
  }, { passive: true });
})();
