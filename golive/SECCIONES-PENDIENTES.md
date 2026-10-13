# Secciones pendientes

El sitio todavía no tiene estas secciones porque falta el dato confirmado (ver `data/pendientes.json`):

| Sección | Qué falta | Pendiente |
|---|---|---|
| Contacto por WhatsApp / teléfono | Confirmar cuál es el teléfono y cuál el WhatsApp | P1 |
| Horario de atención | Confirmar el horario vigente | P2 |
| Logotipo y paleta de marca | Isologotipo del dueño | P3 |
| Fotos de las unidades y del local | Autorización escrita de uso | P4 |
| Stock confirmado | Confirmar disponibilidad, precio y km de cada ficha | P5 |
| Reseñas y puntaje | No hay fuente verificada: no se publican | P10 |
| Entregas con prueba social | Fotos de entregas con autorización de los clientes y una cifra de reseñas con origen | P4, P10 |
| Conocé el local / el equipo | Fotos y videos del frente, el salón y las personas, con autorización | P4 |
| Historia | Año de inicio y texto de trayectoria | P9 |
| Próximos ingresos | Unidades nuevas con año, km y fotos | P5 |

## Secciones ya cargadas (octubre de 2026)
Comparador, Cómo comprar, Tu usado, Contanos qué auto buscás, Guía, Visita y mapa de Contacto. Salen de datos ya publicados (`data/vehicles.json`, `services.published`, dirección); no agregan afirmaciones nuevas del negocio. Pendientes asociados: P18 (revisión de la guía), P19 (coordenadas del mapa).

Al resolverse un pendiente: cargar el dato en `data/`, correr `npm run build && npm test` y registrarlo en `golive/AFIRMACIONES-A-CONFIRMAR.md`.
