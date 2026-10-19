import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { destacados, huecos, listas } from '../src/lib/destacados.mjs';

const carta = JSON.parse(await readFile('src/data/carta.json', 'utf8'));
const ids = new Set(carta.menus.flatMap(m => m.grupos.flatMap(g => g.platos.map(p => p.id))));

test('con la carta de hoy, Inicio tiene un plato con foto en cada hueco y bebidas en cada lista', () => {
  const { fotos, bebidas } = destacados(carta);
  for (const hueco of Object.keys(huecos)) {
    assert.ok(ids.has(fotos[hueco].id), `${hueco}: ${fotos[hueco].id} no está en la carta`);
    assert.ok(fotos[hueco].foto, `${hueco}: ${fotos[hueco].id} no tiene foto`);
  }
  for (const team of Object.keys(listas)) {
    assert.ok(bebidas[team].length > 0, `la lista ${team} está vacía`);
    assert.ok(bebidas[team].every(b => ids.has(b.id)));
  }
});

// Carta mínima: una sección por hueco, con los platos que se pidan.
const foto = { src: '/media/carta/x', width: 800, height: 600, widths: [160, 480, 800] };
const plato = (id, conFoto = true) => ({ id, nombre: `Plato ${id}`, precio: '1,00 €', descripcion: null, foto: conFoto ? foto : null });
const prueba = grupos => ({ menus: [{ grupos: Object.entries(grupos).map(([id, platos]) => ({ id, platos })) }] });
const completa = () => ({
  'carta-algo-dulce': huecos.dulce.ids.map(id => plato(id)),
  'carta-brunch': huecos.salado.ids.map(id => plato(id)),
  'bebidas-bebidas-calientes': [...huecos.cafe.ids, ...listas.coffee].map(id => plato(id)),
  'bebidas-bebidas-frias': [...huecos.matcha.ids, ...listas.matcha].map(id => plato(id)),
});

test('si están los preferidos, salen ellos y no hay avisos', () => {
  const { fotos, bebidas, avisos } = destacados(prueba(completa()));
  assert.equal(fotos.dulce.id, '422600');
  assert.equal(fotos.salado.id, '89630');
  assert.deepEqual(bebidas.coffee.map(b => b.id), listas.coffee.slice(0, 3));
  assert.deepEqual(avisos, []);
});

test('si la carta quita los Pancakes (18/10/2026), sale el siguiente preferido con foto y queda avisado', () => {
  const grupos = completa();
  grupos['carta-algo-dulce'] = [plato('721406', false), plato('721403'), plato('721405')];
  const { fotos, avisos } = destacados(prueba(grupos));
  assert.equal(fotos.dulce.id, '721403');
  assert.match(avisos.join('\n'), /422600/);
});

test('sin ningún preferido, usa el primer plato con foto de su sección; sin sección, el primero con foto de la carta', () => {
  const { 'carta-brunch': _, ...grupos } = completa();
  const { fotos } = destacados(prueba({ ...grupos, 'carta-algo-dulce': [plato('1', false), plato('2')] }));
  assert.equal(fotos.dulce.id, '2');
  assert.equal(fotos.salado.id, '2'); // Ya no hay Brunch: el primer plato con foto de la carta, que es el de «¡Algo dulce!»
});

test('si la carta quita el Calma Ice Latte (17/10/2026), la lista de café se completa con la siguiente bebida', () => {
  const grupos = completa();
  grupos['bebidas-bebidas-calientes'] = grupos['bebidas-bebidas-calientes'].filter(p => p.id !== '723815');
  const { bebidas, avisos } = destacados(prueba(grupos));
  assert.deepEqual(bebidas.coffee.map(b => b.id), ['93803', '93800', '551544']);
  assert.match(avisos.join('\n'), /723815/);
});

test('una carta sin ninguna foto es una importación rota y se dice claramente', () => {
  const sinFotos = prueba({ 'carta-brunch': [plato('1', false)] });
  assert.throws(() => destacados(sinFotos), /ningún plato con foto/);
});
