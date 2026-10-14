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

  /* ---- dial del día: el sol recorre el arco de atención; fuera de horario se oculta tras el horizonte ---- */
  var dial = document.querySelector('[data-dial]');
  var lo = 24 * 60, hi = 0;
  semana.forEach(function (g) { g.rangos.forEach(function (r) { lo = Math.min(lo, min(r[0])); hi = Math.max(hi, min(r[1])); }); });
  lo = Math.floor(lo / 60) * 60; hi = Math.ceil(hi / 60) * 60;
  var CX = 210, CY = 196, R = 158;
  function pct(m) { return Math.max(0, Math.min(1, (m - lo) / (hi - lo))); }
  function pt(m, r) { var th = Math.PI * (1 - pct(m)); return [CX + (r || R) * Math.cos(th), CY - (r || R) * Math.sin(th)]; }
  function f1(n) { return n.toFixed(1); }
  function arco(m1, m2) {
    var p1 = pt(m1), p2 = pt(m2);
    return 'M' + f1(p1[0]) + ' ' + f1(p1[1]) + ' A' + R + ' ' + R + ' 0 0 1 ' + f1(p2[0]) + ' ' + f1(p2[1]);
  }
  function hhmm(a) { var h = a.getHours(), m = a.getMinutes(); return h + ':' + (m < 10 ? '0' : '') + m; }
  function lineaDelDia(a) {
    if (!dial || hi <= lo) return;
    var dia = a.getDay(), m = a.getHours() * 60 + a.getMinutes(), r = rangos(dia), h, i;
    var s = '<svg viewBox="0 0 420 262" focusable="false" role="presentation"><defs><clipPath id="hzCielo"><rect x="0" y="0" width="420" height="' + CY + '"/></clipPath>' +
      '<radialGradient id="hzGlow"><stop offset="0" stop-color="#f2d21b" stop-opacity=".55"/><stop offset="1" stop-color="#f2d21b" stop-opacity="0"/></radialGradient></defs>';
    s += '<path class="hz-d-base" d="' + arco(lo, hi) + '"/>';
    for (h = lo; h <= hi; h += 60) {
      var a1 = pt(h, R + 12), a2 = pt(h, R - 12);
      s += '<path class="hz-d-tick' + (h % 120 ? ' hz-d-tick--s' : '') + '" d="M' + f1(a1[0]) + ' ' + f1(a1[1]) + 'L' + f1(a2[0]) + ' ' + f1(a2[1]) + '"/>';
      if (h % 120 === 0) { var lb = pt(h, R - 30); s += '<text class="hz-d-lbl" x="' + f1(lb[0]) + '" y="' + f1(lb[1] + 4) + '" text-anchor="middle">' + (h / 60) + '</text>'; }
    }
    r.forEach(function (x) { s += '<path class="hz-d-open" d="' + arco(min(x[0]), min(x[1])) + '"/>'; });
    s += '<path class="hz-d-hz" d="M18 ' + CY + 'H402"/>';
    s += '<path class="hz-d-hz2" d="M64 ' + (CY + 9) + 'H356M116 ' + (CY + 18) + 'H304"/>';
    var hoyAbre = r.length ? min(r[0][0]) : null, hoyCierra = r.length ? min(r[r.length - 1][1]) : null;
    var dentro = false; r.forEach(function (x) { if (m >= min(x[0]) && m < min(x[1])) dentro = true; });
    var sp;
    if (m >= lo && m <= hi) sp = pt(m); else if (m < lo) sp = [CX - R, CY]; else sp = [CX + R, CY];
    var vis = r.length > 0 && (m >= lo && m <= hi);
    var cls = 'hz-d-sun' + (dentro ? ' is-open' : '') + (vis ? '' : ' is-set');
    if (r.length || m >= lo) {
      s += '<g clip-path="' + (vis ? '' : 'url(#hzCielo)') + '" class="' + cls + '"><circle class="hz-d-glow" cx="' + f1(sp[0]) + '" cy="' + f1(sp[1]) + '" r="44"/><circle class="hz-d-orb" cx="' + f1(sp[0]) + '" cy="' + f1(sp[1]) + '" r="13"/></g>';
    }
    s += '<text class="hz-d-clock" x="' + CX + '" y="' + (CY - 52) + '" text-anchor="middle">' + hhmm(a) + '</text>';
    s += '<text class="hz-d-cap" x="' + CX + '" y="' + (CY - 28) + '" text-anchor="middle">' + (r.length ? (dentro ? 'DENTRO DEL HORARIO' : 'FUERA DE HORARIO') : 'HOY NO ATENDEMOS') + '</text>';
    s += '<text class="hz-d-end" x="' + (CX - R) + '" y="' + (CY + 40) + '" text-anchor="middle">' + (hoyAbre != null ? 'abre ' + hora(r[0][0]) : '') + '</text>';
    s += '<text class="hz-d-end" x="' + (CX + R) + '" y="' + (CY + 40) + '" text-anchor="middle">' + (hoyCierra != null ? 'cierra ' + hora(r[r.length - 1][1]) : '') + '</text>';
    s += '</svg>';
    dial.innerHTML = s;
    dial.classList.toggle('is-open', dentro);
  }

  /* ---- barras de la semana: una pista por fila, con las franjas abiertas ---- */
  function barras() {
    var filas = document.querySelectorAll('tr[data-dias]');
    for (var i = 0; i < filas.length; i++) {
      if (filas[i].querySelector('.hz-bar')) continue;
      var d = +filas[i].getAttribute('data-dias').split(',')[0], rr = rangos(d);
      var td = document.createElement('td'); td.className = 'hz-bar-c'; td.setAttribute('aria-hidden', 'true');
      var b = div('hz-bar');
      rr.forEach(function (x) { var s = div('hz-bar-s'); s.style.left = (pct(min(x[0])) * 100) + '%'; s.style.width = ((pct(min(x[1])) - pct(min(x[0]))) * 100) + '%'; b.appendChild(s); });
      td.appendChild(b); filas[i].appendChild(td);
    }
  }
  function div(cls, txt) { var d = document.createElement('div'); if (cls) d.className = cls; if (txt != null) d.textContent = txt; return d; }

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
  barras();
  pintar();
  setInterval(pintar, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) pintar(); });
})();
