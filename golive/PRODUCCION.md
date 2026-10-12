# Pasos a producción

La puerta de salida es `npm run test:prod`: falla mientras el sitio siga en modo demo o haya pendientes bloqueantes abiertos en `data/pendientes.json`.

## Antes de publicar
1. **P15 — Marca:** definir con el dueño si el sitio representa a Horizonte Automotores o a la sucursal «Concesionario Usados María Grande» del Grupo Almafuerte, y la redacción autorizada de la relación. Esto decide nombre, logotipo, dominio, reseñas y contacto.
2. **P1 — Teléfono y WhatsApp:** el dueño confirma números. Cargar en `data/dealership.json` → `contact` (`phone`, `phoneTel` como `+54…`, `whatsApp` como `549…`) y `confirmadoPorDueno: true`. Al compilar aparecen los botones de WhatsApp y el teléfono. Si elige el WhatsApp de usados del grupo, el valor es `5493436109949`.
3. **P5 — Stock:** confirmar con el vendedor disponibilidad, precio, km y sucursal de las fichas de `data/autos.json`; recorrer `https://grupoalmafuerte.com/autos-usados/` completo; aclarar las 3 fichas de `data/autos-en-revision.json`.
4. **P4 — Fotos y logotipo:** recibir material y autorización escrita. Agregar `images/` y adaptar `scripts/build.mjs` (el validador ya exige `alt`, `width` y `height`).
5. **P11 — Dominio:** registrar el dominio, completar `publicacion.siteUrl` (`https://…/`).
6. **P12 — Privacidad:** revisión profesional de `privacidad.html`.
7. Resolver o descartar el resto de `data/pendientes.json` (horario, servicios, correo, reseñas, CCA).

## Pasar a producción
1. En `data/dealership.json` → `publicacion`: `status: "produccion"`, `official: true`, `publicIndexing: true`, `siteUrl` completo.
2. `npm run build` (quita `noindex`, el aviso de demo y `Disallow: /`; crea `sitemap.xml`; agrega `canonical`).
3. `npm run test:prod` debe pasar.
4. Commit y push a `main`. Configurar el dominio propio en Settings → Pages (y el registro DNS).
5. Dar de alta el sitio en Google Search Console y enlazarlo desde Facebook, Instagram y la ficha de Google Maps.
