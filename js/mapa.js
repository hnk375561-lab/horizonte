/* Horizonte Automotores · mapa bajo demanda (Leaflet se carga solo al tocar «Ver mapa»), con fallback de teselas. */
(function () {
  'use strict';
  var root = document.querySelector('[data-leaflet]');
  if (!root) return;
  var trigger = root.querySelector('[data-mapa-abrir]');
  var view = root.querySelector('.map-v');
  var status = root.querySelector('.map-m');
  if (!trigger || !view) return;
  trigger.hidden = false;

  function cargar(ok, fallo) {
    if (window.L) return ok();
    if (root.dataset.css && !document.querySelector('link[data-leaflet-css]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = root.dataset.css; l.setAttribute('data-leaflet-css', ''); document.head.appendChild(l);
    }
    var s = document.createElement('script'); s.src = root.dataset.leaflet; s.onload = ok; s.onerror = fallo; document.head.appendChild(s);
  }
  function pintar() {
    view.hidden = false;
    var lat = Number(root.dataset.lat), lng = Number(root.dataset.lng);
    var map = L.map(view, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], 15);
    var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' });
    tiles.on('tileerror', function () { if (status) status.textContent = 'No se pudieron cargar las teselas. Usá Google Maps o Waze.'; });
    tiles.addTo(map);
    L.circleMarker([lat, lng], { radius: 8, color: '#f2d21b', fillColor: '#f2d21b', fillOpacity: 1, weight: 2 }).addTo(map);
    setTimeout(function () { map.invalidateSize(); }, 50);
    trigger.hidden = true;
  }
  trigger.addEventListener('click', function () {
    trigger.disabled = true;
    cargar(pintar, function () { trigger.disabled = false; if (status) status.textContent = 'No se pudo cargar el mapa. Usá Google Maps o Waze.'; });
  });
}());
