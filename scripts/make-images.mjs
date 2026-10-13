// Genera variantes responsive para fotos propias/autorizadas de una unidad o del hero.
// Unidad: node scripts/make-images.mjs <id> [directorio]
// Hero:   node scripts/make-images.mjs --hero <archivo-o-directorio>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
let sharp;
try { sharp = (await import('sharp')).default; } catch { console.error('Falta sharp: correr "npm install" primero.'); process.exit(1); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const isHero = args[0] === '--hero';
const sourceArg = isHero ? args[1] : args[1];
const id = isHero ? null : args[0];
if (!sourceArg && !isHero) { console.error('Uso: node scripts/make-images.mjs <id> [directorio] | --hero <archivo-o-directorio>'); process.exit(1); }
const source = sourceArg ? path.resolve(sourceArg) : path.join(root, 'images', 'autos', id);
const sourceFiles = fs.existsSync(source) && fs.statSync(source).isDirectory()
  ? fs.readdirSync(source).filter((f) => /\.(jpe?g|png|tiff?)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((f) => path.join(source, f))
  : fs.existsSync(source) ? [source] : [];
if (!sourceFiles.length) { console.error('No hay fotos JPG/PNG/TIFF en ' + source); process.exit(1); }
const outDir = isHero ? path.join(root, 'images') : (fs.mkdirSync(path.join(root, 'images', 'autos', id), { recursive: true }), path.join(root, 'images', 'autos', id));
const widths = isHero ? [1280, 800] : [1280, 800, 480];
const cleanBase = (file) => path.basename(file, path.extname(file)).replace(/-(?:480|800|1280)$/, '');
const fitFor = (w) => isHero ? { width: w, withoutEnlargement: true } : { width: w, withoutEnlargement: true, fit: 'inside' };
const outputs = [];
for (const file of sourceFiles) {
  const base = cleanBase(file);
  const meta = await sharp(file, { failOn: 'none' }).rotate().metadata();
  const ratio = (meta.width && meta.height) ? meta.height / meta.width : 2 / 3;
  const height = Math.round((isHero ? Math.min(1280, meta.width || 1280) : 1280) * ratio);
  for (const width of widths) {
    const stem = isHero ? `hero-${width}` : `${base}-${width}`;
    const pipeline = sharp(file, { failOn: 'none' }).rotate().resize(fitFor(width));
    await pipeline.clone().webp({ quality: isHero && width === 800 ? 68 : 78 }).toFile(path.join(outDir, `${stem}.webp`));
    await pipeline.clone().avif({ quality: 50 }).toFile(path.join(outDir, `${stem}.avif`));
  }
  if (!isHero) outputs.push({ src: `images/autos/${id}/${base}-800.webp`, srcset: `images/autos/${id}/${base}-480.webp 480w, images/autos/${id}/${base}-800.webp 800w, images/autos/${id}/${base}-1280.webp 1280w`, alt: '', width: Math.min(1280, meta.width || 1280), height: Math.round(Math.min(1280, meta.width || 1280) * ratio) });
}
if (isHero) console.log('Hero generado: images/hero-1280.webp, images/hero-800.webp y variantes AVIF.');
else console.log(JSON.stringify({ id, fotos: outputs }, null, 2));
