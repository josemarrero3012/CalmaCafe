import { test } from 'node:test';
import assert from 'node:assert/strict';
import negocio from '../src/data/negocio.json' with { type: 'json' };
import { buildSchema } from '../src/lib/schema.mjs';

const schema = buildSchema(negocio, { pageUrl: 'https://example.com/', menuUrl: 'https://example.com/carta/' });
test('dirección completa con código postal y coordenadas de la ficha', () => {
  assert.equal(schema['@type'], 'CafeOrCoffeeShop');
  assert.equal(schema.address.postalCode, '35100');
  assert.deepEqual(schema.geo, { '@type': 'GeoCoordinates', latitude: 27.75221, longitude: -15.5774626 });
});
test('carta, mapa y ficha de Google enlazados', () => {
  assert.equal(schema.hasMenu, 'https://example.com/carta/');
  assert.match(schema.hasMap, /^https:\/\/www\.google\.com\/maps\/place\/Calma\+caf/);
  assert.ok(schema.sameAs.includes(negocio.mapas.ficha));
});
test('horario: lunes y de miércoles a domingo de 09:00 a 15:00; el martes no figura', () => {
  assert.deepEqual(schema.openingHoursSpecification, [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday'], opens: '09:00', closes: '15:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '15:00' },
  ]);
});
test('sin horario confirmado no se emite horario', () => {
  const sin = buildSchema({ ...negocio, horario: { ...negocio.horario, confirmado: false } });
  assert.equal(sin.openingHoursSpecification, undefined);
});
