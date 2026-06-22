/**
 * Optimización de imágenes del portafolio y logos de clientes.
 * Redimensiona a un ancho razonable y reencoda a WebP (calidad ~80/85).
 * Genera además una imagen social og-camilo.jpg de 1200×630.
 *
 * Uso: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const DIR = 'public/assets/img/';
const kb = (n) => Math.round(n / 1024) + 'KB';

// Imágenes grandes de tarjetas de proyecto → ≤1600px de ancho, WebP q80.
const projects = [
  { in: 'portal-to-paradise.png', out: 'portal-to-paradise.webp' },
  { in: 'celebrando-a-gabo.webp', out: 'celebrando-a-gabo.webp' },
  { in: 'Acapulco_Chair.jpg', out: 'acapulco-chair.webp' },
  { in: 'era-de-los-datos.png', out: 'era-de-los-datos.webp' },
  { in: 'Portada-modulario.jpg', out: 'portada-modulario.webp' },
  { in: 'durero.jpg', out: 'durero.webp' },
];

// Logos de clientes (se muestran a ~80px) → ≤240px, WebP q85, con alfa.
const logos = [
  { in: 'nokia-usa.png', out: 'nokia-usa.webp' },
  { in: 'banco-republica.png', out: 'banco-republica.webp' },
  { in: 'logo-uniandes.png', out: 'logo-uniandes.webp' },
  { in: 'nbx.jpg', out: 'nbx.webp' },
  { in: 'ipes.png', out: 'ipes.webp' },
  { in: 'logoUniversidadElBosque.png', out: 'universidad-el-bosque.webp' },
  { in: 'colegio-marymount.jpg', out: 'colegio-marymount.webp' },
  { in: 'muzo.png', out: 'muzo.webp' },
  { in: 'sergio-arboleda-university.png', out: 'sergio-arboleda.webp' },
];

async function convert(list, { width, quality }) {
  for (const { in: src, out } of list) {
    const srcPath = DIR + src;
    const before = statSync(srcPath).size;
    // Leer a buffer primero permite sobrescribir el mismo archivo con seguridad.
    const input = readFileSync(srcPath);
    const buf = await sharp(input)
      .rotate() // respeta orientación EXIF
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    writeFileSync(DIR + out, buf);
    console.log(`${src} (${kb(before)}) → ${out} (${kb(buf.length)})`);
  }
}

async function makeOg() {
  const buf = await sharp(readFileSync(DIR + 'camilo-photo.webp'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  writeFileSync(DIR + 'og-camilo.jpg', buf);
  console.log(`og-camilo.jpg generada (${kb(buf.length)}, 1200x630)`);
}

await convert(projects, { width: 1600, quality: 80 });
await convert(logos, { width: 240, quality: 85 });
await makeOg();
console.log('Listo.');
