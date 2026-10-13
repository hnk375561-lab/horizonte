/* Horizonte Automotores · js/mapa.js
   Mapa de «Dónde encontrarnos» con Leaflet (js/vendor/). No se descarga ni Leaflet ni ningún mosaico
   hasta que la persona toca «Ver mapa». Marcador vectorial (sin imágenes). Mosaicos de OpenStreetMap. */
(function () {
  'use strict';
  var box = document.getElementById('mapa');
  if (!box) return;
  var btn = box.querySelector('[data-mapa-abrir]'), view = box.querySelector('.map-v'), msg = box.querySelector('.map-m');
  if (!btn || !view) return;
  var lat = parseFloat(box.getAttribute('data-lat')), lng = parseFloat(box.getAttribute('data-lng'));
  if (isNaN(lat) || isNaN(lng)) return;
  btn.hidden = false;
  var cargando = false;

  function falla() {
    cargando = false; btn.disabled = false; btn.textContent = 'Ver mapa';
    if (msg) msg.textContent = 'No se pudo cargar el mapa. Podés abrir la ubicación en Google Maps o en Waze.';
  }
  function dibujar() {
    try {
      view.hidden = false;
      var m = L.map(view, { scrollWheelZoom: false }).setView([lat, lng], 17);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>' }).addTo(m);
      L.circleMarker([lat, lng], { radius: 10, color: '#f4f4f2', weight: 3, fillColor: '#0d0d0d', fillOpacity: 1 }).addTo(m);
      btn.hidden = true; if (msg) msg.textContent = '';
      m.invalidateSize();
    } catch (e) { view.hidden = true; falla(); }
  }
  btn.addEventListener('click', function () {
    if (cargando) return;
    cargando = true; btn.disabled = true; btn.textContent = 'Cargando mapa…';
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = box.getAttribute('data-css');
    document.head.appendChild(css);
    var s = document.createElement('script'); s.src = box.getAttribute('data-leaflet'); s.onload = dibujar; s.onerror = falla;
    document.head.appendChild(s);
  });
})();
