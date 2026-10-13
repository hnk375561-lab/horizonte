# Rendimiento

Registro de decisiones y cambios de rendimiento. Hoy:

- Las páginas generadas (`index.html`, `privacidad.html`, `404.html`) llevan el CSS inline desde `scripts/estilos.css`. Solo `index.html` carga JavaScript propio (ver abajo); `privacidad.html` y `404.html` no.
- Tipografías autoalojadas en `fonts/` (`.woff2`, subconjunto latino); sin pedidos a Google Fonts.
- Sin imágenes todavía (P4).
- `reserva.html` es la única página con JavaScript (GSAP + Lenis desde `js/vendor/`, mismo origen).

Al sumar fotos o scripts, medir y anotar acá antes y después.
- `index.html` carga `js/secciones.js` y `js/mapa.js` con `defer` (sin dependencias). El comparador lee un JSON embebido (`#cmp-data`) generado desde `data/vehicles.json`.
- El mapa no pide Leaflet ni mosaicos hasta que la persona toca «Ver mapa» (`js/mapa.js`); el marcador es vectorial, sin imágenes.
- Medir y anotar acá el peso de `index.html` antes y después cuando haya fotos (P4).
- Catálogo: buscador, orden y contador en #unidades (js/secciones.js, sin dependencias). El estado va en la URL (?q=…&orden=…). Sin JavaScript se ven las 5 fichas completas. Probado con jsdom (búsqueda, 4 órdenes, sin resultados, limpiar); no se midió rendimiento ni se probó en navegador real.
