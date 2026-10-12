# Actualización con el Archivo Maestro V2 — 12/10/2026

Fuente: `docs/ARCHIVO-MAESTRO-V2.txt` (copia del archivo recibido). Complementa a `VERIFICACION-2026-10-12.md`, que sigue vigente.

## Qué cambió en el sitio
- **Grupo Almafuerte:** el sitio oficial del grupo lista Av. Argentina 2021 como «Concesionario Usados María Grande». Pasa a ser fuente pública citada: el sitio dice «Grupo Almafuerte» (antes «Grupo Automóviles Almafuerte», que sigue en la biografía de Instagram; ver P7) y enlaza al grupo.
- **Servicios atribuidos al grupo:** toma de usados como parte de pago, tasación sin cargo, revisión técnica y garantía (condiciones según vehículo). Cada uno tiene `clave` y `fuente` en `services.published`.
- **Stock:** 5 de las 8 fichas «Disponible en María Grande» pasan a `data/vehicles.json` con fecha de relevamiento. Tres quedan apartadas en `data/autos-en-revision.json`:
  - Peugeot 1.6 Feline: el título no dice el modelo completo.
  - Volkswagen Camión 17.220: la cabecera dice María Grande, la FAQ dice Paraná.
  - Renault Sandero 2024: «0 km» y «Usado» a la vez; motor 1.6 frente a 1.3.
- **Validador:** acepta fichas de `grupoalmafuerte.com/producto/`, veta permuta/tasación/garantía si falta su `clave`, veta GWM/test drive y los verbos «adquirida/absorbida/renombrada», y comprueba que las fichas en revisión no se muestren.

## Qué sigue sin publicarse y por qué
- **Teléfono/WhatsApp:** ahora hay siete candidatos (ver `contact.conflicto`). El propio sitio del grupo da +54 9 3434 61-8388 en Nosotros y +54 9 3434 62-2671 en Contacto, y el WhatsApp de usados +54 9 3436 10-9949.
- **Horario:** el del grupo (L-V 8:30–12:30 y 15:30–19:30, S 8:30–13:00) es el más reciente y oficial, pero la regla del proyecto es no resolver conflictos por cuenta propia (P2).
- **Reseñas:** Yably 4,20/5 (17) y GTM 8.4 (27) no son comparables y la ficha podría ser del nombre histórico (P10).
- **CCA:** Horizonte figura en su listado con el 343 405-0787; falta confirmar afiliación vigente (P14).

## Diferencias entre la V2 y lo ya verificado
- La V2 no pudo abrir Facebook ni Instagram: no vio el teléfono 343 494-7176 de la ficha de Facebook ni la biografía de Instagram que este proyecto ya había verificado.
- La V2 trae «Grupo Almafuerte» como nombre del grupo; Instagram dice «Grupo Automóviles Almafuerte».
- El catálogo general `https://grupoalmafuerte.com/autos-usados/` no se pudo recorrer en la V2: las 8 fichas son las que indexó el buscador, no necesariamente todo el stock.
- La V2 no se volvió a contrastar en vivo al armar este paquete: los datos del grupo son los del 12/10/2026 según el archivo.
