// Enredadera que trepa por el borde izquierdo de un arco y pasa por encima de la clave. Se calcula al compilar
// y devuelve trazados SVG en las unidades del <svg> que la contiene.
// El tallo sigue el contorno del arco a una distancia casi fija y se afina hacia la punta. Cada hoja sale del tallo
// con un rabito corto que nace debajo de él: el tallo se dibuja encima, así que la unión queda limpia y no asoma
// nada por el otro lado. Algunos nudos llevan una segunda hoja enfrente o un zarcillo, y la punta acaba en un brote.

const rad = a => (a * Math.PI) / 180;
const deg = a => (a * 180) / Math.PI;
const f = n => Math.round(n * 10) / 10;
const d = pts => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');

// Hoja en coordenadas locales: nace en (0, 0) con la base en cuña, apunta hacia +x y su punta se curva hacia -y
// (hacia la punta del tallo). Mide 60 de largo. El brote es una hoja cerrada más pequeña.
export const LEAF = {
  body: 'M0 0 C 6 -4.4, 14 -12, 28 -14 C 40 -15.7, 52 -11, 60 -4 C 50 4.6, 40 9.3, 31 9.3 C 20 9.3, 8 4.6, 0 0 Z',
  veins: 'M2 -0.4 C 18 -2.6, 38 -4.4, 56 -3.6 M16 -2.2 L 23 -10.2 M30 -3.4 L 37 -11.6 M20 -2.6 L 27 5.6 M35 -3.5 L 42 3.6',
  bud: 'M0 0 C 5 -6, 14 -7, 22 -1 C 14 4, 5 4, 0 0 Z',
  length: 60,
};

/**
 * @param {{ cx: number, cy: number, r: number, base: number, end?: number, offset?: number, wobble?: number,
 *   scale?: number, line?: number, leaves?: number, pairs?: number[], tendrils?: number[] }} arco
 *   Centro y radio del arco, altura donde nace la enredadera (en el lado recto izquierdo) y ángulo final en grados,
 *   contado desde el lado izquierdo (90 = la clave). `scale` ajusta el tamaño de tallo, hojas y zarcillos al arco;
 *   `line` es el grosor del contorno, en unidades del <svg>. `pairs` y `tendrils` son los nudos (número de hoja)
 *   que llevan una segunda hoja o un zarcillo enfrente.
 */
export function vine({ cx, cy, r, base, end = 104, offset = 14, wobble = 4, scale = 1, line = 1.7, leaves = 17, pairs = [4, 9, 13], tendrils = [7, 11, 15] }) {
  // Línea central: contorno del arco desplazado hacia fuera, con un vaivén suave
  const straight = base - cy;
  const total = straight + r * rad(end);
  // Puntos de la línea central y del contorno: los de siempre en los arcos, más en una enredadera larga (la de la
  // cronología) para que el tallo no se vea a tramos rectos
  const steps = Math.max(480, Math.ceil(total / 2)), segments = Math.max(120, Math.ceil(total / 8));
  const center = [];
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * total;
    const o = (offset + wobble * Math.sin(s / (30 * scale))) * scale;
    if (s <= straight) center.push([cx - r - o, base - s]);
    else {
      const phi = (s - straight) / r;
      center.push([cx - (r + o) * Math.cos(phi), cy - (r + o) * Math.sin(phi)]);
    }
  }
  const lengths = [0];
  for (let i = 1; i < center.length; i++) lengths.push(lengths[i - 1] + Math.hypot(center[i][0] - center[i - 1][0], center[i][1] - center[i - 1][1]));
  const length = lengths.at(-1);

  // Punto y dirección a una fracción t del largo
  const at = t => {
    const s = t * length;
    let i = lengths.findIndex(l => l >= s);
    if (i < 1) i = 1;
    const [x0, y0] = center[i - 1], [x1, y1] = center[i];
    const k = (s - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1);
    return { x: x0 + k * (x1 - x0), y: y0 + k * (y1 - y0), a: Math.atan2(y1 - y0, x1 - x0) };
  };
  const width = t => (1.1 + 6.2 * (1 - t) ** 0.8) * scale;

  // Recorrido de la máscara que la hace crecer: la línea central, alargada un poco por la base y por la punta.
  // grown(t) es la fracción de ese recorrido a la que queda el nudo t, para que cada hoja se abra cuando llega el tallo.
  const ext = 24 * scale;
  const first = at(0), tip = at(1);
  const grow = d([[first.x - Math.cos(first.a) * ext, first.y - Math.sin(first.a) * ext], ...center.filter((_, i) => i % Math.max(6, Math.round(steps / 80)) === 0), [tip.x + Math.cos(tip.a) * ext * 2, tip.y + Math.sin(tip.a) * ext * 2]]);
  const grown = t => f(((ext + t * length) / (length + 3 * ext)) * 1000) / 1000;

  // Tallo: contorno a ambos lados de la línea central, con la base redondeada
  const sideA = [], sideB = [];
  for (let k = 0; k <= segments; k++) {
    const t = k / segments, { x, y, a } = at(t), w = width(t) / 2;
    const nx = -Math.sin(a), ny = Math.cos(a);
    sideA.push([x + nx * w, y + ny * w]);
    sideB.push([x - nx * w, y - ny * w]);
  }
  const w0 = f(width(0) / 2);
  const stem = `${d([...sideA, ...sideB.reverse()])} A${w0} ${w0} 0 0 0 ${f(sideA[0][0])} ${f(sideA[0][1])} Z`;

  // Hojas alternas (side 1 hacia dentro del arco, -1 hacia fuera), cada vez más pequeñas hacia la punta
  const ANGLE = rad(48);
  const leaf = (t, side, size, light) => {
    const { x, y, a } = at(t);
    const dir = a + side * ANGLE;
    // El rabito va del centro del tallo (tapado) hasta 4 unidades fuera de su borde, donde empieza la hoja
    const reach = width(t) / 2 / Math.sin(ANGLE) + 4 * scale;
    const bx = x + Math.cos(dir) * reach, by = y + Math.sin(dir) * reach;
    const k = size / LEAF.length;
    return {
      petiole: `M${f(x)} ${f(y)} L${f(bx)} ${f(by)}`,
      transform: `translate(${f(bx)} ${f(by)}) rotate(${f(deg(dir))}) scale(${f(k * 1000) / 1000} ${f(k * side * 1000) / 1000})`,
      stroke: f((line / k) * 100) / 100,
      vein: f(((line * 0.65) / k) * 100) / 100,
      light,
      t: grown(t),
    };
  };
  const nodes = Array.from({ length: leaves }, (_, i) => 0.04 + (i * 0.9) / (leaves - 1));
  const leafList = nodes.flatMap((t, i) => {
    const side = i % 2 ? 1 : -1, size = (78 - 46 * t) * scale;
    const main = leaf(t, side, size, i % 3 === 0);
    return pairs.includes(i) ? [leaf(t, -side, size * 0.8, true), main] : [main];
  });

  // Zarcillos, enfrente de una hoja: un tallito que sale hacia delante, se curva y se enrosca hacia fuera, en el hueco
  // entre las dos hojas de ese lado. En coordenadas locales (+x hacia fuera), la espiral sigue la tangente del tallito.
  const coil = [];
  for (let j = 0; j <= 8; j++) coil.push([3 * j, 2.5 * (j / 8) ** 2]);
  const [px, py] = coil.at(-1), tangent = Math.atan2(5, 24), R = 6.5;
  const [ox, oy] = [px - Math.sin(tangent) * R, py + Math.cos(tangent) * R];
  for (let j = 1; j <= 60; j++) {
    const u = j / 60, phi = tangent - Math.PI / 2 + u * 2.7 * Math.PI, rr = R * (1 - 0.65 * u);
    coil.push([ox + rr * Math.cos(phi), oy + rr * Math.sin(phi)]);
  }
  const tendrilList = tendrils.map(i => {
    const { x, y, a } = at(nodes[i]), side = i % 2 ? -1 : 1;
    return { d: d(coil), transform: `translate(${f(x)} ${f(y)}) rotate(${f(deg(a + side * rad(30)))}) scale(${scale} ${scale * side})` };
  });

  // Brote en la punta, en la dirección del tallo: empieza un poco antes para tapar el final del tallo
  const budBase = at(0.995);
  const bud = { transform: `translate(${f(budBase.x)} ${f(budBase.y)}) rotate(${f(deg(tip.a))}) scale(${scale})`, stroke: f((line / scale) * 100) / 100, t: grown(1) };

  return { stem, leaves: leafList, tendrils: tendrilList, bud, grow, scale, line };
}
