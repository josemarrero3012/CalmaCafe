import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getOpeningStatus } from '../src/lib/hours.mjs';

const schedule = { 0: [['09:00','15:00']], 1: [['09:00','16:00']], 2: [], 3: [['09:00','12:00'],['14:00','16:00']], 4: [['09:00','16:00']], 5: [['09:00','16:00']], 6: [['09:00','16:00']] };
test('hora de Canarias en verano, independiente de la hora del sistema', () => {
  assert.equal(getOpeningStatus(new Date('2026-07-06T08:00:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-07-06T15:00:00Z'), schedule).open, false);
});
test('hora de Canarias en invierno y límites de apertura/cierre', () => {
  assert.equal(getOpeningStatus(new Date('2026-01-05T08:59:00Z'), schedule).text, 'Cerrado · abre a las 09:00');
  assert.equal(getOpeningStatus(new Date('2026-01-05T09:00:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-01-05T15:59:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-01-05T16:00:00Z'), schedule).text, 'Cerrado · abre el miércoles a las 09:00');
});
test('turnos partidos, descanso semanal y salto al siguiente día', () => {
  assert.equal(getOpeningStatus(new Date('2026-01-07T12:30:00Z'), schedule).text, 'Cerrado · abre a las 14:00');
  assert.equal(getOpeningStatus(new Date('2026-01-06T10:00:00Z'), schedule).text, 'Cerrado · abre mañana a las 09:00');
  assert.equal(getOpeningStatus(new Date('2026-01-04T23:30:00Z'), schedule).text, 'Cerrado · abre mañana a las 09:00');
});
test('cambio de hora de verano a invierno en Canarias', () => {
  assert.equal(getOpeningStatus(new Date('2026-10-25T08:30:00Z'), schedule).open, false);
  assert.equal(getOpeningStatus(new Date('2026-10-25T09:00:00Z'), schedule).open, true);
});
test('sin horarios confirmados no se inventa una apertura', () => {
  assert.equal(getOpeningStatus(new Date(), {}).text, 'Horario por confirmar');
});
