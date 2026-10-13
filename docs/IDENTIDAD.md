# Identidad visual

Definida a partir del logotipo que entregó el responsable del proyecto. **El archivo del logo no está en el repo y no se usa como imagen**: solo se tomaron de él la paleta, el carácter tipográfico y el motivo. Cuando haya autorización escrita para usarlo (P4), se puede sumar como imagen.

## Tokens (implementados en `scripts/estilos.css` → inline en las páginas, y en `css/reserva.css`)
| Token | Valor | Uso |
|---|---|---|
| Negro (`--ink`, `--k0`…`--k4`) | `#0a1012` y escala fría hasta `#1f2a30` | Fondos, cabecera, pie, texto sobre amarillo |
| Amarillo sol (`--y`) | `#f2d21b` (hover `#ffe14d`) | Botón principal, etiquetas, palabras destacadas, bordes, sol |
| Blanco (`--s3`, `#f8f8f8`) | `#ffffff` / `#f8f8f8` | Títulos sobre negro; fondo de las secciones claras |
| Grises fríos | `#c3cbce`, `#9aa7ad`, `#5f6d74`, `#2b373d` | Texto secundario y bordes |

Regla de contraste: el amarillo es relleno o texto sobre negro; sobre fondo claro se usa como relleno con texto negro, nunca como texto.

## Tipografía y voz visual
- Títulos, etiquetas, botones y menú: en **mayúsculas**, peso 800, de Bricolage Grotesque; las etiquetas (`.ey`, `dt`, `label`) con mucho espaciado de letras, como «AUTOMOTORES» en el logo.
- Párrafos: Instrument Sans, sin mayúsculas. La palabra clave de cada título (`<em>`) va en amarillo (sobre negro) o con fondo amarillo (sobre claro).
- El texto de los párrafos no cambió: solo su estilo (regla 1 de `CLAUDE.md`).

## Forma y motivo
- **Sol sobre el horizonte**: semicírculo amarillo sobre una línea. Aparece en el isotipo de la cabecera (`.mark .sun`), en el favicon, en el hero (con franjas), en el 404 y en las pantallas de `reserva.html`.
- Línea de horizonte amarilla: borde inferior de la cabecera (4 px), del hero y borde superior del pie y de Contacto (6 px).
- Bloques con esquina cortada (`--cut`) y barra amarilla en el borde izquierdo o superior de tarjetas, unidades y formularios.
- Secciones pares en blanco `#f8f8f8` y el resto en negro, alternadas; Contacto siempre en negro con el panel de consulta en amarillo.

## Dónde cambiar cada cosa
- Páginas del inicio, privacidad y 404: `scripts/estilos.css` y marcado en `scripts/build-index.mjs` (luego `npm run build`).
- Reserva: `css/reserva.css` (y paleta heredada en `css/motion.css`).
- Mapa: color del marcador en `js/mapa.js`. Color de tema y manifest: `scripts/build-index.mjs`.

## Identidad v2 (12/10/2026)
Paleta tomada del logotipo (solo colores, no la imagen): tinta `#0a1012`, sol `#f2d21b`, hueso `#f8f8f8`. Tonos derivados: `#ffe14d` (sol claro, hover), `#fff3a1` (sol pálido), `#6e5d00` (sol oscuro para texto sobre claro), `#243138` (líneas sobre tinta).

Recursos: el sol sobre la línea del horizonte aparece en el logo de cabecera y pie, debajo de cada `h2` y en la página 404; la banda amarilla se usa en la barra de datos y en «Cómo comprar»; las cifras de «Nosotros» son bloques de tinta con base amarilla. Todo sale de `scripts/estilos.css` (bloque «Identidad v2»).
