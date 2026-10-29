// Fondo con profundidad para toda la web: el grano del papel, las sombras de hojas, la pincelada clara detrás de las
// fotos y las plantas pintadas de las esquinas. Todo se dibuja aquí (sin fotos ni recortes), así que pesa poco y se ve
// nítido en cualquier pantalla. Uso: node scripts/prepare-fondo.mjs → public/media/fondo/
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const out = 'public/media/fondo';
await mkdir(out, { recursive: true });

// Azar con semilla: cada vez que se ejecuta sale el mismo dibujo
const random = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const f = n => Math.round(n * 10) / 10;
const rad = a => (a * Math.PI) / 180;
// Curva suave que pasa por todos los puntos (Catmull-Rom convertida a Bézier)
const smooth = (pts, close = false) => {
  let s = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    s += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}, ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return close ? s + ' Z' : s;
};

// ——— Plantas de las esquinas ———
// Hoja alargada de platanera o ave del paraíso, en coordenadas locales: nace en (0, 0) y apunta hacia +x.
// Cada mitad es un trazado aparte con su degradado (la de arriba con luz, la de abajo en sombra), y así parece doblada
// por el nervio central. Los nervios laterales salen del central hacia la punta.
function leaf({ length: L, width: W, bend = 0.12, lower = 0.82 }) {
  const n = 14;
  const mid = t => [L * t, bend * L * t * t];
  const normal = t => { const a = Math.atan2(2 * bend * L * t, L); return [-Math.sin(a), Math.cos(a)]; };
  const half = t => Math.sin(Math.PI * t ** 0.9) ** 1.1 * (1 - 0.1 * t);
  const edge = (t, side, k = 1) => { const [x, y] = mid(t), [nx, ny] = normal(t), w = W * half(t) * (side < 0 ? 1 : lower) * k; return [x + side * nx * w, y + side * ny * w]; };
  const ts = Array.from({ length: n + 1 }, (_, i) => i / n);
  const midPts = ts.map(mid);
  const side = s => smooth([...midPts, ...ts.slice().reverse().map(t => edge(t, s)).slice(1)], true);
  // Nervios: del central hacia el borde, inclinados hacia la punta y sin llegar del todo al borde
  const veins = s => ts.filter((_, i) => i > 1 && i < n - 2).map(t => {
    const a = mid(t), b = edge(Math.min(t + 0.07, 0.97), s, 0.9), c = edge(Math.min(t + 0.03, 0.97), s, 0.5);
    return `M${f(a[0])} ${f(a[1])} Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`;
  }).join(' ');
  return { top: side(-1), bottom: side(1), rib: smooth(midPts.slice(0, n - 1)), veinsTop: veins(-1), veinsBottom: veins(1) };
}

// Una mata de hojas que sale de la esquina inferior izquierda de su caja (las de la derecha se voltean en CSS).
// Cada hoja: ángulo (0 = derecha, negativo = hacia arriba), largo, ancho, curva y largo del tallo hasta la hoja.
function cluster(name, { w, h, leaves }) {
  const ox = 0, oy = h;
  const defs = `<linearGradient id="${name}-luz" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3F6142"/><stop offset=".55" stop-color="#5E7F4E"/><stop offset="1" stop-color="#86A06A"/></linearGradient>
<linearGradient id="${name}-sombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C4A34"/><stop offset="1" stop-color="#40603F"/></linearGradient>
<linearGradient id="${name}-luz-atras" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#55744F"/><stop offset=".55" stop-color="#7A9663"/><stop offset="1" stop-color="#A3B585"/></linearGradient>
<linearGradient id="${name}-sombra-atras" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3F5E42"/><stop offset="1" stop-color="#58764F"/></linearGradient>
<linearGradient id="${name}-oro" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C8922A"/><stop offset="1" stop-color="#E3B652"/></linearGradient>`;
  const stems = [], body = [];
  for (const l of leaves) {
    const a = rad(l.angle), sx = ox + l.from[0], sy = oy - l.from[1];
    const bx = sx + Math.cos(a) * l.stem, by = sy + Math.sin(a) * l.stem;
    const transform = `translate(${f(bx)} ${f(by)}) rotate(${f(l.angle + (l.tilt ?? 0))})`;
    if (l.gold) {
      // Hoja dorada fina: una mitad rellena y la otra solo con el contorno, como en las ilustraciones de la carta
      const g = leaf({ length: l.length, width: l.width, bend: l.bend ?? 0.08, lower: 0.9 });
      stems.push(`<path d="M${f(sx)} ${f(sy)} L${f(bx)} ${f(by)}" stroke="#C8922A" stroke-width="1.6" stroke-linecap="round"/>`);
      body.push(`<g transform="${transform}"><path d="${g.top}" fill="url(#${name}-oro)" fill-opacity=".92"/><path d="${g.bottom}" fill="none" stroke="#CE9628" stroke-width="1.3" stroke-linejoin="round"/><path d="${g.rib}" fill="none" stroke="#B98424" stroke-width="1.2" stroke-linecap="round"/></g>`);
      continue;
    }
    const g = leaf(l);
    // Las hojas de atrás, más claras: dan fondo a la mata
    const tone = l.back ? '-atras' : '';
    // Tallo que se afina desde la esquina hasta la hoja
    const cx = sx + Math.cos(a) * l.stem * 0.5 - Math.sin(a) * 6, cy = sy + Math.sin(a) * l.stem * 0.5 + Math.cos(a) * 6;
    stems.push(`<path d="M${f(sx)} ${f(sy)} Q${f(cx)} ${f(cy)} ${f(bx)} ${f(by)}" stroke="#3A5A3C" stroke-width="${f(l.width * 0.14)}" stroke-linecap="round" fill="none"/>`);
    body.push(`<g transform="${transform}"><path d="${g.bottom}" fill="url(#${name}-sombra${tone})"/><path d="${g.top}" fill="url(#${name}-luz${tone})"/>
<path d="${g.veinsTop}" fill="none" stroke="#D3DDB4" stroke-opacity=".22" stroke-width=".7" stroke-linecap="round"/><path d="${g.veinsBottom}" fill="none" stroke="#1F3826" stroke-opacity=".22" stroke-width=".7" stroke-linecap="round"/>
<path d="${g.rib}" fill="none" stroke="#B7C68F" stroke-opacity=".7" stroke-width="${f(Math.max(1.2, l.width * 0.035))}" stroke-linecap="round"/></g>`);
  }
  // Las hojas de detrás primero: el orden de la lista es de atrás hacia delante
  // Una sombra suave debajo de la mata la separa del papel
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}<filter id="${name}-s" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="7" stdDeviation="6" flood-color="#2B2418" flood-opacity=".16"/></filter></defs><g filter="url(#${name}-s)"><g fill="none">${stems.join('')}</g>${body.join('\n')}</g></svg>`;
  return svg;
}

const plantas = {
  // Mata grande para la esquina inferior izquierda del hero y de los cierres
  'hojas-a': { w: 440, h: 420, leaves: [
    { angle: -76, length: 160, width: 10, stem: 60, from: [16, 0], gold: true, bend: 0.1 },
    { angle: -50, length: 185, width: 11, stem: 70, from: [20, 0], gold: true, bend: 0.12 },
    { angle: -22, length: 150, width: 9, stem: 110, from: [14, 0], gold: true, bend: 0.1 },
    { angle: -92, length: 220, width: 34, bend: 0.2, stem: 46, from: [6, 0], back: true },
    { angle: -64, length: 260, width: 38, bend: 0.24, stem: 40, from: [10, 0], back: true },
    { angle: -36, length: 310, width: 42, bend: 0.2, stem: 36, from: [4, 0] },
    { angle: -10, length: 270, width: 38, bend: 0.18, stem: 26, from: [0, 0] },
  ] },
  // Mata pequeña y más tumbada para la esquina derecha (se voltea en CSS)
  'hojas-b': { w: 360, h: 330, leaves: [
    { angle: -62, length: 140, width: 9, stem: 66, from: [14, 0], gold: true, bend: 0.12 },
    { angle: -30, length: 125, width: 8, stem: 110, from: [10, 0], gold: true, bend: 0.1 },
    { angle: -80, length: 190, width: 30, bend: 0.2, stem: 38, from: [6, 0], back: true },
    { angle: -48, length: 240, width: 36, bend: 0.24, stem: 30, from: [4, 0] },
    { angle: -16, length: 220, width: 34, bend: 0.2, stem: 22, from: [0, 0] },
  ] },
};
for (const [name, def] of Object.entries(plantas)) {
  const svg = cluster(name, def);
  await writeFile(`${out}/${name}.svg`, svg);
  console.log(`${out}/${name}.svg ${svg.length} B`);
}

// ——— Grano del papel ———
// Baldosa de 256 px que encaja consigo misma por los cuatro lados: manchas muy suaves y poro fino, sin dibujo que se
// repita a la vista. Va en un solo color (ocre tostado, que además calienta un poco el papel) con transparencia, así sirve igual sobre el papel que sobre el salvia.
{
  const S = 256, rnd = random(7);
  const blur = (src, r) => {
    // Desenfoque de caja que da la vuelta por los bordes (por eso la baldosa no tiene costuras)
    const tmp = new Float32Array(S * S), dst = new Float32Array(S * S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let s = 0; for (let k = -r; k <= r; k++) s += src[y * S + ((x + k + S) % S)]; tmp[y * S + x] = s / (2 * r + 1); }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let s = 0; for (let k = -r; k <= r; k++) s += tmp[((y + k + S) % S) * S + x]; dst[y * S + x] = s / (2 * r + 1); }
    return dst;
  };
  const noise = () => Float32Array.from({ length: S * S }, () => rnd() - 0.5);
  const norm = a => { let m = 0; for (const v of a) m = Math.max(m, Math.abs(v)); return a.map(v => v / m); };
  const big = norm(blur(blur(noise(), 20), 20)), mid = norm(blur(noise(), 1)), fine = noise();
  const px = Buffer.alloc(S * S * 4);
  for (let i = 0; i < S * S; i++) {
    // Transparencia en pasos de 2/255: sin lossy no salen manchas de color al repetir la baldosa, y así comprime bien
    const alpha = Math.max(0, 0.036 + 0.008 * big[i] + 0.014 * mid[i] + 0.018 * fine[i]);
    px.set([150, 108, 36, Math.round((alpha * 255) / 2) * 2], i * 4);
  }
  await sharp(px, { raw: { width: S, height: S, channels: 4 } }).webp({ lossless: true, effort: 6 }).toFile(`${out}/papel.webp`);
  console.log(`${out}/papel.webp`);
}

// ——— Sombras de hojas ———
// Dos hojas de palmera que entran desde la esquina superior izquierda, ya desenfocadas: como la sombra que dejan las
// plantas del local con el sol de la mañana. Se dibuja pequeña (el desenfoque no pierde nada al ampliarse).
{
  const S = 420, rnd = random(11);
  const frond = (x0, y0, x1, y1, bow, size) => {
    const pts = [];
    const cx = (x0 + x1) / 2 + bow * (y1 - y0), cy = (y0 + y1) / 2 - bow * (x1 - x0);
    const at = t => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
    let s = `<path d="M${x0} ${y0} Q${f(cx)} ${f(cy)} ${x1} ${y1}" stroke-width="${f(size * 0.09)}" fill="none"/>`;
    for (let i = 3; i < 34; i++) {
      const t = i / 36, [x, y] = at(t), [xn, yn] = at(t + 0.01), a = Math.atan2(yn - y, xn - x);
      const len = size * (0.25 + Math.sin(Math.PI * t) * 0.75) * (0.85 + rnd() * 0.3);
      for (const side of [-1, 1]) {
        const b = a + side * rad(52 + rnd() * 10);
        const ex = x + Math.cos(b) * len, ey = y + Math.sin(b) * len;
        const mx = x + Math.cos(b) * len * 0.5 + Math.cos(a) * len * 0.12, my = y + Math.sin(b) * len * 0.5 + Math.sin(a) * len * 0.12;
        s += `<path d="M${f(x)} ${f(y)} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}" stroke-width="${f(size * 0.045)}" fill="none"/>`;
      }
      pts.push([x, y]);
    }
    return s;
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><g stroke="#fff" stroke-linecap="round">${frond(-30, -20, 330, 250, 0.12, 70)}${frond(-40, 90, 250, 400, -0.1, 58)}</g></svg>`;
  const mask = await sharp(Buffer.from(svg)).extractChannel(3).blur(3.2).toBuffer();
  await sharp({ create: { width: S, height: S, channels: 3, background: '#3B3526' } }).joinChannel(await sharp(mask).linear(0.15, 0).toBuffer()).webp({ quality: 70, alphaQuality: 70 }).toFile(`${out}/sombra-hojas.webp`);
  console.log(`${out}/sombra-hojas.webp`);
}

// ——— Pincelada ———
// Pinceladas secas de pintura clara, como la que hay detrás del arco del hero. Se pinta píxel a píxel: cada fila es
// una cerda que carga más o menos pintura, el trazo se seca hacia el final y los extremos quedan deshilachados.
{
  const W = 760, H = 640, rnd = random(23);
  // Ruido suave con semilla, estirado a lo largo del trazo
  const grid = Array.from({ length: 64 * 64 }, rnd);
  const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, g = (a, b) => grid[((b & 63) << 6) | (a & 63)], s = t => t * t * (3 - 2 * t);
    const a = g(xi, yi) + (g(xi + 1, yi) - g(xi, yi)) * s(u), b = g(xi, yi + 1) + (g(xi + 1, yi + 1) - g(xi, yi + 1)) * s(u); return a + (b - a) * s(v); };
  const strokes = [
    { x0: 60, x1: 700, y: 90, h: 120, tilt: -3, dir: 1 },
    { x0: 20, x1: 740, y: 200, h: 170, tilt: 1.5, dir: -1 },
    { x0: 70, x1: 690, y: 360, h: 150, tilt: -2, dir: 1 },
    { x0: 150, x1: 640, y: 500, h: 90, tilt: 2.5, dir: -1 },
  ];
  const alpha = new Float32Array(W * H), tone = new Float32Array(W * H);
  strokes.forEach((st, k) => {
    const tan = Math.tan(rad(st.tilt));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const yy = y - (x - W / 2) * tan - st.y; // fila dentro del trazo
      if (yy < -20 || yy > st.h + 20) continue;
      const row = yy + k * 997;
      // Bordes de arriba y abajo irregulares, y principio y final de cada cerda a distinta altura
      const top = 10 * vn(x / 60, k * 7), bottom = st.h - 10 * vn(x / 60, k * 7 + 3);
      const vedge = Math.min(1, Math.max(0, (yy - top) / 6), Math.max(0, (bottom - yy) / 6));
      const start = st.x0 + 70 * vn(row / 3, 1) ** 2, end = st.x1 - 140 * vn(row / 2.5, 5) ** 1.5;
      if (x < start || x > end || vedge <= 0) continue;
      // Avance a lo largo del trazo (0 donde se apoya el pincel, 1 donde se acaba la pintura)
      const p = st.dir > 0 ? (x - start) / (end - start) : (end - x) / (end - start);
      const bristle = 0.55 + 0.45 * vn(x / 90, row / 1.3);
      const dry = p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) * 1.6 * (0.6 + vn(x / 30, row / 1.1)));
      const a = 0.9 * vedge * bristle * dry * Math.min(1, (p * 14));
      const i = y * W + x;
      alpha[i] = Math.min(1, alpha[i] + a * (1 - alpha[i]));
      tone[i] = vn(x / 140, row / 1.8);
    }
  });
  const px = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    // Pintura de cal tostada con vetas blancas: las cerdas cargan más o menos blanco y se ve el relieve
    const k = Math.min(1, Math.max(0, (tone[i] - 0.3) * 1.8));
    const c = [0, 1, 2].map(j => Math.round([216, 206, 186][j] + ([255, 253, 247][j] - [216, 206, 186][j]) * k));
    px.set([...c, Math.round(alpha[i] * 235)], i * 4);
  }
  // Se guarda a menos de dos tercios: es una textura suave y así pesa la mitad
  await sharp(px, { raw: { width: W, height: H, channels: 4 } }).resize(480).webp({ quality: 60, alphaQuality: 55 }).toFile(`${out}/pincelada.webp`);
  console.log(`${out}/pincelada.webp`);
}
