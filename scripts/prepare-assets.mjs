import sharp from 'sharp';
import potrace from 'potrace';
import { mkdir, writeFile, copyFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { promisify } from 'node:util';

const trace = promisify(potrace.trace);
const originals = 'assets/originals';
const output = 'public/media';
await mkdir(output, { recursive: true });
await mkdir('assets/frames', { recursive: true });
const manifest = {};
async function optimize(name, source, sizes = [320, 480, 720, 960, 1170]) {
  const { width, height } = await sharp(source).metadata();
  const widths = sizes.filter(w => w <= width);
  for (const size of widths) {
    await sharp(source).rotate().resize(size).avif({ quality: 48, effort: 5 }).toFile(`${output}/${name}-${size}.avif`);
    await sharp(source).rotate().resize(size).webp({ quality: 78 }).toFile(`${output}/${name}-${size}.webp`);
  }
  manifest[name] = { width, height, widths };
  console.log(`Optimizada: ${name}`);
}
for (const name of ['mango-matcha','pizarra-yawn','berry-pancakes','plato-plancha','coffee-o-matcha','tortitas-fruta','calma-gambita','calma-roastbeef']) {
  await optimize(name, `${originals}/${name}.jpg`);
}
// Fondo del hero de Inicio: ocupa todo el ancho, así que llega hasta el tamaño original.
await optimize('hero-fondo', `${originals}/hero-fondo.png`, [640, 960, 1280, 1706]);
// Fotogramas completos: las obras permanecen dentro de la fotografía del local.
const frames = [
  ['interior-barra', 1.2], ['interior-ventanal', 7.2], ['interior-notas', 12.3],
  ['interior-mesa', 13.4], ['interior-cuadros', 18.3], ['interior-tapiz', 20.3],
  ['interior-luces', 24.8], ['interior-cojines', 27.5], ['interior-galeria', 34.2], ['interior-pizarra', 42.6],
];
for (const [name, time] of frames) {
  const file = `assets/frames/${name}.png`;
  execFileSync('ffmpeg', ['-v','error','-ss',String(time),'-i',`${originals}/interior.mp4`,'-frames:v','1','-y',file]);
  await optimize(name, file);
}
await optimize('interior-poster', 'assets/frames/interior-barra.png');
// Un recorrido continuo de 10 segundos: barra de madera hacia el ventanal.
for (const [extension, codec] of [['mp4', ['-c:v','libx264','-crf','29','-preset','slow','-movflags','+faststart']], ['webm', ['-c:v','libvpx-vp9','-crf','36','-b:v','0','-deadline','good','-cpu-used','2']]]) {
  const file = `${output}/interior.${extension}`;
  execFileSync('ffmpeg', ['-v','error','-ss','0.4','-i',`${originals}/interior.mp4`,'-t','10','-an','-vf','scale=432:768,fps=24','-pix_fmt','yuv420p',...codec,'-y',file]);
  const info = JSON.parse(execFileSync('ffprobe', ['-v','error','-show_streams','-of','json',file]));
  if (info.streams.some(s => s.codec_type === 'audio')) throw new Error('El vídeo contiene audio');
  if ((await stat(file)).size >= 2_000_000) throw new Error('Vídeo superior a 2 MB');
  console.log(`Vídeo sin audio: ${file} (${(await stat(file)).size} bytes)`);
}
// Extraer las formas originales mediante umbral; NO se reconstruye el wordmark.
const source = `${originals}/logo-fuente.jpg`;
const crops = {
  'logo-full': { left: 110, top: 413, width: 950, height: 815 },
  'logo': { left: 110, top: 413, width: 950, height: 540 },
  'lotus': { left: 500, top: 1005, width: 200, height: 218 },
};
for (const [name, crop] of Object.entries(crops)) {
  const bitmap = await sharp(source).extract(crop).grayscale().threshold(85).png().toBuffer();
  for (const [version, color] of [['dark','#1E1A1A'], ['light','#FAF6EF']]) {
    const svg = await trace(bitmap, { color, background: 'transparent', threshold: 128, turdSize: 2, optTolerance: 0.2 });
    await writeFile(`${output}/${name}-${version}.svg`, svg);
    await sharp(Buffer.from(svg)).png().toFile(`${output}/${name}-${version}.png`);
  }
}
await copyFile(`${output}/lotus-dark.svg`, 'public/favicon.svg');
for (const [family, file] of [['fraunces','fraunces-latin-wght-normal.woff2'],['dm-sans','dm-sans-latin-wght-normal.woff2'],['caveat','caveat-latin-wght-normal.woff2']]) {
  await copyFile(`node_modules/@fontsource-variable/${family}/files/${file}`,`public/fonts/${family}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${family}/LICENSE`,`public/fonts/${family}-LICENSE.txt`);
}
await writeFile('src/data/media.json', JSON.stringify(manifest, null, 2) + '\n');
