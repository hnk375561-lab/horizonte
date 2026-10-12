# Rendimiento

Registro de decisiones y cambios de rendimiento. Hoy:

- Las páginas generadas (`index.html`, `privacidad.html`, `404.html`) llevan el CSS inline desde `scripts/estilos.css` y no cargan JavaScript.
- Tipografías autoalojadas en `fonts/` (`.woff2`, subconjunto latino); sin pedidos a Google Fonts.
- Sin imágenes todavía (P4).
- `reserva.html` es la única página con JavaScript (GSAP + Lenis desde `js/vendor/`, mismo origen).

Al sumar fotos o scripts, medir y anotar acá antes y después.
