import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { thin, traceStrokes, simplify } from '../src/lib/script-text.mjs';

const caligrafia = JSON.parse(readFileSync(new URL('../src/data/caligrafia.json', import.meta.url), 'utf8'));

// Dibuja rectángulos de tinta en un mapa de bits.
function bitmap(width, height, rects) {
  const img = new Uint8Array(width * height);
  for (const [x0, y0, x1, y1] of rects) for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) img[y * width + x] = 1;
  return img;
}

test('el adelgazamiento deja una línea de un píxel', () => {
  const skeleton = thin(bitmap(40, 12, [[2, 3, 38, 9]]), 40, 12);
  for (let x = 6; x < 34; x++) {
    const column = [...Array(12).keys()].reduce((sum, y) => sum + skeleton[y * 40 + x], 0);
    assert.equal(column, 1, `columna ${x}`);
  }
});
test('los trazos se ordenan de izquierda a derecha y los signos pequeños van tras su palabra', () => {
  // Palabra larga a la izquierda, palabra larga a la derecha y un «punto» sobre la primera.
  const [w, h] = [120, 30];
  const strokes = traceStrokes(thin(bitmap(w, h, [[70, 18, 115, 23], [5, 18, 60, 23], [30, 3, 36, 8]]), w, h), w, h);
  const firstX = strokes.map(s => Math.min(...s.map(([x]) => x)));
  assert.equal(strokes.length, 3);
  assert.ok(firstX[0] < 20, 'empieza por la palabra de la izquierda');
  assert.ok(firstX[1] > 25 && firstX[1] < 40, 'después, su punto');
  assert.ok(firstX[2] > 65, 'y al final la palabra de la derecha');
});
test('la simplificación conserva los extremos', () => {
  const line = Array.from({ length: 20 }, (_, i) => [i, 0]);
  assert.deepEqual(simplify(line), [[0, 0], [19, 0]]);
});
test('las cuatro frases están generadas, en orden de pluma y con una duración razonable', () => {
  for (const text of ['Feed your soul', 'Brunch time', 'Come as you are', 'See you soon']) {
    const { strokes, viewBox, ink, maskWidth } = caligrafia[text];
    assert.ok(ink.length > 100 && maskWidth > 0 && viewBox.split(' ').length === 4);
    strokes.slice(1).forEach((stroke, i) => assert.ok(stroke.delay >= strokes[i].delay + strokes[i].duration));
    const total = strokes.at(-1).delay + strokes.at(-1).duration;
    assert.ok(total > 1.5 && total < 4.5, `${text}: ${total}s`);
  }
});
