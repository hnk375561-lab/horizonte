# Cargar el contenido real de Horizonte

Horizonte publica en Facebook (`facebook.com/horizonteautos`) e Instagram (`@horizonte_automotores`), y el Grupo Almafuerte lista unidades en `grupoalmafuerte.com/autos-usados/`. Todo lo que sale de ahí es contenido del negocio: pedir autorización de uso antes de reutilizarlo (reglas 1 y 6 de `CLAUDE.md`).

## Unidades
1. Copiar el formato de `docs/vehicles.ejemplo.json` en `data/vehicles.json`: título, año, km, transmisión, combustible, color, precio con fecha y `url` de la ficha pública.
2. Anotar solo lo que dice la publicación; nunca completar de memoria. Si hay contradicciones, la ficha va a `data/autos-en-revision.json` y no se muestra.
3. `npm run build && npm test`.

## Fotos
Hoy el sitio no muestra fotos (P4). Cuando haya autorización:
```bash
npm install                                          # una vez (instala sharp)
node scripts/make-images.mjs <slug> ./carpeta-con-fotos
```
Genera `images/<slug>-N.webp` y las variantes `-800` y `-480`. Falta conectar las imágenes en `scripts/build-index.mjs`.

## Datos de contacto
Teléfono, WhatsApp y horario: ver `golive/SECCIONES-PENDIENTES.md`.
