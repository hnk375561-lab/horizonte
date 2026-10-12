# Pasos a producción

La puerta de salida es `npm run test:prod`: falla mientras el sitio siga en modo demo o haya pendientes bloqueantes abiertos en `data/pendientes.json`.

## Antes de publicar
1. **P1 — Teléfono y WhatsApp:** el dueño confirma números. Cargar en `data/dealership.json` → `contact` (`phone`, `phoneTel` como `+54…`, `whatsApp` como `549…`) y `confirmadoPorDueno: true`. Al compilar aparecen los botones de WhatsApp y el teléfono.
2. **P4 — Fotos y logotipo:** recibir material y autorización escrita. Agregar `images/` y adaptar `scripts/build.mjs` (el validador ya exige `alt`, `width` y `height`).
3. **P11 — Dominio:** registrar el dominio, completar `publicacion.siteUrl` (`https://…/`).
4. **P12 — Privacidad:** revisión profesional de `privacidad.html`.
5. Resolver o descartar el resto de `data/pendientes.json` (horario, servicios, stock, correo, reseñas).

## Pasar a producción
1. En `data/dealership.json` → `publicacion`: `status: "produccion"`, `official: true`, `publicIndexing: true`, `siteUrl` completo.
2. `npm run build` (quita `noindex`, el aviso de demo y `Disallow: /`; crea `sitemap.xml`; agrega `canonical`).
3. `npm run test:prod` debe pasar.
4. Commit y push a `main`. Configurar el dominio propio en Settings → Pages (y el registro DNS).
5. Dar de alta el sitio en Google Search Console y enlazarlo desde Facebook, Instagram y la ficha de Google Maps.
