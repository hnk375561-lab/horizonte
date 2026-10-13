/* Horizonte Automotores · navegación de sitio y comportamiento mobile-first. */
(function () {
  'use strict';
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
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { close(); toggle.focus(); }
  });
  document.addEventListener('click', function (event) {
    if (document.documentElement.classList.contains('menu-open') && !event.target.closest('header')) close();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) close();
  }, { passive: true });

  /* FAB de WhatsApp: aparece solo cuando suma. Se oculta (a) sobre el hero, (b) donde la página ya
     muestra un CTA de contacto a la vista (catálogo, formularios, visita, contacto, barra del comparador)
     y (c) mientras se escribe en un campo, para no tapar controles ni el teclado en mobile. */
  var fab = document.querySelector('.fab');
  if (!fab) return;
  var hidden = { hero: false, zone: 0, typing: false };
  var render = function () {
    var visible = !hidden.hero && hidden.zone === 0 && !hidden.typing;
    document.body.classList.toggle('fab-visible', visible);
    fab.tabIndex = visible ? 0 : -1;
    fab.setAttribute('aria-hidden', visible ? 'false' : 'true');
  };
  var isField = function (el) { return !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== 'checkbox' && el.type !== 'radio'; };
  document.addEventListener('focusin', function (e) { hidden.typing = isField(e.target); render(); });
  document.addEventListener('focusout', function () { hidden.typing = false; render(); });
  if (!('IntersectionObserver' in window)) { hidden.hero = false; render(); return; }
  var hero = document.querySelector('.hero');
  hidden.hero = !!hero;
  render();
  if (hero) new IntersectionObserver(function (entries) {
    hidden.hero = entries[0].isIntersecting; render();
  }, { threshold: 0.05 }).observe(hero);
  var inside = new Set();
  var zones = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.isIntersecting ? inside.add(en.target) : inside.delete(en.target); });
    hidden.zone = inside.size; render();
  }, { rootMargin: '-20% 0px -20% 0px' });
  document.querySelectorAll('#unidades, #como-comprar, #guia, #preguntas, #tu-usado, #busqueda, #visita, #contacto, .tray').forEach(function (el) { zones.observe(el); });
})();
