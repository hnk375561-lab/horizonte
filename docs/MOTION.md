# Sistema de movimiento

**GSAP = motor · ScrollTrigger = narrativa · Lenis = scroll.** Todo vive en `js/motion.js` (módulo ES) y solo importa `js/vendor/gsap-stack.js` (mismo origen, sin CDN).

- `js/motion/core.js` y `js/motion/vendor.js` los usa también `js/reserva.js`.
- `js/motion.js` define una escena por sección y, si la sección no existe en la página, no hace nada: hoy solo `reserva.html` lo carga.
- Respeta `prefers-reduced-motion`: sin animación, solo el estado final.

Para modificarlo, probar siempre con reduced-motion activado y desactivado.
