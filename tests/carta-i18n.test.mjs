import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const carta = JSON.parse(await readFile('src/data/carta.json', 'utf8'));
const traducciones = JSON.parse(await readFile('src/i18n/carta.json', 'utf8'));
const textos = new Set();
for (const menu of carta.menus) {
  textos.add(menu.nombre);
  menu.nota.forEach(n => textos.add(n));
  for (const grupo of menu.grupos) {
    textos.add(grupo.nombre);
    for (const p of grupo.platos) {
      [p.nombre, p.descripcion, ...p.notas, ...p.opciones, ...p.alergenos, ...p.extras.map(e => e.nombre)].filter(Boolean).forEach(x => textos.add(x));
    }
  }
}

test('cada texto de la carta tiene traducción al inglés, alemán y neerlandés', () => {
  const faltan = [...textos].filter(es => !['en', 'de', 'nl'].every(lang => traducciones[es]?.[lang]?.trim()));
  assert.deepEqual(faltan, [], 'Tras «npm run carta», añade estos textos a src/i18n/carta.json');
});

test('el glosario no guarda textos que ya no están en la carta', () => {
  const sobran = Object.keys(traducciones).filter(es => es !== '_nota' && !textos.has(es));
  assert.deepEqual(sobran, []);
});
