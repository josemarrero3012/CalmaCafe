// Enredadera de la línea del tiempo (Calma): cuelga del principio de la cronología y crece hacia abajo a medida que
// se baja por la página, con la punta siempre un poco por delante de lo que se está leyendo. Cada hoja se abre cuando
// el tallo llega a ella. Se dibuja aquí y no al compilar porque su largo depende de la altura real de la cronología.
// Es la misma enredadera de vine.mjs, recta y dada la vuelta (crece de arriba abajo). Sin JS queda solo el hilo punteado.
import { LEAF, vine } from '../lib/vine.mjs';

const NS = 'http://www.w3.org/2000/svg';
const timeline = document.querySelector<HTMLElement>('.timeline');

if (timeline) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('timeline-vine');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  timeline.prepend(svg);
  timeline.classList.add('has-vine');

  const node = (tag: string, attrs: Record<string, string | number>, parent: Element) => {
    const el = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    parent.append(el);
    return el;
  };

  let drawn = '';
  const draw = () => {
    const height = Math.round(timeline.offsetHeight);
    const mobile = window.innerWidth < 700;
    // Más pequeña en móvil, donde va pegada al borde izquierdo junto al texto
    const scale = mobile ? 0.42 : 0.7, width = 200;
    if (drawn === `${height}:${scale}`) return;
    drawn = `${height}:${scale}`;
    // Una hoja cada ~90 px de tallo; algunas llevan otra enfrente y otras un zarcillo
    const leaves = Math.max(6, Math.round(height / (150 * scale)));
    const pairs = Array.from({ length: leaves }, (_, i) => i).filter(i => i % 4 === 3);
    const tendrils = Array.from({ length: leaves }, (_, i) => i).filter(i => i % 5 === 1 && i > 1);
    const line = 1.6;
    const geo = vine({ cx: width / 2 + 1, cy: 0, r: 1, base: height, end: 0, offset: 0, wobble: 5, scale, line, leaves, pairs, tendrils });

    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    const ink = '#1E1A1A', green = '#365B52', light = '#4F7D6C', vein = '#AFC7C7';
    // Dada la vuelta: la base queda arriba y la punta abajo
    const root = node('g', { transform: `translate(0 ${height}) scale(1 -1)` }, svg);
    const mask = node('mask', { id: 'timeline-vine-mask', maskUnits: 'userSpaceOnUse', x: -1000, y: -1000, width: width + 2000, height: height + 2000 }, root);
    node('path', { class: 'vine-grow', pathLength: 1, d: geo.grow, fill: 'none', stroke: '#fff', 'stroke-width': 70 * scale }, mask);
    const back = node('g', { mask: 'url(#timeline-vine-mask)', fill: 'none', stroke: ink, 'stroke-linecap': 'round' }, root);
    for (const tendril of geo.tendrils) node('path', { d: tendril.d, transform: tendril.transform, 'stroke-width': (line * 0.75) / scale, 'stroke-linejoin': 'round' }, back);
    for (const leaf of geo.leaves) node('path', { d: leaf.petiole, 'stroke-width': line * 1.2 }, back);
    for (const leaf of geo.leaves) {
      const g = node('g', { class: 'vine-leaf', style: `--t:${leaf.t}` }, node('g', { transform: leaf.transform }, root));
      node('path', { d: LEAF.body, fill: leaf.light ? light : green, stroke: ink, 'stroke-width': leaf.stroke, 'stroke-linejoin': 'round' }, g);
      node('path', { d: LEAF.veins, fill: 'none', stroke: vein, 'stroke-width': leaf.vein, 'stroke-linecap': 'round' }, g);
    }
    node('path', { d: geo.stem, mask: 'url(#timeline-vine-mask)', fill: green, stroke: ink, 'stroke-width': line * 0.65, 'stroke-linejoin': 'round' }, root);
    node('path', { class: 'vine-leaf', style: `--t:${geo.bud.t}`, d: LEAF.bud, fill: light, stroke: ink, 'stroke-width': geo.bud.stroke, 'stroke-linejoin': 'round' }, node('g', { transform: geo.bud.transform }, root));
  };

  // Lo crecido (0–1) es lo que la cronología ha pasado del 60 % de la ventana. Va en la cronología: el hilo punteado
  // también lo usa para quedarse solo por delante de la punta, como el camino que le queda por bajar.
  let frame = 0;
  const grow = () => {
    frame = 0;
    const box = timeline.getBoundingClientRect();
    const progress = reduce.matches ? 1 : Math.min(1, Math.max(0, (window.innerHeight * 0.6 - box.top) / box.height));
    timeline.style.setProperty('--p', progress.toFixed(4));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(grow); };

  draw();
  grow();
  new ResizeObserver(() => { draw(); schedule(); }).observe(timeline);
  window.addEventListener('scroll', schedule, { passive: true });
  reduce.addEventListener('change', schedule);
}
