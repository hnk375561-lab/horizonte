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
})();
