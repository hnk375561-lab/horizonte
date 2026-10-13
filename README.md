# Horizonte Automotores — sitio web

Sitio estático (HTML + CSS; **sin JavaScript de terceros y sin dependencias para publicar**; JS propio en `index.html` (`js/secciones.js` y `js/mapa.js`) y en `reserva.html` (GSAP servido desde `js/vendor/`)) de Horizonte Automotores, concesionario de Av. Argentina 2021, María Grande, Entre Ríos. Estado actual: **demo no indexable** construida con información pública (incluye el sitio oficial de Grupo Almafuerte, del que forma parte).

## Cómo funciona
Las páginas **se generan** desde los datos:

```
data/dealership.json  ─┐
data/vehicles.json       ─┼─► npm run build ─► index.html, reserva.html, privacidad.html, 404.html,
scripts/estilos.css   ─┘                    robots.txt, sitemap.xml*, site.webmanifest, favicon.svg
```
\* `sitemap.xml` solo existe cuando el sitio pasa a producción.

## Estructura

```
.github/workflows/   pages.yml (publica en GitHub Pages) · verificar.yml (datos, generado, sintaxis, sitio)
css/                 reserva.css y motion.css (los usa reserva.html); el resto está reservado y vacío (P3)
data/                dealership.json · vehicles.json · autos-en-revision.json · historial.json · pendientes.json · sources.json
docs/                notas de trabajo e investigación (no se publica) · docs/archivo/
fonts/               tipografías autoalojadas + LICENSES.txt
golive/              pendientes y pasos a producción (no se publica)
js/                  secciones.js, mapa.js, reserva.js, motion.js, motion/ y vendor/ (GSAP, Leaflet); el resto está reservado y vacío
scripts/             build-index.mjs · validate-dealership.mjs · build-site.mjs · serve.mjs · estilos.css y utilitarios
raíz                 index.html, reserva.html, privacidad.html, 404.html (generados) · robots.txt · site.webmanifest
                     favicon.svg · CLAUDE.md · plan.md · PERF-CAMBIOS.md · LICENSE · package.json · _config.yml · netlify.toml
```

Los archivos de `css/`, `js/` y `scripts/` marcados como «reservados» existen para mantener la estructura y no tienen contenido hasta que haya identidad visual (`data/pendientes.json`, P3).

## Comandos (Node 20 o superior)
| Comando | Qué hace |
|---|---|
| `npm run build` | Regenera las páginas desde `data/` |
| `npm test` | Valida datos, enlaces, SEO de demo y que no haya datos sin fuente |
| `npm run test:prod` | Puerta de salida a producción (hoy falla a propósito: ver `data/pendientes.json`) |
| `npm run dev` | Servidor local en http://localhost:8080 |
| `npm run site` | Arma `_site/` con solo los archivos públicos |
| `npm run golive -- --dry` | Simula el paso a producción (no escribe nada) |
| `npm run audit` | Lista los textos que afirman algo del negocio, para confirmarlos o borrarlos |
| `npm run check:links` | Verifica enlaces internos y formatos |

## Publicar en GitHub Pages
1. Crear el repo, subir todo y hacer push a `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. El workflow `.github/workflows/pages.yml` regenera, valida y publica en `https://USUARIO.github.io/REPO/`.

## Qué falta para producción
Ver `data/pendientes.json` y `golive/PRODUCCION.md`. Lo bloqueante: marca y relación con el grupo (P15), teléfono/WhatsApp confirmados, stock confirmado, fotos autorizadas, dominio y revisión legal.

## Cargar stock
Hoy `data/vehicles.json` tiene 5 fichas del catálogo de Grupo Almafuerte (relevadas el 12/10/2026). Para sumar o cambiar unidades, seguir el formato de `docs/vehicles.ejemplo.json` (enlace a su ficha pública y fecha de relevamiento), luego `npm run build && npm test`. Las fichas con contradicciones están en `data/autos-en-revision.json` y no se muestran.

## Activar WhatsApp
Cuando el dueño confirme el número: en `data/dealership.json` → `contact`, cargar `whatsApp` (`549…`), `phone`/`phoneTel` si corresponde y `confirmadoPorDueno: true`; después `npm run build && npm test`.

## Documentación
- `CLAUDE.md`: reglas de mantenimiento.
- `plan.md`: estado actual. `PERF-CAMBIOS.md`: decisiones de rendimiento.
- `docs/RESERVA.md`, `docs/MOTION.md`, `docs/CONTENIDO.md`, `docs/REUTILIZAR.md`: cómo funcionan y se cargan las partes del sitio.
- `docs/VERIFICACION-2026-10-12.md`: qué se verificó de la investigación OSINT y qué no coincidió.
- `docs/ACTUALIZACION-V2-2026-10-12.md`: qué cambió con el Archivo Maestro V2 y qué sigue pendiente.
- `docs/ARCHIVO-MAESTRO-V2.txt`: la investigación V2 tal como se recibió (referencia; contiene datos sin confirmar).
- `docs/INVESTIGACION-OSINT-ORIGINAL.md`: la investigación tal como se recibió (solo referencia; contiene datos no verificados).
- `golive/`: afirmaciones a confirmar y pasos a producción.
