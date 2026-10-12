# Horizonte Automotores — sitio web

Sitio estático (HTML + CSS, **sin JavaScript de terceros, sin dependencias, sin npm install**) de Horizonte Automotores, concesionario de Av. Argentina 2021, María Grande, Entre Ríos. Estado actual: **demo no indexable** construida con información pública.

## Cómo funciona
Las páginas **se generan** desde los datos:

```
data/dealership.json  ─┐
data/autos.json       ─┼─► npm run build ─► index.html, privacidad.html, 404.html,
scripts/estilos.css   ─┘                    robots.txt, sitemap.xml*, site.webmanifest, favicon.svg
```
\* `sitemap.xml` solo existe cuando el sitio pasa a producción.

## Comandos (Node 20 o superior)
| Comando | Qué hace |
|---|---|
| `npm run build` | Regenera las páginas desde `data/` |
| `npm test` | Valida datos, enlaces, SEO de demo y que no haya datos sin fuente |
| `npm run test:prod` | Puerta de salida a producción (hoy falla a propósito: ver `data/pendientes.json`) |
| `npm run dev` | Servidor local en http://localhost:8080 |
| `npm run site` | Arma `_site/` con solo los archivos públicos |

## Publicar en GitHub Pages
1. Crear el repo, subir todo y hacer push a `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. El workflow `.github/workflows/pages.yml` regenera, valida y publica en `https://USUARIO.github.io/REPO/`.

## Qué falta para producción
Ver `data/pendientes.json` y `golive/PRODUCCION.md`. Lo bloqueante: teléfono/WhatsApp confirmados, fotos autorizadas, dominio y revisión legal.

## Cargar stock
Copiar el formato de `docs/autos.ejemplo.json` a `data/autos.json` (solo unidades confirmadas, con enlace a su publicación), luego `npm run build && npm test`.

## Documentación
- `CLAUDE.md`: reglas de mantenimiento.
- `docs/VERIFICACION-2026-10-12.md`: qué se verificó de la investigación OSINT y qué no coincidió.
- `docs/INVESTIGACION-OSINT-ORIGINAL.md`: la investigación tal como se recibió (solo referencia; contiene datos no verificados).
- `golive/`: afirmaciones a confirmar y pasos a producción.
