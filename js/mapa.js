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
    view.hidden = false; root.classList.add('is-open');
    var lat = Number(root.dataset.lat), lng = Number(root.dataset.lng);
    var map = L.map(view, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], 15);
    /* CARTO ya no sirve teselas sin clave de API: se usan las de OpenStreetMap (con el atributo requerido) y, si fallan, las de OSM Francia. */
    var attr = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';
    var fuentes = [
      { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', o: { maxZoom: 19, attribution: attr } },
      { url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', o: { maxZoom: 19, subdomains: 'abc', attribution: attr } }
    ];
    var k = 0, errores = 0, tiles = null;
    function capa() {
      if (tiles) map.removeLayer(tiles);
      errores = 0; tiles = L.tileLayer(fuentes[k].url, fuentes[k].o);
      tiles.on('tileerror', function () {
        errores++;
        if (errores < 3) return;
        if (k < fuentes.length - 1) { k++; capa(); return; }
        if (status) status.textContent = 'No se pudieron cargar las teselas. Usá Google Maps o Waze.';
      });
      tiles.on('load', function () { if (status && errores < 3) status.textContent = ''; });
      tiles.addTo(map);
    }
    capa();
    L.circleMarker([lat, lng], { radius: 8, color: '#f2d21b', fillColor: '#f2d21b', fillOpacity: 1, weight: 2 }).addTo(map);
    setTimeout(function () { map.invalidateSize(); }, 50); setTimeout(function () { map.invalidateSize(); }, 400);
    trigger.hidden = true;
  }
  trigger.addEventListener('click', function () {
    trigger.disabled = true;
    cargar(pintar, function () { trigger.disabled = false; if (status) status.textContent = 'No se pudo cargar el mapa. Usá Google Maps o Waze.'; });
  });
}());
