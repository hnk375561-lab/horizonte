// Arma _site/ con SOLO los archivos públicos (lista blanca). data/, golive/, docs/, scripts/ y notas no se publican.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
const files = ['index.html', 'privacidad.html', '404.html', 'robots.txt', 'site.webmanifest', 'favicon.svg', '.nojekyll'];
const optional = ['sitemap.xml'];
const dirs = ['fonts', 'images'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
let n = 0;
for (const f of files) {
  if (!fs.existsSync(path.join(root, f))) { console.error(`Falta ${f}. ¿Corriste npm run build?`); process.exit(1); }
  fs.copyFileSync(path.join(root, f), path.join(out, f)); n++;
}
for (const f of optional) if (fs.existsSync(path.join(root, f))) { fs.copyFileSync(path.join(root, f), path.join(out, f)); n++; }
for (const d of dirs) {
  const src = path.join(root, d);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(out, d), { recursive: true });
  for (const f of fs.readdirSync(src)) if (/\.(woff2|webp|png|jpe?g|svg|avif)$/i.test(f)) { fs.copyFileSync(path.join(src, f), path.join(out, d, f)); n++; }
}
console.log(`_site/ listo: ${n} archivos`);
