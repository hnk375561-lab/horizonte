# Rendimiento y QA — Horizonte Automotores

## Cambios aplicados

- Fuentes reducidas a dos archivos autoalojados: Cormorant Garamond e Inter.
- Imágenes futuras preparadas con `srcset`, dimensiones fijas y carga diferida.
- Parallax limitado al hero, escritorio y puntero fino; desactivado en móvil y `prefers-reduced-motion`.
- Sin video ni carrusel automático.
- CTA móvil fijo y drawer de filtros con interacción ligera.
- Build generado en modo demo con cinco unidades.

## Verificaciones disponibles

- `node --check scripts/build-index.mjs`: correcto.
- `npm run build`: correcto; genera cinco unidades.
- `npm test`: correcto; quedan únicamente avisos de pendientes de producción P4, P5, P11, P12 y P15.
- `npm run check:links`: 0 problemas automáticos; quedan enlaces externos/mapas para revisión manual.
- `npm run check:mobile`: script pendiente/no-op en este repositorio.
- `python3 scripts/qa-browser.py`: no ejecutable en este entorno porque falta el binario Chromium de Playwright; no se inventa una métrica Lighthouse.

La medición LCP/overflow en viewport reales queda pendiente de ejecutar cuando el responsable aporte las fotos autorizadas y exista un navegador Playwright disponible.
