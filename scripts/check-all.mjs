// Horizonte Automotores · comprobaciones estáticas de páginas y responsive.
// No reemplaza una prueba visual en navegador, pero evita que los comandos
// mobile/desktop terminen en éxito sin revisar nada.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv.includes('--mobile') ? 'mobile' : process.argv.includes('--desktop') ? 'desktop' : 'all';
const pages = ['index.html', 'reserva.html', 'privacidad.html', '404.html'];
const errors = [];
const warn = [];
const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => errors.push(message);

for (const page of pages) {
  if (!exists(page)) { fail(`${page}: falta la página generada`); continue; }
  const html = read(page);
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) fail(`${page}: se esperaba un único h1 y hay ${h1}`);
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/.test(match[0])) fail(`${page}: imagen sin alt`);
    if (!/\bwidth\s*=/.test(match[0]) || !/\bheight\s*=/.test(match[0])) fail(`${page}: imagen sin width/height`);
  }
  if (/href="#"/.test(html)) fail(`${page}: enlace href="#" sin destino`);
  if (/href="http:\/\//.test(html)) fail(`${page}: enlace http:// sin cifrar`);
  const ids = new Set();
  for (const match of html.matchAll(/\bid="([^"]+)"/g)) {
    if (ids.has(match[1])) fail(`${page}: id duplicado ${match[1]}`);
    ids.add(match[1]);
  }
  for (const match of html.matchAll(/(?:src|href)="(js\/[^"?#]+|images\/[^"?#]+|fonts\/[^"?#]+|site\.webmanifest|favicon\.svg)"/g)) {
    if (!exists(match[1])) fail(`${page}: recurso inexistente ${match[1]}`);
  }
}

const index = exists('index.html') ? read('index.html') : '';
for (const id of ['top', 'unidades', 'como-comprar', 'financiacion', 'guia', 'preguntas', 'visita', 'contacto']) {
  if (!new RegExp(`id="${id}"`).test(index)) fail(`index.html: falta la sección #${id}`);
}
if (!/data-menu-toggle/.test(index) || !/class="site-nav"/.test(index)) fail('index.html: falta la navegación mobile');
if (!/class="fab"/.test(index)) warn.push('index.html: no hay FAB de contacto; revisar si es intencional');

if (mode === 'mobile' && !/max-width:360px/.test(read('scripts/estilos.css'))) fail('responsive mobile: falta breakpoint estrecho de 360px');
if (mode === 'desktop' && !/min-width:981px/.test(read('scripts/estilos.css'))) fail('responsive desktop: falta regla de desktop explícita');

if (warn.length) for (const message of warn) console.log(`⚠ ${message}`);
if (errors.length) {
  console.error(`✖ QA ${mode}: ${errors.length} problema(s)`);
  errors.forEach((message) => console.error(`  ${message}`));
  process.exit(1);
}
console.log(`✓ QA ${mode}: ${pages.length} páginas, recursos, IDs, imágenes y estructura responsive verificados`);
