# Guía de mantenimiento — Horizonte Automotores

1. **Cero datos inventados.** Teléfonos, WhatsApp, horarios, precios, kilometrajes, servicios, reseñas y antigüedad solo se publican con confirmación escrita del dueño o con una fuente pública citada en `data/sources.json`. Si falta, el dato no se publica (y no se escribe "a confirmar" en el sitio).
2. **Todo dato nuevo se registra** en `golive/AFIRMACIONES-A-CONFIRMAR.md` (con fuente y fecha) y en `data/dealership.json` o `data/autos.json`.
3. **El sitio se genera.** `index.html`, `privacidad.html`, `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest` y `favicon.svg` salen de `scripts/build.mjs`. No se editan a mano: se cambia `data/` o `scripts/` y se corre `npm run build && npm test`. Los archivos generados se commitean (el workflow falla si no coinciden).
4. **Conflictos entre fuentes no se resuelven por cuenta propia.** Hoy: teléfono/WhatsApp y horario (ver `data/dealership.json` → `contact.conflicto` y `hours.conflicto`). El sitio no muestra el dato en disputa. `npm test` falla si aparece un número candidato sin `confirmadoPorDueno: true`.
5. **No cargar datos personales** del dueño ni de su familia (por ejemplo, la casilla de correo personal que aparece en Facebook).
6. **Fotos y logotipo:** solo con autorización escrita. Hoy no hay imágenes; el isotipo es provisorio.
7. **Demo vs. producción.** Mientras `publicacion.publicIndexing` sea `false`: `noindex` en las 3 páginas, `Disallow: /` en `robots.txt`, sin `sitemap.xml` y con aviso de demo. Para pasar a producción: ver `golive/PRODUCCION.md`; la puerta es `npm run test:prod`.
8. Los archivos internos (`data/`, `golive/`, `docs/`, `scripts/`, notas) no se publican: `scripts/build-site.mjs` copia solo una lista blanca a `_site/`.
