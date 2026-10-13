# Estado del sitio

Sitio estático generado desde `data/` (ver `README.md`): `index.html`, `reserva.html`, `privacidad.html` y `404.html`. Es una **demo no indexable** de Horizonte Automotores (María Grande, Entre Ríos), armada con información pública (`noindex`, ver `CLAUDE.md` regla 7).

## Estructura de index.html
Hero · Unidades · Comparador · Financiación · Tu usado · Contanos qué auto buscás · Guía · Visita · Nosotros · Contacto (con mapa). Ids: `unidades`, `comparador`, `financiacion`, `tu-usado`, `busqueda`, `guia`, `visita`, `nosotros`, `contacto`. `#tu-usado` solo existe si `services.published` tiene `permuta`; `#comparador` solo con 2 o más unidades.

## Reglas
Ver `CLAUDE.md`. Datos en `data/dealership.json` y `data/vehicles.json`; verificar con `npm test`.

## Pendiente
Ver `data/pendientes.json` y `golive/SECCIONES-PENDIENTES.md`. Bloqueantes: P1 (teléfono/WhatsApp), P4 (fotos), P5 (stock), más P15 (relación con el grupo).
