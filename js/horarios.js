/* Horizonte Automotores · js/horarios.js
   Sección «Horarios y ubicación»: estado «Abierto ahora / Cerrado ahora» según el horario de data/dealership.json
   (viaja en data-semana), línea de tiempo del día y resaltado de hoy en la tabla. Hora de Argentina (UTC-3, sin
   horario de verano). Sin red ni cookies. Expone window.hzEstado() para que otras partes (la ficha) lean el estado. */
(function () {
  'use strict';
  var src = document.querySelector('[data-semana]');
  if (!src) return;
  var semana;
  try { semana = JSON.parse(src.getAttribute('data-semana')); } catch (e) { return; }
  if (!semana || !semana.length) return;
  var NOMBRES = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  function min(t) { var p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function hora(t) { return t.replace(/^0/, ''); }
  function rangos(dia) {
    for (var i = 0; i < semana.length; i++) if (semana[i].dias.indexOf(dia) !== -1) return semana[i].rangos;
    return [];
  }
  function ahora() {
    var n = new Date();
    return new Date(n.getTime() + n.getTimezoneOffset() * 60000 - 3 * 3600000);
  }
  function dur(m) {
    var h = Math.floor(m / 60), r = m % 60;
    if (h && r) return h + ' h ' + r + ' min';
    return h ? h + ' h' : r + ' min';
  }
  function estado() {
    var a = ahora(), dia = a.getDay(), m = a.getHours() * 60 + a.getMinutes(), r = rangos(dia), i;
    for (i = 0; i < r.length; i++) if (m >= min(r[i][0]) && m < min(r[i][1])) {
      return { abierto: true, titulo: 'Abierto ahora', detalle: 'Cierra a las ' + hora(r[i][1]) + ' · faltan ' + dur(min(r[i][1]) - m), txt: 'Abierto ahora · cierra a las ' + hora(r[i][1]) };
    }
    for (i = 0; i < r.length; i++) if (m < min(r[i][0])) {
      return { abierto: false, titulo: 'Cerrado ahora', detalle: 'Abre hoy a las ' + hora(r[i][0]) + ' · en ' + dur(min(r[i][0]) - m), txt: 'Cerrado ahora · abre hoy a las ' + hora(r[i][0]) };
    }
    for (var k = 1; k <= 7; k++) {
      var d = (dia + k) % 7, rr = rangos(d);
      if (rr.length) {
        var cuando = k === 1 ? 'mañana' : NOMBRES[d];
        return { abierto: false, titulo: 'Cerrado ahora', detalle: 'Abre ' + cuando + ' a las ' + hora(rr[0][0]), txt: 'Cerrado ahora · abre ' + cuando + ' a las ' + hora(rr[0][0]) };
      }
    }
    return { abierto: false, titulo: 'Cerrado ahora', detalle: '', txt: 'Cerrado ahora' };
  }
  window.hzEstado = estado;

  /* ---- línea de tiempo del día: franjas abiertas y marca de «ahora» ---- */
  var tl = document.querySelector('[data-tl]');
  var lo = 24 * 60, hi = 0;
  semana.forEach(function (g) { g.rangos.forEach(function (r) { lo = Math.min(lo, min(r[0])); hi = Math.max(hi, min(r[1])); }); });
  lo = Math.floor(lo / 60) * 60; hi = Math.ceil(hi / 60) * 60;
  function div(cls, txt) { var d = document.createElement('div'); if (cls) d.className = cls; if (txt != null) d.textContent = txt; return d; }
  function pct(m) { return Math.max(0, Math.min(100, (m - lo) / (hi - lo) * 100)); }
  function lineaDelDia(a) {
    if (!tl || hi <= lo) return;
    var dia = a.getDay(), m = a.getHours() * 60 + a.getMinutes(), r = rangos(dia), i;
    tl.textContent = '';
    tl.appendChild(div('hz-tl-c', 'Hoy, ' + DIAS[dia].toLowerCase()));
    var pista = div('hz-tl-p');
    if (!r.length) pista.appendChild(div('hz-tl-x', 'Hoy no atendemos'));
    r.forEach(function (x) {
      var s = div('hz-tl-s'); s.style.left = pct(min(x[0])) + '%'; s.style.width = (pct(min(x[1])) - pct(min(x[0]))) + '%';
      s.appendChild(div('hz-tl-h', hora(x[0]) + ' – ' + hora(x[1]))); pista.appendChild(s);
    });
    if (m >= lo && m <= hi) { var n = div('hz-tl-n'); n.style.left = pct(m) + '%'; pista.appendChild(n); }
    tl.appendChild(pista);
    var esc = div('hz-tl-e');
    for (var h = lo; h <= hi; h += 120) { var t = div('hz-tl-t', Math.floor(h / 60) + ' h'); t.style.left = pct(h) + '%'; esc.appendChild(t); }
    tl.appendChild(esc);
  }

  function pintar() {
    var a = ahora(), e = estado(), dia = String(a.getDay()), i;
    var els = document.querySelectorAll('[data-estado]');
    for (i = 0; i < els.length; i++) {
      els[i].textContent = e.txt;
      els[i].setAttribute('data-abierto', e.abierto ? '1' : '0');
      els[i].hidden = false;
    }
    var ts = document.querySelectorAll('[data-estado-t]'), ds = document.querySelectorAll('[data-estado-d]'), lv = document.querySelectorAll('[data-live]');
    for (i = 0; i < ts.length; i++) ts[i].textContent = e.titulo;
    for (i = 0; i < ds.length; i++) { ds[i].textContent = e.detalle; ds[i].hidden = !e.detalle; }
    for (i = 0; i < lv.length; i++) { lv[i].setAttribute('data-abierto', e.abierto ? '1' : '0'); lv[i].setAttribute('data-listo', '1'); }
    var filas = document.querySelectorAll('tr[data-dias]');
    for (i = 0; i < filas.length; i++) {
      var on = filas[i].getAttribute('data-dias').split(',').indexOf(dia) !== -1;
      if (on) filas[i].classList.add('hoy'); else filas[i].classList.remove('hoy');
    }
    lineaDelDia(a);
  }
  pintar();
  setInterval(pintar, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) pintar(); });
})();
