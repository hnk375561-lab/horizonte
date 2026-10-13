# Coordiná tu visita

Página independiente: [`/reserva.html`](../reserva.html), generada por `scripts/build-index.mjs`. Arma un mensaje de **consulta de visita** (día y franja); no confirma turnos.

## Cómo funciona el envío
- Si en `data/dealership.json` → `contact` hay `whatsApp` y `confirmadoPorDueno: true`, el botón abre WhatsApp con el mensaje armado. El número viaja en el atributo `data-wa` del botón: no está escrito en `js/reserva.js`.
- Si no, el botón **copia el mensaje** para pegarlo en Facebook o Instagram.
- Desde el 12/10/2026 el calendario respeta `hours.semana` de `data/dealership.json`: los días sin atención (domingo) quedan deshabilitados y los sábados solo ofrecen la franja de mañana. Se leen de `data-closed` y `data-morning-only` del `<main>`.

## Configuración
`CONFIG` al inicio de `js/reserva.js`: franjas del día y texto de aviso.

## Rendimiento
Calendario de 42 celdas como máximo, animaciones solo con `transform` y `opacity`, sin trackers ni backend, `prefers-reduced-motion` respetado.
