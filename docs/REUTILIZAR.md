# Reutilizar este sitio para otra agencia

Todo el motor es el mismo; lo que cambia son los datos.

1. Copiar el repo y borrar `.git`. Vaciar `golive/AFIRMACIONES-A-CONFIRMAR.md` y volver a llenarlo desde cero.
2. Reemplazos masivos de textos: copiar `docs/rebrand.ejemplo.json`, completarlo y correr
   ```bash
   node scripts/rebrand.mjs mi-mapa.json --dry   # simulacro
   node scripts/rebrand.mjs mi-mapa.json
   ```
3. Cargar `data/dealership.json`, `data/vehicles.json`, `data/sources.json` y `data/pendientes.json`; después `npm run build && npm test`.
4. Contenido: `docs/CONTENIDO.md`. Textos que prometen algo (permuta, financiación, 0 km…): `npm run audit` los lista para confirmarlos o borrarlos.
5. Identidad visual: `scripts/estilos.css` y `docs/IDENTIDAD.md`.
