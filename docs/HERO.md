# Hero

El hero combina la identidad negro/amarillo de Horizonte con un carrusel de **cuatro fotografías originales** aportadas y autorizadas por el responsable. La navegación superior vuelve a ser HTML real; ya no se usa el mockup aplanado `images/hero/horizonte-hero-preview.png` ni zonas de clic invisibles.

## Recursos

- `images/hero/horizonte-slide-01.webp` a `horizonte-slide-04.webp`: cuatro vehículos/tomas distintos; no se repiten en las secciones de conversión.
- `js/hero-rail.js`: avance automático cada 3 segundos, controles anterior/siguiente y pausa/reanudación.
- `scripts/build-index.mjs`: HTML del carrusel y carga del script.
- `scripts/estilos.css`: composición responsive, transiciones y contraste.
- `docs/IMAGENES-HOME.md`: manifiesto de procedencia y asignación exclusiva de cada foto.

## Comportamiento

- El texto y los botones permanecen fijos; solo cambian las fotografías.
- El carrusel respeta `prefers-reduced-motion`, el modo de ahorro de datos y pestañas en segundo plano. La persona puede pausarlo o avanzar/retroceder.
- El primer archivo usa prioridad alta; los demás se cargan en forma diferida.
- El encuadre está en CSS; no se altera el original ni se inventan nombres o datos de stock.

## Mantenimiento

Para reemplazar una foto, usar otra imagen autorizada que no esté asignada a una sección distinta, conservar la asignación en `docs/IMAGENES-HOME.md` y no cambiar el contenido del vehículo con IA. Las originales recibidas son de 1440 px; una prueba de mejora generativa produjo menor resolución y alteró detalles del vehículo, por lo que se conservaron los originales y se optimizaron a WebP.

Después de cualquier cambio: `npm run build && npm test`.
