// Genera index.html, reserva.html, 404.html, privacidad.html, robots.txt, sitemap.xml, site.webmanifest y favicon.svg
// a partir de data/dealership.json y data/vehicles.json. Sin dependencias.
// Uso: npm run build   (después: npm test)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);
const D = JSON.parse(read('data/dealership.json'));
const A = JSON.parse(read('data/vehicles.json'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const demo = D.publicacion.publicIndexing === false;
const siteUrl = D.publicacion.siteUrl ? D.publicacion.siteUrl.replace(/\/?$/, '/') : null;
const NAME = D.identity.tradeName;
const L = D.location;
const C = D.contact;
const FB = C.facebook;
const IG = `https://www.instagram.com/${C.instagram}/`;
const GNAME = D.identity.grupo;
const GWEB = D.identity.grupoWeb;
const GCAT = D.stock.catalogoUrl;
const hasSvc = (k) => D.services.published.some((x) => x.clave === k);
const fdate = (iso) => iso.split('-').reverse().join('/');
const BNASVC = D.services.published.find((s) => s.fuente.includes('bna.com.ar'));
const BNA = BNASVC.fuente;
const BNAFECHA = BNASVC.periodo;
const wa = (txt) => (C.whatsApp ? `https://wa.me/${C.whatsApp}?text=${encodeURIComponent(txt)}` : null);
const WA = wa('Hola! Quiero consultar por las unidades disponibles.');
const EXT = 'target="_blank" rel="noopener noreferrer"';
const WAFORM = C.whatsApp ? `<a class="btn p" data-wa-msg data-wa="${C.whatsApp}" href="https://wa.me/${C.whatsApp}" ${EXT}>Enviar por WhatsApp</a>` : '';
const CPBTN = `<button class="btn${C.whatsApp ? '' : ' p'}" type="submit" data-copiar-msg hidden>Copiar mensaje</button>`;
const LEYENDA_CORTA = 'Demo ilustrativa · No es el sitio oficial';
const LEYENDA = `Demo ilustrativa construida a partir de información pública. Datos y disponibilidad sujetos a confirmación por ${NAME}. No es el sitio oficial.`;
const FONTS = '@font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:400 500;font-display:swap;src:url(fonts/cormorant-garamond-latin-400.woff2) format("woff2")}\n@font-face{font-family:"Inter";font-style:normal;font-weight:100 900;font-display:swap;src:url(fonts/inter-latin-var.woff2) format("woff2")}\n';
const CSS = read('scripts/estilos.css').trim();

const robotsMeta = demo ? '<meta name="robots" content="noindex, nofollow">\n' : '';
const canon = (p) => (siteUrl ? `<link rel="canonical" href="${siteUrl}${p}">\n<meta property="og:url" content="${siteUrl}${p}">\n` : '');

function page({ title, desc, body, file, withFonts = true, extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${robotsMeta}<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0a1012">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="es_AR">
${canon(file === 'index.html' ? '' : file)}${withFonts ? '<link rel="manifest" href="site.webmanifest">\n<link rel="icon" type="image/png" sizes="192x192" href="images/icon-192.png">\n<link rel="apple-touch-icon" href="images/icon-180.png">\n<link rel="preload" href="fonts/cormorant-garamond-latin-400.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>\n' : ''}<style>
${withFonts ? FONTS : ''}${CSS}
</style>
${extraHead}</head>
<body>
${body}
</body>
</html>
`;
}

const footer = (fuentes) => `<footer><div class="w">
<div class="ft"><div class="ft-m"><img class="lg-ft" src="images/logo-sm.png" width="360" height="144" alt=""><p class="ft-b">${esc(NAME)}</p><p>${esc(L.address)}, ${esc(L.city)}, ${esc(L.province)}</p><p class="ft-a">Antes: ${esc(L.direccionAnterior)}</p></div>
<div><p class="ft-k">Contacto</p>${C.phoneTel ? `<p><a href="tel:${C.phoneTel}">${esc(C.phone)}</a></p>` : ''}${C.whatsApp ? `<p><a href="${WA}" ${EXT}>WhatsApp ${esc(C.whatsAppDisplay)}</a></p>` : ''}${C.email ? `<p><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></p>` : ''}</div>
<div><p class="ft-k">Redes</p><p><a href="${FB}" ${EXT}>Facebook</a></p><p><a href="${IG}" ${EXT}>Instagram</a></p><p><a href="${GWEB}" ${EXT}>${esc(GNAME)}</a></p></div></div>
<p class="ft-c">© 2026 ${esc(NAME)}</p>${demo ? `<p class="demo-note" data-demo-note>${esc(LEYENDA)} Datos pendientes de confirmación.</p>` : ''}${fuentes ? `<p>Fuentes: <a href="${FB}" ${EXT}>Facebook</a> · <a href="${IG}" ${EXT}>Instagram</a> · <a href="${GWEB}" ${EXT}>${esc(GNAME)}</a> · <a href="${BNA}" ${EXT}>Listado de concesionarias de Créditos Más Autos (Banco Nación, ${esc(BNAFECHA)})</a></p>` : ''}<p><a href="privacidad.html">Privacidad y avisos</a></p></div></footer>`;

const autos = A.autos;
const ctaHead = WA ? { href: WA, t: 'WhatsApp' } : { href: FB, t: 'Facebook' };
const header = (pre = '', skip = '#unidades') => `<a class="skip" href="${skip}">Saltar al contenido</a>
<header><div class="w"><a class="mark" href="./" aria-label="${esc(NAME)}, inicio"><img class="lg-img" src="images/logo.png" width="900" height="360" alt="${esc(NAME)}"></a>
<nav class="site-nav" id="site-nav" aria-label="Principal"><a href="${pre}#unidades">Unidades</a><a href="${pre}#financiacion">Financiación</a><a href="${pre}#guia">Guía</a><a href="${pre}#preguntas">Preguntas</a><a href="${pre}#nosotros">Nosotros</a><a href="${pre}#contacto">Contacto</a><a href="${pre}#tu-usado">Tu usado</a><a href="${pre}#busqueda">Tu búsqueda</a><a href="${pre}#visita">Visita</a></nav>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle><span class="menu-icon" aria-hidden="true"></span><span>Menú</span></button>
<div class="hc"><a class="btn p sm" href="${ctaHead.href}" ${EXT}>${ctaHead.t}</a></div></div></header>
${demo ? `<p class="demo"><span>${esc(LEYENDA_CORTA)}</span></p>` : ''}`;

// ---- unidades ----
const fmt = (n) => n.toLocaleString('es-AR');
const norm = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const jsonSafe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
// Muestra de color solo para dibujar el punto junto al nombre del color publicado; no es un dato de la ficha.
const SW = { blanco: '#f1f1ee', negro: '#161b1d', rojo: '#c21f1f', 'gris plata': '#b4bbbe', plata: '#b4bbbe', gris: '#8a9296', azul: '#1e4a8c', verde: '#2f6b45', bordo: '#6d1a2a', beige: '#cdbb98', dorado: '#b99a45', naranja: '#d9742a', amarillo: '#e5c717', marron: '#6b4a32' };
const swatch = (c) => SW[norm(c || '')] || null;
const marcaDe = (a) => a.marca || a.titulo.split(' ')[0];
const sinMarca = (a) => { const m = marcaDe(a); return a.titulo.startsWith(m + ' ') ? a.titulo.slice(m.length + 1) : a.titulo; };
const consultaHref = (a) => wa(`Hola! Me interesa el ${a.titulo}${a.anio ? ' ' + a.anio : ''}.`) || a.url;
// Fotos opcionales: no se inventan ni se toman de terceros; solo se publican si data/ las autoriza.
const mediaDe = (a) => (Array.isArray(a.fotos) ? a.fotos : Array.isArray(a.imagenes) ? a.imagenes : Array.isArray(a.galeria) ? a.galeria : []).map((x) => typeof x === 'string' ? { src: x, alt: a.titulo } : x).filter((x) => x && (x.src || x.url)).map((x) => ({ src: x.src || x.url, srcset: x.srcset || '', alt: x.alt || a.titulo, tipo: x.tipo || '' }));
const mediaTag = (a, i) => { const m = mediaDe(a)[0]; return m ? `<figure class="car-ph"><img src="${esc(m.src)}"${m.srcset ? ` srcset="${esc(m.srcset)}"` : ''} sizes="(max-width: 700px) 100vw, 320px" width="${m.width || 900}" height="${m.height || 600}" loading="${i === 0 ? 'eager' : 'lazy'}"${i === 0 ? ' fetchpriority="high"' : ''} decoding="async" alt="${esc(m.alt)}"></figure>` : ''; };
const card = (a) => {
  const i = autos.indexOf(a);
  const marca = marcaDe(a);
  const sw = swatch(a.color);
  const fila = (k, v) => (v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : '');
  const pr = a.precio ? `<p class="pr">${a.precio.moneda === 'USD' ? 'US$ ' : '$ '}${fmt(a.precio.monto)}</p><p class="n">Precio publicado el ${esc(fdate(a.precio.fecha))}; puede haber cambiado.</p>` : '<p class="pr">Consultar precio</p>';
  const busca = norm([a.titulo, marca, a.modelo, a.version, a.cilindrada, a.color, a.anio].filter((x) => x !== undefined && x !== null && x !== '').join(' '));
  return `<li class="car reveal" style="--reveal-delay:${Math.min(i,5)*60}ms" data-t="${esc(busca)}" data-i="${i}">
${mediaTag(a, i)}
<div class="car-h"><span class="car-b">${esc(marca)}</span><label class="car-c" hidden><input type="checkbox" value="${i}" aria-label="Comparar ${esc(a.titulo)}"><span>Comparar</span></label></div>
<h3>${esc(sinMarca(a))}</h3>
<div class="car-s"><p><b${a.anio == null ? ' class="nd"' : ''}>${a.anio != null ? a.anio : 'Sin dato'}</b><small>Año</small></p><p><b${a.km == null ? ' class="nd"' : ''}>${a.km != null ? fmt(a.km) : 'No publicado'}</b><small>Kilómetros</small></p></div>
<dl class="sp">${fila('Caja', a.transmision ? esc(a.transmision) : '')}${fila('Combustible', a.combustible ? esc(a.combustible) : '')}${fila('Color', a.color ? `${sw ? `<i class="sw" style="--sw:${sw}"></i>` : ''}${esc(a.color)}` : '')}</dl>
<div class="car-f">${pr}${a.nota ? `<p class="n">${esc(a.nota)}</p>` : ''}<button class="btn sm ficha-trigger" type="button" data-ficha="${i}" aria-label="Ver la ficha completa de ${esc(a.titulo)}">Ver la ficha completa</button><button class="btn sm gallery-trigger" type="button" data-gallery="${i}" hidden>Ver galería</button><a class="btn sm" href="${esc(consultaHref(a))}" ${EXT} aria-label="Consultar por ${esc(a.titulo)}">${WA ? 'Reservar esta unidad' : 'Consultar por Facebook'}</a></div>
</li>`;
};
const catData = autos.map((a, i) => ({ i, titulo: a.titulo, media: mediaDe(a), marca: marcaDe(a), modelo: a.modelo || null, cilindrada: a.cilindrada || null, version: a.version || null, anio: a.anio ?? null, km: a.km ?? null, transmision: a.transmision || null, combustible: a.combustible || null, color: a.color || null, sw: swatch(a.color), precio: a.precio || null, url: a.url, href: consultaHref(a) }));
const unidades = autos.length
  ? `${autos.length > 1 ? '<div class="fx" id="tools" hidden></div>\n' : ''}<p id="sinres" class="vacio" hidden>Ninguna unidad coincide con los filtros. Sacá alguno o limpiá todos para ver las ${autos.length} unidades.</p><ul class="cars" id="cars">\n${autos.map(card).join('\n')}\n</ul>\n<script type="application/json" id="cat-data">${jsonSafe(catData)}</script>\n<p class="src">Fichas del catálogo público de ${esc(GNAME)}${A.relevadoEl ? ` relevadas el ${esc(fdate(A.relevadoEl))}` : ''}. Precio y disponibilidad pueden haber cambiado: consultalos antes de ir.</p>\n<div class="row mt"><a class="btn p" href="${GCAT}" ${EXT}>Ver catálogo completo</a><a class="btn" href="${FB}" ${EXT}>Ver más en Facebook</a><a class="btn" href="${IG}" ${EXT}>Ver más en Instagram</a></div>`
  : `<div class="vacio"><p>Las unidades disponibles se publican con fotos en nuestra página de Facebook y en Instagram. Escribinos y te contamos disponibilidad y precio.</p><div class="row"><a class="btn p" href="${FB}" ${EXT}>Ver unidades en Facebook</a><a class="btn" href="${IG}" ${EXT}>Ver Instagram</a></div></div>`;

// ---- contacto ----
const H = D.hours;
const fh = (t) => t.replace(/^0/, '');
const rng = (r) => r.map((x) => `${fh(x[0])} a ${fh(x[1])}`).join(' y ');
const hrsRows = H.display ? H.semana.map((g) => `<tr data-dias="${g.dias.join(',')}"><th scope="row">${esc(g.etiqueta)}</th><td>${rng(g.rangos)} h</td></tr>`).join('') + (H.domingo ? `<tr data-dias="0"><th scope="row">Domingos</th><td>${esc(H.domingo)}</td></tr>` : '') : '';
const estadoP = H.display ? `<p class="estado" data-estado data-semana="${esc(JSON.stringify(H.semana))}" hidden></p>` : '';
const hrsTable = H.display ? `${estadoP}<table class="hrs"><caption class="sr">Horario de atención</caption><tbody>${hrsRows}</tbody></table>` : '';
const direccion = `${esc(L.address)}, ${esc(L.city)}, ${esc(L.province)}${L.direccionAnterior ? `<small class="ant">Antes: ${esc(L.direccionAnterior)}</small>` : ''}`;
const dl = [
  ['Dirección', direccion],
  ['Cómo llegar', `<a href="${L.mapsUrl}" ${EXT}>Abrir en Google Maps</a>`],
  C.phone ? ['Teléfono', `<a href="tel:${C.phoneTel}">${esc(C.phone)}</a>`] : null,
  C.whatsApp ? ['WhatsApp', `<a href="${WA}" ${EXT}>${esc(C.whatsAppDisplay)} · Escribinos</a>`] : null,
  C.email ? ['Correo', `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`] : null,
  H.display ? ['Horario', hrsTable] : null,
  D.reviews.googleUrl ? ['Ficha de Google', `<a href="${D.reviews.googleUrl}" ${EXT}>Abrir ficha en Google</a>`] : null,
  ['Redes', `<a href="${FB}" ${EXT}>Facebook</a> · <a href="${IG}" ${EXT}>Instagram @${esc(C.instagram)}</a>`],
  ['Grupo', `<a href="${GWEB}" ${EXT}>${esc(GNAME)} · Concesionario Usados ${esc(L.city)}</a>`],
].filter(Boolean);

// ---- barra de datos, sucursales del grupo, preguntas ----
const bar = `<div class="bar" role="region" aria-label="Datos rápidos"><div class="w"><ul>
<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><span class="k">Dirección</span><b>${esc(L.address.replace('Avenida', 'Av.'))}</b><small>${esc(L.city)}${L.direccionAnterior ? ` · antes ${esc(L.direccionAnterior)}` : ''}</small></li>
${C.phoneTel ? `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg><span class="k">Teléfono</span><a href="tel:${C.phoneTel}">${esc(C.phone)}</a><small>Llamanos</small></li>` : ''}
${C.whatsApp ? `<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/></svg><span class="k">WhatsApp</span><a href="${WA}" ${EXT}>${esc(C.whatsAppDisplay)}</a><small>Escribinos</small></li>` : ''}
${H.display ? `<li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg><span class="k">Horario</span><b data-estado>${esc(H.corto)}</b><small>${estadoP ? 'Hora de Argentina' : ''}</small></li>` : ''}
</ul></div></div>`;

const suc = (D.identity.grupoSucursales || []).filter((x) => !x.esta);
const grupo = suc.length ? `
<div class="grp"><h3>Sucursales del ${esc(GNAME)}</h3>
<p class="sec-p">Los números los publica el grupo en su material de contacto; algunas sucursales comparten el mismo WhatsApp.</p>
<ul class="grp-l">${suc.map((x) => `<li><b>${esc(x.nombre)}</b><span>${esc(x.direccion)}</span>${x.tel ? `<a href="tel:${x.telTel}">Tel. ${esc(x.tel)}</a>` : ''}${x.wa ? `<a href="https://wa.me/${x.waNum}" ${EXT}>WhatsApp ${esc(x.wa)}</a>` : ''}</li>`).join('')}</ul>
<p class="src">Fuente: material de contacto del ${esc(GNAME)}.</p></div>` : '';

const qa = (q, a) => `<details class="dd"><summary>${q}</summary><p>${a}</p></details>`;
const faq = [
  hasSvc('permuta') ? qa('¿Reciben mi usado como parte de pago?', `Según informa ${esc(GNAME)}, sí: se reciben vehículos usados como parte de pago. Armá el mensaje en la sección «Tu usado» y envialo a la agencia.`) : '',
  hasSvc('tasacion') ? qa('¿La tasación tiene costo?', `Según informa ${esc(GNAME)} en su sitio, la tasación es sin cargo.`) : '',
  hasSvc('garantia') ? qa('¿Los autos tienen garantía?', `Los usados pasan por revisión técnica y se entregan con garantía. Las condiciones dependen de cada vehículo: consultalas por la unidad que te interese.`) : '',
  qa('¿Cómo financio?', `Ofrecemos financiación para autos y motos y figuramos en el listado de Créditos Más Autos del Banco de la Nación (${esc(BNAFECHA)}). Los montos y las condiciones dependen de la unidad y de cada solicitante.`),
  qa('¿Los precios publicados son definitivos?', `No necesariamente. Cada tarjeta muestra el precio de la ficha pública en la fecha en que se relevó: consultalo antes de ir.`),
  qa('¿Cómo coordino una visita?', `Entrá a <a href="reserva.html">Agendar visita y prueba de manejo</a>, elegí un día y una franja y enviá la consulta. No es un turno: el día y la hora se acuerdan con la agencia.`),
  H.display ? qa('¿Cuándo atienden?', `${esc(H.display)}. Los domingos: ${esc((H.domingo || '').toLowerCase())}.`) : '',
].filter(Boolean).join('\n');
const glos = [
  ['Título del automotor', 'Documento del Registro del Automotor que acredita quién es el titular del vehículo.'],
  ['Cédula de identificación', 'Documento que habilita a circular con el vehículo. La del titular es la «cédula verde».'],
  ['Dominio', 'La patente: letras y números que identifican al vehículo.'],
  ['Informe de dominio', 'Certificado del Registro con los datos del titular y las anotaciones del vehículo, por ejemplo prendas o embargos.'],
  ['Libre deuda', 'Constancia de que no hay deuda de patentes o multas.'],
  ['Verificación policial', 'Control físico que comprueba que los números de motor y chasis coinciden con los papeles.'],
  ['Formulario 08', 'Formulario de transferencia que firman las partes cuando cambia el titular.'],
  ['Parte de pago', 'Entregar tu usado como parte del precio de otra unidad.'],
].map(([t, d]) => qa(t, d)).join('\n');
const secPreguntas = `
<section class="lt" id="preguntas" aria-labelledby="preg-t"><div class="w">
<p class="ey">Preguntas</p><h2 id="preg-t">Lo que <em>conviene saber</em></h2>
<p class="sec-p">Respuestas cortas sobre cómo trabajamos y un glosario con las palabras que aparecen al comprar un usado. Información general de octubre de 2026: no es una condición ni una promesa de ${esc(NAME)}.</p>
<div class="qa"><div><h3>Preguntas frecuentes</h3>${faq}</div><div><h3>Glosario del comprador</h3>${glos}</div></div>
</div></section>`;
const semana = H.semana || [];
const closedDays = [0, 1, 2, 3, 4, 5, 6].filter((d) => !semana.some((g) => g.dias.includes(d)));
const morningOnly = semana.filter((g) => g.rangos.length === 1).flatMap((g) => g.dias);
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const openSpec = semana.flatMap((g) => g.rangos.map((r) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.dias.map((x) => DOW[x]), opens: r[0], closes: r[1] })));

// ---- secciones nuevas: comparador, cómo comprar, tu usado, búsqueda, guía, visita, mapa ----
const COORD = L.coordenadas;
const secUsado = hasSvc('permuta') ? `
<section class="conversion conversion--trade" id="tu-usado" aria-labelledby="usado-t"><div class="w">
<div class="conversion-layout">
<div class="conversion-story">
<div class="conversion-index"><span>HORIZONTE / PERMUTA</span><span>01 — 02</span></div>
<p class="ey">Tu próximo paso</p><h2 id="usado-t">Entregá tu usado como <em>parte de pago</em></h2>
<p class="sec-p">${hasSvc('tasacion') ? 'Recibimos vehículos usados como parte de pago y la tasación es sin cargo, según informa ' + esc(GNAME) + '. ' : 'Recibimos vehículos usados como parte de pago, según informa ' + esc(GNAME) + '. '}Contanos cuál es y armá el mensaje para enviárselo a la agencia.</p>
<ol class="conversion-steps" aria-label="Cómo funciona la consulta">
<li><b>01</b><span>Contanos marca, modelo y año.</span></li>
<li><b>02</b><span>Revisá el mensaje que se arma.</span></li>
<li><b>03</b><span>Elegí el canal para enviarlo vos.</span></li>
</ol>
<div class="conversion-art conversion-art--car" aria-hidden="true"><span class="conversion-art-number">01</span><span class="conversion-sun"></span><svg viewBox="0 0 380 210" fill="none"><path d="M42 137h27l31-48c9-14 22-22 39-22h90c18 0 31 7 42 21l38 49h25c12 0 21 9 21 21v20H22v-20c0-12 8-21 20-21Z"/><path d="m111 88-24 49h79V67h-27c-12 0-21 6-28 21Zm70-21v70h111l-34-43c-8-11-17-16-31-16h-46Z"/><path d="M44 159h292M82 179a24 24 0 1 0 48 0m120 0a24 24 0 1 0 48 0"/><circle cx="106" cy="179" r="10"/><circle cx="274" cy="179" r="10"/></svg><span class="conversion-art-caption">LO QUE MANEJÁS<br>ABRE OTRA POSIBILIDAD</span></div>
</div>
<div class="conversion-panel">
<form class="fm conversion-form" data-msg data-intro="Hola! Quiero consultar por entregar mi usado como parte de pago." aria-label="Datos de tu usado">
<div class="conversion-form-head"><div><p class="ey">Empezá por acá</p><h3>Datos de tu usado</h3></div><span class="conversion-form-tag">TU VEHÍCULO</span></div>
<div class="f"><label for="u-mm">Marca y modelo</label><input id="u-mm" data-lbl="Marca y modelo" autocomplete="off" required></div>
<div class="f"><label for="u-an">Año</label><input id="u-an" data-lbl="Año" inputmode="numeric" autocomplete="off"></div>
<div class="f"><label for="u-km">Kilometraje</label><input id="u-km" data-lbl="Kilometraje" inputmode="numeric" autocomplete="off"></div>
<div class="f"><label for="u-co">Combustible</label><select id="u-co" data-lbl="Combustible"><option value="">Sin indicar</option><option>Nafta</option><option>Diésel</option><option>GNC</option><option>Otro</option></select></div>
<div class="f full"><label for="u-no">Algo más que quieras contar</label><textarea id="u-no" data-lbl="Comentarios"></textarea></div>
<textarea class="msg-v" readonly hidden aria-label="Mensaje armado"></textarea>
<div class="acts">${WAFORM}${CPBTN}<a class="btn" href="${FB}" ${EXT}>Ir a Facebook</a><a class="btn" href="${IG}" ${EXT}>Ir a Instagram</a></div>
<p class="msg-s" role="status" aria-live="polite"></p>
</form>
<p class="src conversion-note">Es un mensaje que armás vos: no se envía ni se guarda nada desde este sitio. La tasación y las condiciones se acuerdan con la agencia.</p>
</div>
</div>
</div></section>` : '';

const secBusqueda = `
<section class="conversion conversion--search lt" id="busqueda" aria-labelledby="bus-t"><div class="w">
<div class="conversion-layout">
<div class="conversion-story">
<div class="conversion-index"><span>HORIZONTE / BÚSQUEDA</span><span>02 — 02</span></div>
<p class="ey">Del otro lado del volante</p><h2 id="bus-t">Contanos qué auto <em>buscás</em></h2>
<p class="sec-p">Armá un mensaje con lo que tenés en mente y enviáselo a la agencia por el canal que prefieras.</p>
<div class="conversion-art conversion-art--focus" aria-hidden="true"><span class="conversion-art-number">02</span><span class="conversion-focus-ring conversion-focus-ring--outer"></span><span class="conversion-focus-ring conversion-focus-ring--inner"></span><svg viewBox="0 0 380 210" fill="none"><path d="M42 137h27l31-48c9-14 22-22 39-22h90c18 0 31 7 42 21l38 49h25c12 0 21 9 21 21v20H22v-20c0-12 8-21 20-21Z"/><path d="m111 88-24 49h79V67h-27c-12 0-21 6-28 21Zm70-21v70h111l-34-43c-8-11-17-16-31-16h-46Z"/><path d="M44 159h292M82 179a24 24 0 1 0 48 0m120 0a24 24 0 1 0 48 0"/><circle cx="106" cy="179" r="10"/><circle cx="274" cy="179" r="10"/></svg><span class="conversion-art-caption">MARCA · AÑO · PRESUPUESTO<br>UNA IDEA MÁS CLARA PARA EMPEZAR</span></div>
</div>
<div class="conversion-panel">
<form class="fm conversion-form" data-msg data-intro="Hola! Estoy buscando un auto." aria-label="Qué auto buscás">
<div class="conversion-form-head"><div><p class="ey">Armá tu consulta</p><h3>El auto que tenés en mente</h3></div><span class="conversion-form-tag">TU BÚSQUEDA</span></div>
<div class="f"><label for="b-mm">Marca o modelo</label><input id="b-mm" data-lbl="Marca o modelo" autocomplete="off" required></div>
<div class="f"><label for="b-an">Año mínimo</label><input id="b-an" data-lbl="Año mínimo" inputmode="numeric" autocomplete="off"></div>
<div class="f"><label for="b-tr">Transmisión</label><select id="b-tr" data-lbl="Transmisión"><option value="">Indistinto</option><option>Manual</option><option>Automática</option></select></div>
<div class="f"><label for="b-pr">Presupuesto aproximado</label><input id="b-pr" data-lbl="Presupuesto" autocomplete="off"></div>
<div class="f full"><label for="b-no">Algo más que quieras contar</label><textarea id="b-no" data-lbl="Comentarios"></textarea></div>
<textarea class="msg-v" readonly hidden aria-label="Mensaje armado"></textarea>
<div class="acts">${WAFORM}${CPBTN}<a class="btn" href="${FB}" ${EXT}>Ir a Facebook</a><a class="btn" href="${IG}" ${EXT}>Ir a Instagram</a></div>
<p class="msg-s" role="status" aria-live="polite"></p>
</form>
<p class="src conversion-note">Es un mensaje que armás vos: no se envía ni se guarda nada desde este sitio. No confirma disponibilidad ni precios.</p>
</div>
</div>
</div></section>`;

const secGuia = `
<section id="guia" aria-labelledby="guia-t"><div class="w">
<p class="ey">Guía</p><h2 id="guia-t">Antes de comprar un <em>usado</em></h2>
<p class="sec-p">Información general para cualquier compra de un usado, de octubre de 2026. No es una condición ni una promesa de ${esc(NAME)}.</p>
<div class="guia">
<details class="card gd" open><summary><h3>Qué mirar en el auto</h3></summary><ul><li>Carrocería y pintura: diferencias de tono, juntas desparejas o signos de golpes.</li><li>Neumáticos, frenos y suspensión: desgaste parejo y ruidos al probarlo.</li><li>Motor y debajo del auto: fugas de aceite o líquidos.</li><li>Tablero y luces: que no queden testigos encendidos.</li><li>Kilometraje: que sea coherente con el desgaste de pedales, volante y asientos.</li><li>Probalo en marcha, en calle y en ruta si podés.</li></ul></details>
<details class="card gd" open><summary><h3>Papeles que conviene pedir</h3></summary><ul><li>Título y cédula del automotor, y que los datos coincidan con el auto (dominio, motor y chasis).</li><li>Informe de dominio del Registro del Automotor.</li><li>Libre deuda de patentes y de multas.</li><li>Verificación policial vigente.</li><li>Formulario 08 de transferencia, firmado por quien vende.</li></ul></details>
</div>
<p class="src">Los requisitos y costos de la transferencia cambian: consultalos en el Registro del Automotor o con un gestor o escribano antes de pagar.</p>
</div></section>`;

const secVisita = `
<section id="visita" aria-labelledby="vis-t"><div class="w">
<p class="ey">Visita</p><h2 id="vis-t">Coordiná tu <em>visita</em></h2>
<p class="sec-p">En la página de reserva elegís un día y una franja y se arma la consulta para enviarla a la agencia. Es una consulta, no un turno: el día y la hora se acuerdan con la agencia.</p>
${H.display ? `<p class="estado" data-estado hidden></p><p class="src">Horario: ${esc(H.display)}.</p>` : ''}
<div class="visit-card glass reveal"><p class="visit-card-kicker">Consulta personalizada</p><h3>Agendá una visita y prueba de manejo</h3><p>Elegí un día y una franja para armar tu consulta. No es un turno: el día y la hora se acuerdan con la agencia.</p><div class="row"><a class="btn p" href="reserva.html">Agendar visita y prueba de manejo</a><a class="btn" href="${L.mapsUrl}" ${EXT}>Cómo llegar</a></div></div>
</div></section>`;

const mapa = COORD ? `
<div class="map" id="mapa" data-lat="${COORD.lat}" data-lng="${COORD.lng}" data-leaflet="js/vendor/leaflet.js" data-css="js/vendor/leaflet.css">
<div class="map-p"><p>Mapa interactivo de OpenStreetMap. Se carga solo si lo pedís.</p><button class="btn" type="button" data-mapa-abrir hidden>Ver mapa</button><p class="map-m src" role="status" aria-live="polite"></p></div>
<div class="map-v" role="region" aria-label="Mapa con la ubicación" hidden></div>
<div class="row"><a class="btn" href="${L.mapsUrl}" ${EXT}>Abrir en Google Maps</a><a class="btn" href="https://waze.com/ul?ll=${COORD.lat},${COORD.lng}&amp;navigate=yes" ${EXT}>Abrir en Waze</a><button class="btn" type="button" data-copiar="${esc(L.address)}, ${esc(L.city)}, ${esc(L.province)}" hidden>Copiar dirección</button></div>
<p class="src">Ubicación según la ficha de Google Maps. La dirección es ${esc(L.address)}, ${esc(L.city)}.</p>
</div>` : '';

const ld = {
  '@context': 'https://schema.org', '@type': 'AutoDealer', name: NAME,
  address: { '@type': 'PostalAddress', streetAddress: L.address, postalCode: L.postalCode, addressLocality: L.city, addressRegion: L.province, addressCountry: 'AR' },
  sameAs: [FB, IG],
  ...(siteUrl ? { url: siteUrl } : {}), ...(C.phoneTel ? { telephone: C.phoneTel } : {}), ...(C.email ? { email: C.email } : {}), ...(L.mapsUrl ? { hasMap: L.mapsUrl } : {}), ...(openSpec.length ? { openingHoursSpecification: openSpec } : {}),
};

const index = page({
  title: `${NAME} · Autos y motos en ${L.city}, ${L.province}`,
  desc: `${NAME} en ${L.city}, ${L.province}: autos y motos con financiación. Visitanos en ${L.address} o mirá las unidades en Facebook e Instagram.`,
  file: 'index.html',
  extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n<script defer src="js/secciones.js"></script>\n<script defer src="js/mapa.js"></script>\n<script defer src="js/horarios.js"></script>
<script defer src="js/site.js"></script>\n`,
  body: `${header()}
<main id="top">
<div class="hero">
<div class="hero-media" aria-hidden="true"><picture><source media="(max-width:700px)" srcset="images/hero/horizonte-hero-audi-mobile.webp"><img src="images/hero/horizonte-hero-audi.webp" width="960" height="720" alt="" fetchpriority="high" decoding="async"></picture></div>
<nav class="hero-hotspots" aria-label="Accesos rápidos del hero"><a class="hero-hotspot hero-home" href="./" aria-label="Inicio"></a><a class="hero-hotspot hero-nav-unidades" href="#unidades" aria-label="Unidades"></a><a class="hero-hotspot hero-nav-financiacion" href="#financiacion" aria-label="Financiación"></a><a class="hero-hotspot hero-nav-guia" href="#guia" aria-label="Guía"></a><a class="hero-hotspot hero-nav-preguntas" href="#preguntas" aria-label="Preguntas"></a><a class="hero-hotspot hero-nav-nosotros" href="#nosotros" aria-label="Nosotros"></a><a class="hero-hotspot hero-nav-contacto" href="#contacto" aria-label="Contacto"></a><a class="hero-hotspot hero-cta-unidades" href="#unidades" aria-label="Ver unidades"></a><a class="hero-hotspot hero-cta-whatsapp" href="${WA || FB}" ${EXT} aria-label="Escribir por WhatsApp"></a><a class="hero-hotspot hero-cta-maps" href="${L.mapsUrl}" ${EXT} aria-label="Cómo llegar"></a></nav>
<div class="hx-copy">
<p class="ey">Horizonte Automotores</p>
<h1><span class="sr">${esc(NAME)}: </span>Autos y motos <em>en ${esc(L.city)}</em></h1>
<p class="lead">Concesionario del ${esc(GNAME)}. Usados multimarca, financiación y tu usado como parte de pago.</p>
<div class="row"><a class="btn p" href="#unidades">Ver unidades</a>${C.whatsApp ? `<a class="btn" href="${WA}" ${EXT}>Escribir por WhatsApp</a>` : ''}<a class="btn lnk" href="${L.mapsUrl}" ${EXT}>Cómo llegar</a></div></div>
<div class="hx-sun" aria-hidden="true"><span class="orb"></span></div>
<a class="hx-down" href="#unidades">Ver más</a>
</div>
</div>
${bar}
<section id="unidades" class="inventory-section" aria-labelledby="unidades-t"><div class="w wide">
<div class="inventory-head">
<div class="inventory-title"><p class="ey reveal">Catálogo seleccionado · ${esc(L.city)}</p><h2 id="unidades-t" class="reveal">Nuestras <em>unidades</em></h2><p class="sec-p">Usados multimarca publicados para María Grande, con financiación y la posibilidad de tomar tu usado como parte de pago.</p></div>
<div class="inventory-meta" aria-label="Resumen del catálogo"><span class="inventory-meta-kicker">Horizonte Automotores</span><strong>${String(autos.length).padStart(2, '0')}</strong><span>unidades publicadas</span><i aria-hidden="true"></i></div>
</div>
<div class="inventory-rule" aria-hidden="true"><span></span><small>María Grande · Entre Ríos</small><span></span></div>
${unidades}
</div></section>

<section class="finance-section" id="financiacion" aria-labelledby="fin-t"><div class="w">
<div class="finance-head"><div><p class="ey">Financiación y servicios</p><h2 id="fin-t">Financiá tu <em>próximo vehículo</em></h2><p class="sec-p">Ofrecemos financiación para autos y motos. Los montos y condiciones dependen de la unidad y de cada solicitante: consultanos por la que te interese.</p></div><aside class="finance-aside"><span>Horizonte Automotores</span><strong>01</strong><p>Encontrá una forma de avanzar hacia tu próxima unidad.</p></aside></div>
<div class="finance-rule" aria-hidden="true"><span></span><small>Servicios para moverte mejor</small><span></span></div>
<div class="cards finance-cards"><div class="card finance-card"><span class="finance-card-no">01 / FINANCIACIÓN</span><h3>Créditos Más Autos</h3><p>Figuramos en el listado de concesionarias adheridas a Créditos Más Autos del Banco de la Nación Argentina (listado de ${esc(BNAFECHA)}). <a href="${BNA}" ${EXT}>Ver el listado</a>.</p></div>${hasSvc('permuta') || hasSvc('tasacion') ? `<div class="card finance-card"><span class="finance-card-no">02 / TU USADO</span><h3>Tu usado, parte de pago</h3><p>${[hasSvc('permuta') ? 'Recibimos vehículos usados como parte de pago.' : '', hasSvc('tasacion') ? 'La tasación es sin cargo.' : ''].filter(Boolean).join(' ')}</p></div>` : ''}${hasSvc('garantia') ? `<div class="card finance-card"><span class="finance-card-no">03 / RESPALDO</span><h3>Revisión técnica y garantía</h3><p>Los usados pasan por revisión técnica antes de publicarse y se entregan con garantía. Las condiciones dependen de cada vehículo.</p></div>` : ''}</div>
<div class="row fin-cta"><a class="btn p" href="${wa('Hola! Quiero consultar un plan a medida.') || FB}" ${EXT}>${C.whatsApp ? 'Consultar un plan a medida' : 'Consultar por Facebook'}</a><a class="btn" href="#tu-usado">Solicitar tasación personalizada</a></div>
<p class="src">Servicios según lo informado por ${esc(GNAME)} en <a href="${GWEB}" ${EXT}>su sitio</a>.</p>
</div></section>

${secUsado}
${secBusqueda}
${secGuia}
${secPreguntas}
${secVisita}

<section class="lt" id="nosotros" aria-labelledby="nos-t"><div class="w">
<p class="ey">Nosotros</p><img class="lg-sec" src="images/logo-sm.png" width="360" height="144" alt=""><h2 id="nos-t">Quiénes <em>somos</em></h2>
<p class="sec-p">${esc(NAME)} es un concesionario de ${esc(L.city)} que forma parte del ${esc(GNAME)}. ${esc(D.presentacion.antiguedad)}</p>
<div class="stats"><div class="stat"><b>10</b><span>años de respaldo en el mercado regional, según su página de Facebook</span></div>${autos.length ? `<div class="stat"><b>${autos.length}</b><span>unidades publicadas en esta web${A.relevadoEl ? `, relevadas el ${esc(fdate(A.relevadoEl))}` : ''}</span></div>` : ''}<div class="stat"><b>${suc.length + 1}</b><span>puntos de atención que lista el ${esc(GNAME)}, uno de ellos en ${esc(L.city)}</span></div></div>
<div class="cards"><div class="card"><h3>Autos y motos</h3><p>Usados publicados para ${esc(L.city)} y financiación para llevarlos.</p></div>${hasSvc('permuta') ? `<div class="card"><h3>Tu usado cuenta</h3><p>Se reciben usados como parte de pago${hasSvc('tasacion') ? ' y la tasación es sin cargo' : ''}, según informa ${esc(GNAME)}.</p></div>` : ''}<div class="card"><h3>Respaldo del grupo</h3><p>Forma parte del ${esc(GNAME)}, con sucursales en Paraná y Santa Fe.</p></div></div>
</div></section>

<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<p class="ey reveal">Contacto</p><h2 id="contacto-t" class="reveal">Dónde <em>encontrarnos</em></h2>
<div class="ct-g"><dl>${dl.map(([t, v]) => `<dt>${t}</dt><dd>${v}</dd>`).join('')}</dl>
<div class="ct-c glass reveal"><p class="ct-t">¿Buscás un auto o una moto?</p><p>Escribinos y te contamos disponibilidad, precio y formas de pago de la unidad que te interese.</p><div class="row"><a class="btn p" href="${ctaHead.href}" ${EXT}>${WA ? 'Consultar con un asesor' : 'Consultar por Facebook'}</a>${C.phoneTel ? `<a class="btn" href="tel:${C.phoneTel}">Llamar</a>` : ''}<a class="btn" href="${IG}" ${EXT}>Instagram</a></div></div></div>
${mapa}
${grupo}
</div></section>
</main>
${footer(true)}
${C.whatsApp ? `<nav class="cta-bar" aria-label="Acciones rápidas"><a href="${WA}" ${EXT}>Consultar</a><a href="reserva.html">Agendar visita</a></nav>` : `<nav class="cta-bar" aria-label="Acciones rápidas"><a href="${FB}" ${EXT}>Consultar</a><a href="reserva.html">Agendar visita</a></nav>`}
`,
});

const privacidad = page({
  title: `Privacidad y avisos · ${NAME}`,
  desc: `Política de privacidad preliminar y avisos de ${NAME}.`,
  file: 'privacidad.html',
  body: `${header('./', '#top')}
<main id="top"><section><div class="w doc">
<p class="ey">Avisos</p><h1>Privacidad y <em>avisos</em></h1>
<h2>Datos personales</h2>
<p>Este sitio no tiene cuentas ni cookies propias y no guarda datos de quienes lo visitan. Los formularios «Tu usado» y «Contanos qué auto buscás» solo arman un mensaje en tu navegador, que podés copiar y enviar vos: no se transmite nada a este sitio. El mapa de Contacto se carga solo si lo pedís y trae mosaicos de OpenStreetMap, que recibe tu dirección IP como cualquier sitio que se visita. Los botones de contacto abren Facebook, Instagram, el sitio de ${esc(GNAME)}${C.whatsApp ? ', WhatsApp' : ''} o Google Maps, que tienen sus propias políticas de privacidad.</p>
<h2>Información de las unidades</h2>
<p>Los datos de las unidades (año, kilometraje, precio, disponibilidad) provienen de las publicaciones de la agencia y del catálogo público de ${esc(GNAME)}, y pueden haber cambiado. Confirmá siempre con ${esc(NAME)} antes de decidir.</p>
<h2>Documento preliminar</h2>
<p>Este texto es preliminar y debe revisarse profesionalmente antes de la publicación definitiva.</p>
<p><a class="btn sm" href="./">Volver al inicio</a></p>
</div></section></main>
${footer(false)}`,
});

const home404 = siteUrl || './';
const logo404 = 'images/logo-sm.png';
const FONTS_404 = FONTS.replace(/url\(fonts\/([^)]+)\)/g, '__U__$1__E__');
const nf404Head = siteUrl
  ? `<style>${FONTS.replace(/url\(fonts\//g, `url(${siteUrl}fonts/`)}</style>\n`
  : '<script>(function(){var s=location.pathname.split("/").filter(Boolean),b=/github\\.io$/.test(location.hostname)&&s.length?"/"+s[0]+"/":"/";var st=document.createElement("style");st.textContent=' + JSON.stringify(FONTS_404) + '.split("__U__").join("ur"+"l("+b+"fonts/").split("__E__").join(")");document.head.appendChild(st);document.addEventListener("DOMContentLoaded",function(){document.getElementById("home").href=b})})()</script>\n';
const nf = page({
  title: `Página no encontrada · ${NAME}`,
  desc: `La página que buscás no existe. Volvé al inicio de ${NAME}.`,
  file: '404.html', withFonts: false,
  extraHead: nf404Head,
  body: `<main class="nf"><div><img class="lg-404" src="${logo404}" width="360" height="144" alt="${esc(NAME)}"><p class="ey">Error 404</p><h1>No encontramos <em>esa página</em></h1><p>Puede que el enlace esté mal escrito o que la página ya no exista.</p><a id="home" class="btn p" href="${home404}">Volver al inicio</a></div></main>`,
});


// ---- reserva.html: consulta de visita (ver docs/RESERVA.md). El número de WhatsApp viaja en data-wa, no en js/reserva.js ----
const reservaBtn = C.whatsApp
  ? `<a id="whatsapp" class="primary" href="https://wa.me/${C.whatsApp}" data-wa="${C.whatsApp}" ${EXT}>Escribir por WhatsApp <span>↗</span></a>`
  : `<button id="whatsapp" class="primary" type="button" data-wa="">Copiar consulta <span>↗</span></button>`;
const reserva = `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${robotsMeta}<title>Coordiná tu visita · ${esc(NAME)}</title>
<meta name="description" content="Elegí un día y una franja y armá la consulta para ir a ver un auto. Es una consulta, no un turno.">
<meta name="theme-color" content="#0a1012">
<meta property="og:type" content="website">
<meta property="og:title" content="Coordiná tu visita · ${esc(NAME)}">
<meta property="og:locale" content="es_AR">
${canon('reserva.html')}<link rel="manifest" href="site.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="images/icon-192.png">
<link rel="apple-touch-icon" href="images/icon-180.png">
<link rel="stylesheet" href="css/reserva.css"><link rel="stylesheet" href="css/motion.css">
</head>
<body>
<main id="booking" data-step="month" data-closed="${closedDays.join(',')}" data-morning-only="${morningOnly.join(',')}">
  <header class="booking-nav">
    <a class="brand" href="index.html" aria-label="Volver a ${esc(NAME)}"><img class="lg-bk" src="images/logo-sm.png" width="360" height="144" alt="${esc(NAME)}"></a>
    <p class="eyebrow">Coordiná tu visita <span aria-hidden="true">/</span> consulta</p>
    <button class="back" id="back" type="button" aria-label="Volver un paso" hidden>← Atrás</button>
  </header>

  <section class="scene scene--month" aria-labelledby="month-title">
    <div class="scene__meta"><span>01 / MES</span><span id="month-status" aria-live="polite"></span></div>
    <div class="month-copy"><p class="kicker">${esc(NAME)}</p><h1 id="month-title">Elegí<em>cuándo</em><em>venir.</em></h1><p class="intro">Elegí un día en el calendario y armá la consulta. Todavía no es un turno.</p></div>
    <div class="calendar-shell">
      <div class="calendar-head"><button id="prev-month" type="button" aria-label="Mes anterior">←</button><h2 id="month-label"></h2><button id="next-month" type="button" aria-label="Mes siguiente">→</button></div>
      <div class="weekday" aria-hidden="true"><span>LU</span><span>MA</span><span>MI</span><span>JU</span><span>VI</span><span>SA</span><span>DO</span></div>
      <div id="calendar" class="calendar" role="group" aria-label="Calendario de consulta"></div>
    </div>
  </section>

  <section class="scene scene--day" aria-labelledby="day-title" hidden>
    <div class="scene__meta"><span>02 / DÍA</span><span id="day-status" aria-live="polite"></span></div>
    <div class="giant-day" aria-hidden="true"><small id="day-month">—</small><span id="day-number">—</span><strong id="day-weekday">—</strong></div>
    <div class="day-copy"><p class="kicker">Tu visita</p><h2 id="day-title">¿Qué día<br><em>te queda bien?</em></h2><p>Elegí el día y se arma el mensaje de consulta.</p></div>
    <button class="next-step" id="to-time" type="button" disabled>Elegir franja <span>→</span></button>
  </section>

  <section class="scene scene--time" aria-labelledby="time-title" hidden>
    <div class="scene__meta"><span>03 / FRANJA</span><span id="time-status" aria-live="polite"></span></div>
    <div class="time-copy"><p class="kicker">Franja del día</p><h2 id="time-title">¿Mañana<br><em>o tarde?</em></h2><p>La hora exacta se acuerda con el negocio.</p></div>
    <div id="slots" class="slots" role="listbox" aria-label="Franja del día"></div>
    <button class="next-step" id="to-confirm" type="button" disabled>Ver resumen <span>→</span></button>
  </section>

  <section class="scene scene--confirm" aria-labelledby="confirm-title" hidden>
    <div class="diagonal-wipe" aria-hidden="true"></div>
    <div class="scene__meta"><span>04 / CONFIRMAR</span><span>consulta de visita</span></div>
    <div class="confirm-copy"><p class="kicker">Tu visita</p><h2 id="confirm-title"><span id="summary-day">DÍA</span><em id="summary-time">FRANJA</em></h2><p>${esc(L.address)}<br>${esc(L.city)}</p></div>
    <div class="confirm-actions">${reservaBtn}<a class="secondary" href="${esc(L.mapsUrl)}" ${EXT}>Abrir Maps</a><button id="restart" class="secondary" type="button">Elegir otro día</button></div>
    <p id="send-state" class="send-state" role="status" aria-live="polite" data-state="ready">Listo para copiar · lo mandás vos por Facebook o Instagram</p>
    <p class="disclaimer">Con este mensaje consultás por una visita. El día y la hora se acuerdan con ${esc(NAME)}.</p>
    ${demo ? '<p class="disclaimer" data-demo-note>Versión de demostración · No es el sitio oficial · Datos pendientes de confirmación</p>' : ''}
  </section>
  <div id="live" class="sr-only" aria-live="polite"></div>
</main>
<script type="module" src="js/reserva.js"></script><script type="module" src="js/motion.js"></script>
</body>
</html>
`;

write('index.html', index);
write('reserva.html', reserva);
write('privacidad.html', privacidad);
write('404.html', nf);
write('robots.txt', demo ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}sitemap.xml\n` : ''}`);
const smPath = path.join(root, 'sitemap.xml');
if (!demo && siteUrl) write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc></url>\n  <url><loc>${siteUrl}reserva.html</loc></url>\n  <url><loc>${siteUrl}privacidad.html</loc></url>\n</urlset>\n`);
else if (fs.existsSync(smPath)) fs.rmSync(smPath);
write('site.webmanifest', JSON.stringify({ name: NAME, short_name: 'Horizonte', description: `Autos y motos en ${L.city}, ${L.province}.`, lang: 'es-AR', start_url: './', scope: './', display: 'standalone', background_color: '#0a1012', theme_color: '#0a1012', icons: [{ src: 'images/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: 'images/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }] }, null, 2) + '\n');
write('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#0a1012"/><path d="M9 44a23 23 0 0 1 46 0z" fill="#f2d21b"/><path d="M25 28v14M39 28v14M25 35h14" stroke="#0a1012" stroke-width="4.5" fill="none"/><path d="M6 50h52" stroke="#fff" stroke-width="4" fill="none"/></svg>\n');

console.log(`Generado: index.html (${(index.length / 1024).toFixed(1)} KB), privacidad.html, reserva.html, 404.html · ${autos.length} unidades · modo ${demo ? 'demo (noindex)' : 'producción'}`);
