# Fotografías de la portada y conversiones

Autorización escrita del responsable del proyecto: ZIP adjunto el 13/10/2026 para usar fotografías reales en el hero, «Entregá tu usado» y «Contanos qué auto buscás». Instrucción expresa del 13/10/2026: usar también los activos vehiculares existentes que no estaban asignados en financiación y presentar las fotos de conversión como fondos de sus respectivas secciones. Se usan originales reencodificados a WebP sin retocar los vehículos. **Cada toma mantiene una única sección asignada y no se reutiliza en otra.**

| Uso exclusivo | Archivo publicado | Archivo de origen del ZIP | Resolución original |
|---|---|---|---:|
| Hero · diapositiva 1 | `images/hero/horizonte-slide-01.webp` | `747526662_18121547878748177_146803315883064057_n.heic` | 1440 × 1920 |
| Hero · diapositiva 2 | `images/hero/horizonte-slide-02.webp` | `773662503_18124269553748177_4339445926857697863_n.heic` | 1440 × 1920 |
| Hero · diapositiva 3 | `images/hero/horizonte-slide-03.webp` | `765573466_18123425344748177_7414237879643367149_n.heic` | 1440 × 1920 |
| Hero · diapositiva 4 | `images/hero/horizonte-slide-04.webp` | `840264294_18129862399748177_1930361810460140633_n.heic` | 1440 × 1440 |
| `#financiacion` · fondo (desktop) | `images/hero/horizonte-financiacion.webp` | `742489649_18121880497748177_4634687994828320942_n.heic` (reemplaza al activo anterior de 960 × 720, instrucción del 13/10/2026) | 1440 × 1920 |
| `#financiacion` · fondo (móvil) | `images/hero/horizonte-financiacion-mobile.webp` | Misma toma, 1000 × 1333 | 1000 × 1333 |
| `#tu-usado` | `images/conversion/tu-usado.webp` | `758572657_18122944897748177_1014507733274748369_n.heic` | 1440 × 1920 |
| `#busqueda` | `images/conversion/busqueda.webp` | `777064701_18124904371748177_6258504343910198683_n.heic` | 1440 × 1920 |

La numeración se mantiene sincronizada con `scripts/build-index.mjs`. Las fotos de `#tu-usado` y `#busqueda` se aplican como fondo de su propia sección, no se duplican como tarjetas. No se añade texto de marca/modelo a las fotos ni se presenta ninguna como parte del stock vigente.

## Stock · fotos de las unidades (13/10/2026)

Instrucción expresa del responsable del proyecto (13/10/2026): usar las capturas de las publicaciones «Nuevo ingreso» de @horizonte_automotores como especificaciones del stock y las fotografías originales del ZIP (mayor calidad) como foto de cada unidad. Se derivan a WebP cuadrado (720, 1080 y 1440 px) en `images/stock/`; las fichas están en `data/vehicles.json` (campo `fotos`). El Amarok comparte la toma con la diapositiva 4 del hero por indicación expresa.

| Unidad | Archivo de origen del ZIP |
|---|---|
| Volkswagen Saveiro 1.6 C/Ext Full | `837039709_18129677737748177_…_n.heic` |
| Peugeot 408 1.6 Allure Plus | `831400912_18129261475748177_…_n.heic` |
| Volkswagen Fox Highline | `829602619_18129161434748177_…_n.heic` |
| Chevrolet Cruze 1.4T LTZ | `829873447_18128973391748177_…_n.heic` |
| Chevrolet Prisma Joy | `819811644_18128365651748177_…_n.heic` |
| Chevrolet Classic LS Full | `809876545_18127577269748177_…_n.heic` |
| Chevrolet Spin 1.8 LTZ 7AS | `801963554_18127080979748177_…_n.heic` |
| Peugeot 207 1.4 Compact Xs | `846737521_18130437703748177_…_n.heic` |
| Chevrolet Sonic LTZ 1.6 | `841886022_18130039006748177_…_n.heic` |
| Volkswagen Amarok 4x4 Highline | `840264294_18129862399748177_…_n.heic` |

Datos no publicados en la fuente (precio, y kilometraje en 408, Sonic y Amarok) se omiten; no se completan.
