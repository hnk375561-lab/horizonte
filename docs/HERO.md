# Hero

Escena 100 % CSS (cielo de atardecer, sol sobre el horizonte del logotipo). No hay fotografía: las fotos las aporta el responsable a mano.

Para sumar una foto propia (con autorización escrita, ver `CLAUDE.md` regla 6): copiarla a `images/`, optimizada, y en `scripts/estilos.css`, regla `.hero` (única definición del fondo), cambiar `--hero-img:none` por `--hero-img:url(images/ARCHIVO.jpg)`. La foto se dibuja sobre los degradados del cielo.

Para que el texto siga legible sobre la foto, definir también `--hero-shade` (por ejemplo `rgba(6,10,13,.88)`): es un velo que va de izquierda a derecha encima de la foto y por defecto es transparente. Revisar contraste y recortes a 1440, 768 y 390 px (en móvil el texto ocupa todo el ancho, así que conviene un velo más fuerte).

Después: `npm run build && npm test`. No volver a definir `background` en otra regla `.hero`: la última gana y anula esta.
