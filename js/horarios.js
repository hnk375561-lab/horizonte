/* Horizonte Automotores · js/horarios.js
   Muestra «Abierto ahora / Cerrado ahora» según el horario de data/dealership.json (viaja en data-semana)
   y resalta el día de hoy en la tabla. Hora de Argentina (UTC-3, sin horario de verano). Sin red ni cookies. */
(function () {
  'use strict';
  var src = document.querySelector('[data-semana]');
  if (!src) return;
  var semana;
  try { semana = JSON.parse(src.getAttribute('data-semana')); } catch (e) { return; }
  if (!semana || !semana.length) return;
  var NOMBRES = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];

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
  function estado() {
    var a = ahora(), dia = a.getDay(), m = a.getHours() * 60 + a.getMinutes(), r = rangos(dia), i;
    for (i = 0; i < r.length; i++) if (m >= min(r[i][0]) && m < min(r[i][1])) return { abierto: true, txt: 'Abierto ahora · cierra a las ' + hora(r[i][1]) };
    for (i = 0; i < r.length; i++) if (m < min(r[i][0])) return { abierto: false, txt: 'Cerrado ahora · abre hoy a las ' + hora(r[i][0]) };
    for (var k = 1; k <= 7; k++) {
      var d = (dia + k) % 7, rr = rangos(d);
      if (rr.length) return { abierto: false, txt: 'Cerrado ahora · abre ' + (k === 1 ? 'mañana' : NOMBRES[d]) + ' a las ' + hora(rr[0][0]) };
    }
    return { abierto: false, txt: 'Cerrado ahora' };
  }
  function pintar() {
    var e = estado(), dia = String(ahora().getDay()), els = document.querySelectorAll('[data-estado]'), i;
    for (i = 0; i < els.length; i++) {
      els[i].textContent = e.txt;
      els[i].setAttribute('data-abierto', e.abierto ? '1' : '0');
      els[i].hidden = false;
    }
    var filas = document.querySelectorAll('tr[data-dias]');
    for (i = 0; i < filas.length; i++) {
      var on = filas[i].getAttribute('data-dias').split(',').indexOf(dia) !== -1;
      if (on) filas[i].classList.add('hoy'); else filas[i].classList.remove('hoy');
    }
  }
  pintar();
  setInterval(pintar, 60000);
})();
