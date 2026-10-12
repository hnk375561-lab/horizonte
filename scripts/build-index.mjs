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
const BNA = D.services.published.find((s) => s.fuente.includes('bna.com.ar')).fuente;
const wa = (txt) => (C.whatsApp ? `https://wa.me/${C.whatsApp}?text=${encodeURIComponent(txt)}` : null);
const WA = wa('Hola! Quiero consultar por las unidades disponibles.');
const EXT = 'target="_blank" rel="noopener noreferrer"';
const LEYENDA = `Demo ilustrativa construida a partir de información pública. Datos y disponibilidad sujetos a confirmación por ${NAME}. No es el sitio oficial.`;
const FONTS = '@font-face{font-family:"Bricolage Grotesque";font-style:normal;font-weight:200 800;font-display:swap;src:url(fonts/bricolage-grotesque-latin.woff2) format("woff2")}\n@font-face{font-family:"Instrument Sans";font-style:normal;font-weight:400 700;font-display:swap;src:url(fonts/instrument-sans-latin.woff2) format("woff2")}\n';
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
<meta name="theme-color" content="#0d0d0d">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="es_AR">
${canon(file === 'index.html' ? '' : file)}${withFonts ? '<link rel="manifest" href="site.webmanifest">\n<link rel="icon" type="image/svg+xml" href="favicon.svg">\n<link rel="preload" href="fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>\n' : ''}<style>
${withFonts ? FONTS : ''}${CSS}
</style>
${extraHead}</head>
<body>
${body}
</body>
</html>
`;
}

const footer = (fuentes) => `<footer><div class="w"><p>© 2026 ${esc(NAME)}</p>${demo ? `<p>${esc(LEYENDA)}</p><p class="demo-note" data-demo-note>Versión de demostración · No es el sitio oficial · Datos pendientes de confirmación</p>` : ''}${fuentes ? `<p>Fuentes: <a href="${FB}" ${EXT}>Facebook</a> · <a href="${IG}" ${EXT}>Instagram</a> · <a href="${GWEB}" ${EXT}>${esc(GNAME)}</a> · <a href="${BNA}" ${EXT}>Listado de concesionarias de Créditos Más Autos (Banco Nación, 16/07/2025)</a></p>` : ''}<p><a href="privacidad.html">Privacidad y avisos</a></p></div></footer>`;

const ctaHead = WA ? { href: WA, t: 'WhatsApp' } : { href: FB, t: 'Facebook' };
const header = (pre = '', skip = '#unidades') => `<a class="skip" href="${skip}">Saltar al contenido</a>
<header><div class="w"><a class="mark" href="./" aria-label="${esc(NAME)}, inicio">Horizonte<small>Automotores</small></a>
<nav aria-label="Principal"><a href="${pre}#unidades">Unidades</a><a href="${pre}#financiacion">Financiación</a><a href="${pre}#nosotros">Nosotros</a><a href="${pre}#contacto">Contacto</a></nav>
<div class="hc"><a class="btn p sm" href="${ctaHead.href}" ${EXT}>${ctaHead.t}</a></div></div></header>
${demo ? `<p class="demo"><span>${esc(LEYENDA)}</span></p>` : ''}`;

// ---- unidades ----
const fmt = (n) => n.toLocaleString('es-AR');
const autos = A.autos;
const card = (a) => {
  const meta = [a.anio, a.transmision, a.km != null ? `${fmt(a.km)} km` : '', a.combustible, a.color].filter((x) => x !== undefined && x !== '' && x !== null).join(' · ');
  const pr = a.precio ? `<p class="pr">${a.precio.moneda === 'USD' ? 'US$ ' : '$ '}${fmt(a.precio.monto)}</p><p class="n">Precio publicado el ${esc(fdate(a.precio.fecha))}; puede haber cambiado.</p>` : '<p class="pr">Consultar precio</p>';
  const link = wa(`Hola! Quiero consultar por el ${a.titulo}${a.anio ? ' ' + a.anio : ''}.`) || a.url;
  return `<li class="car"><h3>${esc(a.titulo)}</h3>${meta ? `<p class="m">${esc(meta)}</p>` : ''}${pr}${a.nota ? `<p class="n">${esc(a.nota)}</p>` : ''}<a class="btn sm" href="${esc(link)}" ${EXT} aria-label="Consultar por ${esc(a.titulo)}">${WA ? 'Consultar' : 'Ver publicación'}</a></li>`;
};
const unidades = autos.length
  ? `<ul class="cars" id="cars">\n${autos.map(card).join('\n')}\n</ul>\n<p class="src">Fichas del catálogo público de ${esc(GNAME)}${A.relevadoEl ? ` relevadas el ${esc(fdate(A.relevadoEl))}` : ''}. Precio y disponibilidad pueden haber cambiado: consultalos antes de ir.</p>\n<div class="row mt"><a class="btn p" href="${GCAT}" ${EXT}>Ver catálogo completo</a><a class="btn" href="${FB}" ${EXT}>Ver más en Facebook</a><a class="btn" href="${IG}" ${EXT}>Ver más en Instagram</a></div>`
  : `<div class="vacio"><p>Las unidades disponibles se publican con fotos en nuestra página de Facebook y en Instagram. Escribinos y te contamos disponibilidad y precio.</p><div class="row"><a class="btn p" href="${FB}" ${EXT}>Ver unidades en Facebook</a><a class="btn" href="${IG}" ${EXT}>Ver Instagram</a></div></div>`;

// ---- contacto ----
const dl = [
  ['Dirección', `${esc(L.address)}, ${esc(L.city)}, ${esc(L.province)}`],
  ['Cómo llegar', `<a href="${L.mapsUrl}" ${EXT}>Abrir en Google Maps</a>`],
  C.phone ? ['Teléfono', `<a href="tel:${C.phoneTel}">${esc(C.phone)}</a>`] : null,
  C.whatsApp ? ['WhatsApp', `<a href="${WA}" ${EXT}>Escribinos</a>`] : null,
  D.hours.display ? ['Horario', esc(D.hours.display)] : null,
  ['Redes', `<a href="${FB}" ${EXT}>Facebook</a> · <a href="${IG}" ${EXT}>Instagram @${esc(C.instagram)}</a>`],
  ['Grupo', `<a href="${GWEB}" ${EXT}>${esc(GNAME)}: Concesionario Usados ${esc(L.city)}</a>`],
].filter(Boolean);

const ld = {
  '@context': 'https://schema.org', '@type': 'AutoDealer', name: NAME,
  address: { '@type': 'PostalAddress', streetAddress: L.address, postalCode: L.postalCode, addressLocality: L.city, addressRegion: L.province, addressCountry: 'AR' },
  sameAs: [FB, IG],
  ...(siteUrl ? { url: siteUrl } : {}), ...(C.phoneTel ? { telephone: C.phoneTel } : {}),
};

const index = page({
  title: `${NAME} · Autos y motos en ${L.city}, ${L.province}`,
  desc: `${NAME} en ${L.city}, ${L.province}: autos y motos con financiación. Visitanos en ${L.address} o mirá las unidades en Facebook e Instagram.`,
  file: 'index.html',
  extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n`,
  body: `${header()}
<main id="top">
<div class="hero"><div class="hx-copy">
<p class="ey">${esc(L.city)} · ${esc(L.province)}</p>
<h1><span class="sr">${esc(NAME)}: </span>Autos y motos <em>en ${esc(L.city)}</em></h1>
<p class="lead">Concesionario de ${esc(L.city)} del ${esc(GNAME)}. Usados multimarca, financiación y tu usado como parte de pago: mirá las unidades y visitanos en ${esc(L.address)}.</p>
<div class="row"><a class="btn p" href="#unidades">Ver unidades</a><a class="btn" href="${L.mapsUrl}" ${EXT}>Cómo llegar</a></div></div>
<div class="hx-card"><p class="k">Visitanos</p><p class="v">${esc(L.address)}<br>${esc(L.city)}, ${esc(L.province)}</p><a class="btn sm" href="${L.mapsUrl}" ${EXT}>Abrir en Google Maps</a></div>
</div>

<section id="unidades" aria-labelledby="unidades-t"><div class="w">
<p class="ey">Unidades</p><h2 id="unidades-t">Nuestras <em>unidades</em></h2>
<p class="sec-p">Usados publicados para ${esc(L.city)}.</p>
${unidades}
</div></section>

<section id="financiacion" aria-labelledby="fin-t"><div class="w">
<p class="ey">Financiación y servicios</p><h2 id="fin-t">Financiá tu <em>próximo vehículo</em></h2>
<p class="sec-p">Ofrecemos financiación para autos y motos. Los montos y condiciones dependen de la unidad y de cada solicitante: consultanos por la que te interese.</p>
<div class="cards"><div class="card"><h3>Créditos Más Autos</h3><p>Figuramos en el listado de concesionarias adheridas a Créditos Más Autos del Banco de la Nación Argentina (listado del 16 de julio de 2025). <a href="${BNA}" ${EXT}>Ver el listado</a>.</p></div>${hasSvc('permuta') || hasSvc('tasacion') ? `<div class="card"><h3>Tu usado, parte de pago</h3><p>${[hasSvc('permuta') ? 'Recibimos vehículos usados como parte de pago.' : '', hasSvc('tasacion') ? 'La tasación es sin cargo.' : ''].filter(Boolean).join(' ')}</p></div>` : ''}${hasSvc('garantia') ? `<div class="card"><h3>Revisión técnica y garantía</h3><p>Los usados pasan por revisión técnica antes de publicarse y se entregan con garantía. Las condiciones dependen de cada vehículo.</p></div>` : ''}</div>
<p class="src">Servicios según lo informado por ${esc(GNAME)} en <a href="${GWEB}" ${EXT}>su sitio</a>.</p>
</div></section>

<section id="nosotros" aria-labelledby="nos-t"><div class="w">
<p class="ey">Nosotros</p><h2 id="nos-t">Quiénes <em>somos</em></h2>
<p class="sec-p">${esc(NAME)} es un concesionario de ${esc(L.city)} que forma parte del ${esc(GNAME)}. ${esc(D.presentacion.antiguedad)}</p>
</div></section>

<section id="contacto" class="ct" aria-labelledby="contacto-t"><div class="w">
<p class="ey">Contacto</p><h2 id="contacto-t">Dónde <em>encontrarnos</em></h2>
<div class="ct-g"><dl>${dl.map(([t, v]) => `<dt>${t}</dt><dd>${v}</dd>`).join('')}</dl>
<div class="ct-c"><p class="ct-t">¿Buscás un auto o una moto?</p><p>Escribinos y te contamos disponibilidad, precio y formas de pago de la unidad que te interese.</p><div class="row"><a class="btn p" href="${ctaHead.href}" ${EXT}>${WA ? 'Escribir por WhatsApp' : 'Escribir por Facebook'}</a><a class="btn" href="${IG}" ${EXT}>Instagram</a></div></div></div>
</div></section>
</main>
${footer(true)}`,
});

const privacidad = page({
  title: `Privacidad y avisos · ${NAME}`,
  desc: `Política de privacidad preliminar y avisos de ${NAME}.`,
  file: 'privacidad.html',
  body: `${header('./', '#top')}
<main id="top"><section><div class="w doc">
<p class="ey">Avisos</p><h1>Privacidad y <em>avisos</em></h1>
<h2>Datos personales</h2>
<p>Este sitio no tiene formularios, cuentas ni cookies propias y no guarda datos de quienes lo visitan. Los botones de contacto abren Facebook, Instagram, el sitio de ${esc(GNAME)}${C.whatsApp ? ', WhatsApp' : ''} o Google Maps, que tienen sus propias políticas de privacidad.</p>
<h2>Información de las unidades</h2>
<p>Los datos de las unidades (año, kilometraje, precio, disponibilidad) provienen de las publicaciones de la agencia y del catálogo público de ${esc(GNAME)}, y pueden haber cambiado. Confirmá siempre con ${esc(NAME)} antes de decidir.</p>
<h2>Documento preliminar</h2>
<p>Este texto es preliminar y debe revisarse profesionalmente antes de la publicación definitiva.</p>
<p><a class="btn sm" href="./">Volver al inicio</a></p>
</div></section></main>
${footer(false)}`,
});

const home404 = siteUrl || './';
const nf = page({
  title: `Página no encontrada · ${NAME}`,
  desc: `La página que buscás no existe. Volvé al inicio de ${NAME}.`,
  file: '404.html', withFonts: false,
  extraHead: siteUrl ? '' : '<script>(function(){var s=location.pathname.split("/").filter(Boolean),b=/github\\.io$/.test(location.hostname)&&s.length?"/"+s[0]+"/":"/";document.addEventListener("DOMContentLoaded",function(){document.getElementById("home").href=b})})()</script>\n',
  body: `<main class="nf"><div><p class="ey">Error 404</p><h1>No encontramos <em>esa página</em></h1><p>Puede que el enlace esté mal escrito o que la página ya no exista.</p><a id="home" class="btn p" href="${home404}">Volver al inicio</a></div></main>`,
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
<meta name="theme-color" content="#0d0d0d">
<meta property="og:type" content="website">
<meta property="og:title" content="Coordiná tu visita · ${esc(NAME)}">
<meta property="og:locale" content="es_AR">
${canon('reserva.html')}<link rel="manifest" href="site.webmanifest">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="stylesheet" href="css/reserva.css"><link rel="stylesheet" href="css/motion.css">
</head>
<body>
<main id="booking" data-step="month">
  <header class="booking-nav">
    <a class="brand" href="index.html" aria-label="Volver a ${esc(NAME)}">${esc(NAME)}</a>
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
write('site.webmanifest', JSON.stringify({ name: NAME, short_name: 'Horizonte', description: `Autos y motos en ${L.city}, ${L.province}.`, lang: 'es-AR', start_url: './', scope: './', display: 'standalone', background_color: '#0d0d0d', theme_color: '#0d0d0d', icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }] }, null, 2) + '\n');
write('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f8f8f"/><stop offset=".5" stop-color="#f6f6f4"/><stop offset="1" stop-color="#9b9b9b"/></linearGradient></defs><rect width="64" height="64" rx="10" fill="#0d0d0d"/><path d="M18 14v30M46 14v30M18 29h28" stroke="url(#g)" stroke-width="7" fill="none"/><path d="M10 52h44" stroke="url(#g)" stroke-width="3" fill="none"/></svg>\n');

console.log(`Generado: index.html (${(index.length / 1024).toFixed(1)} KB), privacidad.html, reserva.html, 404.html · ${autos.length} unidades · modo ${demo ? 'demo (noindex)' : 'producción'}`);
