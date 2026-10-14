/* Horizonte Automotores · fondos con fotografía en las secciones oscuras.
   Cada imagen se descarga y decodifica recién cuando la sección está cerca de la pantalla; sin background-attachment:fixed. */
(function () {
  'use strict';
  if (navigator.connection && navigator.connection.saveData) return;
  var MAPA = [
    ['#guia', 'images/stock/cruze-1440.webp', 'images/stock/cruze-1080.webp', 'linear-gradient(rgba(10,16,18,.80),rgba(10,16,18,.90))'],
    ['#visita', 'images/stock/sonic-1440.webp', 'images/stock/sonic-1080.webp', 'linear-gradient(rgba(10,16,18,.78),rgba(10,16,18,.88))'],
    ['#contacto', 'images/stock/peugeot-207-1440.webp', 'images/stock/peugeot-207-1080.webp', 'linear-gradient(rgba(10,16,18,.80),rgba(10,16,18,.90))'],
    ['footer', 'images/stock/fox-1440.webp', 'images/stock/fox-1080.webp', 'linear-gradient(rgba(10,16,18,.84),rgba(10,16,18,.92))']
  ];
  var movil = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  function cargar(el, cfg) {
    var url = movil ? cfg[2] : cfg[1], im = new Image();
    im.decoding = 'async';
    im.onload = function () {
      var poner = function () { var d = el.querySelector(':scope > .hz-bgimg'); if (d) { d.style.backgroundImage = cfg[3] + ',url("' + url + '")'; requestAnimationFrame(function () { d.classList.add('is-on'); }); } };
      (im.decode ? im.decode().then(poner, poner) : poner());
    };
    im.src = url;
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); cargar(e.target, e.target.__hzbg); } });
  }, { rootMargin: '900px 0px' }) : null;
  MAPA.forEach(function (cfg) {
    var el = document.querySelector(cfg[0]); if (!el) return;
    el.classList.add('hz-bgh');
    var d = document.createElement('div'); d.className = 'hz-bgimg'; d.setAttribute('aria-hidden', 'true');
    el.insertBefore(d, el.firstChild);
    el.__hzbg = cfg;
    io ? io.observe(el) : cargar(el, cfg);
  });
})();
