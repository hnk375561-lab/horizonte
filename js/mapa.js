/* Horizonte Automotores · mapa bajo demanda, con fallback de teselas. */
(function () {
  'use strict';
  var root = document.querySelector('[data-leaflet]');
  if (!root || !window.L) return;
  var trigger = root.querySelector('[data-mapa-abrir]');
  var view = root.querySelector('.map-v');
  var status = root.querySelector('.map-m');
  if (!trigger || !view) return;
  trigger.hidden = false;
  trigger.addEventListener('click', function () {
    trigger.disabled = true;
    view.hidden = false;
    var lat = Number(root.dataset.lat), lng = Number(root.dataset.lng);
    var map = L.map(view, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], 15);
    var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' });
    tiles.on('tileerror', function () { if (status) status.textContent = 'No se pudieron cargar las teselas. Usá Google Maps o Waze.'; });
    tiles.addTo(map);
    L.circleMarker([lat, lng], { radius: 8, color: '#C6A15B', fillColor: '#E3C887', fillOpacity: 1, weight: 2 }).addTo(map);
    setTimeout(function () { map.invalidateSize(); }, 50);
    trigger.hidden = true;
  }, { once: true });
}());
