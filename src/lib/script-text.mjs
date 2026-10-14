// Caligrafía que se escribe sola. La tinta visible es la tipografía real (Waterfall);
// estas funciones calculan su línea central (esqueleto) y la ordenan como trazos de
// pluma, para usarla como máscara que va destapando las letras en orden de escritura.

const round = n => Math.round(n * 10) / 10;

/** Adelgazamiento de Zhang-Suen: deja la tinta (1) con un píxel de grosor. */
export function thin(ink, width, height) {
  const img = Uint8Array.from(ink);
  const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : img[y * width + x]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const pass of [0, 1]) {
      const remove = [];
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        if (!img[y * width + x]) continue;
        const n = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
        const b = n.reduce((sum, v) => sum + v, 0);
        if (b < 2 || b > 6) continue;
        let a = 0;
        for (let i = 0; i < 8; i++) if (!n[i] && n[(i + 1) % 8]) a++;
        if (a !== 1) continue;
        if (pass === 0 ? n[0] * n[2] * n[4] || n[2] * n[4] * n[6] : n[0] * n[2] * n[6] || n[0] * n[4] * n[6]) continue;
        remove.push(y * width + x);
      }
      for (const i of remove) img[i] = 0;
      if (remove.length) changed = true;
    }
  }
  return img;
}

const angleBetween = (a, b) => Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / ((Math.hypot(...a) * Math.hypot(...b)) || 1))));
const polyLength = pts => pts.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - pts[i][0], y - pts[i][1]), 0);

/**
 * Convierte el esqueleto en trazos de pluma ordenados: palabras de izquierda a derecha,
 * cada una de un tirón cuando es posible, y los puntos y barras de la «t» justo después.
 * @returns {number[][][]} polilíneas en píxeles
 */
export function traceStrokes(skeleton, width, height, { spur = 4 } = {}) {
  const on = (x, y) => x >= 0 && y >= 0 && x < width && y < height && skeleton[y * width + x] === 1;
  // Vecinos en 8 direcciones, ignorando la diagonal cuando ya hay un camino ortogonal (evita falsos cruces).
  const neighbors = i => {
    const x = i % width, y = (i - x) / width, out = [];
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) if (on(x + dx, y + dy)) out.push((y + dy) * width + x + dx);
    for (const [dx, dy] of [[1, -1], [1, 1], [-1, 1], [-1, -1]]) if (on(x + dx, y + dy) && !on(x + dx, y) && !on(x, y + dy)) out.push((y + dy) * width + x + dx);
    return out;
  };
  const pixels = [];
  for (let i = 0; i < skeleton.length; i++) if (skeleton[i] === 1) pixels.push(i);
  const degree = new Map(pixels.map(i => [i, neighbors(i).length]));
  const isNode = i => degree.get(i) !== 2;
  // Los cruces suelen ocupar varios píxeles contiguos: se agrupan en un único nodo.
  const cluster = new Map();
  for (const p of pixels) if (isNode(p) && !cluster.has(p)) {
    const stack = [p];
    cluster.set(p, p);
    while (stack.length) for (const q of neighbors(stack.pop())) if (isNode(q) && !cluster.has(q)) { cluster.set(q, p); stack.push(q); }
  }
  const visited = new Set();
  const edges = [];
  // Recorre píxeles de grado 2 hasta llegar a un nodo (o volver al inicio en un bucle).
  const walk = (start, next) => {
    const path = [start, next];
    let prev = start, cur = next;
    while (!isNode(cur)) {
      visited.add(cur);
      const step = neighbors(cur).find(q => q !== prev);
      if (step === undefined || (visited.has(step) && step !== start)) break;
      path.push(step);
      if (step === start) break;
      prev = cur; cur = step;
    }
    return path;
  };
  const seenPairs = new Set();
  for (const p of pixels) if (isNode(p)) for (const q of neighbors(p)) {
    if (isNode(q)) {
      if (cluster.get(q) === cluster.get(p)) continue;
      const key = [cluster.get(p), cluster.get(q)].sort().join('-');
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      edges.push([p, q]);
    } else if (!visited.has(q)) edges.push(walk(p, q));
  }
  // Un punto pequeño puede quedar en un solo píxel: también se escribe.
  for (const p of pixels) if (degree.get(p) === 0) edges.push([p, p]);
  for (const p of pixels) if (!isNode(p) && !visited.has(p)) {
    // Bucle cerrado sin cruces (una «o» suelta).
    cluster.set(p, p);
    visited.add(p);
    edges.push(walk(p, neighbors(p)[0]));
  }
  const xy = i => [i % width, Math.floor(i / width)];
  let graph = edges.map(path => ({ points: path[0] === path.at(-1) && path.length === 2 ? [xy(path[0]), [xy(path[0])[0] + 0.5, xy(path[0])[1]]] : path.map(xy), a: cluster.get(path[0]) ?? path[0], b: cluster.get(path.at(-1)) ?? path.at(-1) }));
  // Podar ramitas cortas que el adelgazamiento deja en las puntas.
  const ends = new Map();
  for (const e of graph) for (const n of [e.a, e.b]) ends.set(n, (ends.get(n) ?? 0) + 1);
  graph = graph.filter(e => !(polyLength(e.points) < spur && (ends.get(e.a) === 1 || ends.get(e.b) === 1) && e.a !== e.b));
  graph.forEach((e, id) => { e.id = id; e.length = polyLength(e.points); });

  // Componentes conexas = palabras o signos sueltos.
  const parent = new Map();
  const find = n => { while (parent.get(n) !== n) n = parent.get(n); return n; };
  for (const e of graph) for (const n of [e.a, e.b]) if (!parent.has(n)) parent.set(n, n);
  for (const e of graph) parent.set(find(e.a), find(e.b));
  const groups = new Map();
  for (const e of graph) {
    const root = find(e.a);
    if (!groups.has(root)) groups.set(root, { edges: [], length: 0, minX: Infinity, maxX: -Infinity });
    const g = groups.get(root);
    g.edges.push(e); g.length += e.length;
    for (const [x] of e.points) { g.minX = Math.min(g.minX, x); g.maxX = Math.max(g.maxX, x); }
  }
  const all = [...groups.values()];
  const longest = Math.max(...all.map(g => g.length));
  const main = all.filter(g => g.length >= longest * 0.18).sort((a, b) => a.minX - b.minX);
  // Puntos y barras: se escriben al terminar la palabra con la que más se solapan.
  for (const small of all.filter(g => !main.includes(g))) {
    const center = (small.minX + small.maxX) / 2;
    const host = main.reduce((best, g) => {
      const d = center < g.minX ? g.minX - center : center > g.maxX ? center - g.maxX : 0;
      return d < best.d ? { g, d } : best;
    }, { g: main[0], d: Infinity }).g;
    (host.smalls ??= []).push(small);
  }
  const ordered = main.flatMap(g => [g, ...(g.smalls ?? []).sort((a, b) => a.minX - b.minX)]);

  const strokes = [];
  for (const group of ordered) {
    const unused = new Set(group.edges);
    const incident = n => [...unused].filter(e => e.a === n || e.b === n);
    const orient = (e, from) => (e.a === from ? e.points : [...e.points].reverse());
    const leftmostEnd = () => {
      let best;
      for (const e of unused) for (const [n, p] of [[e.a, e.points[0]], [e.b, e.points.at(-1)]]) {
        const free = incident(n).length === 1 ? 0 : 1; // preferir extremos libres
        const score = free * 1e6 + p[0];
        if (!best || score < best.score) best = { n, score };
      }
      return best.n;
    };
    let node = leftmostEnd();
    let stroke = [];
    let heading = null;
    while (unused.size) {
      const options = incident(node);
      if (!options.length) {
        if (stroke.length > 1) strokes.push(stroke);
        // Levantar la pluma y seguir por el extremo libre más cercano.
        const last = stroke.at(-1);
        let best;
        for (const e of unused) for (const [n, p] of [[e.a, e.points[0]], [e.b, e.points.at(-1)]]) {
          const score = Math.hypot(p[0] - last[0], p[1] - last[1]) + (incident(n).length === 1 ? 0 : 25);
          if (!best || score < best.score) best = { n, score };
        }
        node = best.n; stroke = []; heading = null;
        continue;
      }
      // En un cruce, la pluma sigue por el camino que menos la obliga a girar.
      const pick = heading ? options.reduce((best, e) => {
        const pts = orient(e, node);
        const ahead = pts[Math.min(6, pts.length - 1)];
        const turn = angleBetween(heading, [ahead[0] - pts[0][0], ahead[1] - pts[0][1]]);
        return turn < best.turn ? { e, turn } : best;
      }, { e: options[0], turn: Infinity }).e : options[0];
      unused.delete(pick);
      const pts = orient(pick, node);
      stroke.push(...(stroke.length ? pts.slice(1) : pts));
      const back = pts[Math.max(0, pts.length - 7)];
      heading = [pts.at(-1)[0] - back[0], pts.at(-1)[1] - back[1]];
      node = pick.a === node ? pick.b : pick.a;
    }
    if (stroke.length > 1) strokes.push(stroke);
  }
  return strokes;
}

/** Ramer-Douglas-Peucker. */
export function simplify(points, epsilon = 0.8) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1);
  const len = Math.hypot(bx - ax, by - ay);
  let index = 0, max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const d = len ? Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len : Math.hypot(x - ax, y - ay);
    if (d > max) { max = d; index = i; }
  }
  if (max <= epsilon) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplify(points.slice(index), epsilon)];
}

/** Catmull-Rom → Bézier: curva suave que pasa por todos los puntos. */
export function toPath(points) {
  const p = points.map(([x, y]) => [round(x), round(y)]);
  if (p.length < 3) return `M${p.map(pt => pt.join(' ')).join('L')}`;
  let d = `M${p[0].join(' ')}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [p0, p1, p2, p3] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
    const c1 = [round(p1[0] + (p2[0] - p0[0]) / 6), round(p1[1] + (p2[1] - p0[1]) / 6)];
    const c2 = [round(p2[0] - (p3[0] - p1[0]) / 6), round(p2[1] - (p3[1] - p1[1]) / 6)];
    d += `C${c1.join(' ')} ${c2.join(' ')} ${p2.join(' ')}`;
  }
  return d;
}

/** Reparte el tiempo a velocidad de pluma constante, con una pausa breve al levantarla. */
export function timeStrokes(strokes, { speed, lift = 0.05 }) {
  let time = 0;
  return strokes.map(points => {
    const duration = Math.max(polyLength(points) / speed, 0.05);
    const timed = { points, delay: +time.toFixed(2), duration: +duration.toFixed(2) };
    time += duration + lift;
    return timed;
  });
}
