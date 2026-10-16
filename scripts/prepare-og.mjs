// Imagen para compartir (og:image / Twitter Card): 1200×630 con el fondo del hero y el logo claro.
// Sin texto, así que sirve para los cuatro idiomas. Uso: node scripts/prepare-og.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const W = 1200, H = 630;
const photo = await sharp('public/media/hero-fondo-1706.webp').resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
// Degradado oscuro a la izquierda, como el del hero, para que el logo se lea sobre la foto.
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#1E1A1A" stop-opacity=".78"/><stop offset=".55" stop-color="#1E1A1A" stop-opacity=".35"/><stop offset="1" stop-color="#1E1A1A" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
const logo = await sharp(await readFile('public/media/logo-full-light.svg'), { density: 300 }).resize({ width: 470 }).png().toBuffer();
const { height: logoH } = await sharp(logo).metadata();
await sharp(photo)
  .composite([{ input: shade }, { input: logo, left: 90, top: Math.round((H - logoH) / 2) }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile('public/media/og-calma.jpg');
console.log('public/media/og-calma.jpg');
