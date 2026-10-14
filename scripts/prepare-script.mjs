// Genera src/data/caligrafia.json: para cada frase, la tinta (contornos de Waterfall)
// y la máscara de trazos ordenados que la destapa como si se escribiera a mano.
// Uso: npm run caligrafia
import { readFile, writeFile } from 'node:fs/promises';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { thin, traceStrokes, simplify, toPath, timeStrokes } from '../src/lib/script-text.mjs';

export const phrases = ['Feed your soul', 'Brunch time', 'Come as you are', 'See you soon'];
const SCALE = 0.5;          // píxeles por unidad de fuente al rasterizar
const PAD = 60;             // margen en unidades de fuente
const SPEED = 4600;         // velocidad de la pluma, en unidades de fuente por segundo

const file = await readFile(new URL('../src/fonts/waterfall.woff', import.meta.url));
const font = opentype.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
const out = {};
for (const text of phrases) {
  const path = font.getPath(text, 0, 0, font.unitsPerEm);
  const box = path.getBoundingBox();
  const [minX, minY] = [Math.floor(box.x1 - PAD), Math.floor(box.y1 - PAD)];
  const [w, h] = [Math.ceil(box.x2 - box.x1 + PAD * 2), Math.ceil(box.y2 - box.y1 + PAD * 2)];
  const ink = path.toPathData(1);
  const [pw, ph] = [Math.round(w * SCALE), Math.round(h * SCALE)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" viewBox="${minX} ${minY} ${w} ${h}"><rect x="${minX}" y="${minY}" width="${w}" height="${h}" fill="#fff"/><path d="${ink}"/></svg>`;
  const { data, info } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  const bitmap = Uint8Array.from(data, v => (v < 128 ? 1 : 0));
  const skeleton = thin(bitmap, info.width, info.height);
  const inkPixels = bitmap.reduce((s, v) => s + v, 0);
  const skeletonPixels = skeleton.reduce((s, v) => s + v, 0);
  const thickness = inkPixels / skeletonPixels / SCALE; // grosor medio del trazo, en unidades
  const strokes = traceStrokes(skeleton, info.width, info.height, { spur: thickness * SCALE * 1.5 })
    .map(points => simplify(points, 0.7).map(([x, y]) => [minX + (x + 0.5) / SCALE, minY + (y + 0.5) / SCALE]));
  const timed = timeStrokes(strokes, { speed: SPEED, lift: 0.05 });
  out[text] = {
    viewBox: `${minX} ${minY} ${w} ${h}`,
    ink,
    // Lo bastante ancha para cubrir el trazo y su antialias, sin destapar letras vecinas.
    maskWidth: Math.round(thickness * 2.6 + 6),
    strokes: timed.map(({ points, delay, duration }) => ({ d: toPath(points), delay, duration })),
  };
  console.log(`${text}: ${timed.length} trazos, ${(timed.at(-1).delay + timed.at(-1).duration).toFixed(2)} s, grosor ${thickness.toFixed(1)}`);
}
await writeFile(new URL('../src/data/caligrafia.json', import.meta.url), JSON.stringify(out));
