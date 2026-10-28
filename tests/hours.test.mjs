import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getOpeningStatus } from '../src/lib/hours.mjs';

const schedule = { 0: [['09:00','15:00']], 1: [['09:00','16:00']], 2: [], 3: [['09:00','12:00'],['14:00','16:00']], 4: [['09:00','16:00']], 5: [['09:00','16:00']], 6: [['09:00','16:00']] };
test('hora de Canarias en verano, independiente de la hora del sistema', () => {
  assert.equal(getOpeningStatus(new Date('2026-07-06T08:00:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-07-06T15:00:00Z'), schedule).open, false);
});
test('hora de Canarias en invierno y límites de apertura/cierre', () => {
  assert.equal(getOpeningStatus(new Date('2026-01-05T08:59:00Z'), schedule).text, 'Cerrado · abre a las 9:00');
  assert.equal(getOpeningStatus(new Date('2026-01-05T09:00:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-01-05T15:59:00Z'), schedule).open, true);
  assert.equal(getOpeningStatus(new Date('2026-01-05T16:00:00Z'), schedule).text, 'Cerrado · abre el miércoles a las 9:00');
});
test('turnos partidos, descanso semanal y salto al siguiente día', () => {
  assert.equal(getOpeningStatus(new Date('2026-01-07T12:30:00Z'), schedule).text, 'Cerrado · abre a las 14:00');
  assert.equal(getOpeningStatus(new Date('2026-01-06T10:00:00Z'), schedule).text, 'Cerrado · abre mañana a las 9:00');
  assert.equal(getOpeningStatus(new Date('2026-01-04T23:30:00Z'), schedule).text, 'Cerrado · abre mañana a las 9:00');
});
test('cambio de hora de verano a invierno en Canarias', () => {
  assert.equal(getOpeningStatus(new Date('2026-10-25T08:30:00Z'), schedule).open, false);
  assert.equal(getOpeningStatus(new Date('2026-10-25T09:00:00Z'), schedule).open, true);
});
test('sin horarios confirmados no se inventa una apertura', () => {
  assert.equal(getOpeningStatus(new Date(), {}).text, 'Horario por confirmar');
});

import negocio from '../src/data/negocio.json' with { type: 'json' };
import { groupSchedule, scheduleSummary, usualHours } from '../src/lib/hours.mjs';
test('el estado se traduce a los cuatro idiomas', () => {
  const closed = new Date('2026-01-06T10:00:00Z'); // martes
  assert.equal(getOpeningStatus(closed, schedule, 'Atlantic/Canary', 'en').text, 'Closed · opens tomorrow at 9:00');
  assert.equal(getOpeningStatus(closed, schedule, 'Atlantic/Canary', 'de').text, 'Geschlossen · öffnet morgen um 9:00 Uhr');
  assert.equal(getOpeningStatus(closed, schedule, 'Atlantic/Canary', 'nl').text, 'Gesloten · opent morgen om 9:00');
  assert.equal(getOpeningStatus(new Date('2026-01-05T16:00:00Z'), schedule, 'Atlantic/Canary', 'de').text, 'Geschlossen · öffnet am Mittwoch um 9:00 Uhr');
  assert.equal(getOpeningStatus(new Date('2026-01-05T09:00:00Z'), schedule, 'Atlantic/Canary', 'nl').text, 'Nu open');
});
test('horario real: 9:00–15:00 todos los días salvo el martes, que cierra', () => {
  const week = negocio.horario.semana;
  assert.deepEqual(groupSchedule(week).map(g => g.days), [[1], [2], [3, 4, 5, 6, 0]]);
  assert.equal(getOpeningStatus(new Date('2026-10-13T10:00:00Z'), week).open, false); // martes
  assert.equal(getOpeningStatus(new Date('2026-10-13T10:00:00Z'), week).text, 'Cerrado · abre mañana a las 9:00');
  assert.equal(getOpeningStatus(new Date('2026-10-14T13:59:00Z'), week).open, true); // miércoles 14:59 en Canarias
  assert.equal(getOpeningStatus(new Date('2026-10-14T14:00:00Z'), week).open, false); // 15:00
  assert.deepEqual(scheduleSummary(week, 'es').map(r => `${r.label} ${r.value}`), ['lun 9:00–15:00', 'mar Cerrado', 'mié–dom 9:00–15:00']);
});

test('usualHours: la frase del cierre sale del horario y se calla si es irregular', () => {
  const semana = { 0: [['09:00', '15:00']], 1: [['09:00', '15:00']], 2: [], 3: [['09:00', '15:00']], 4: [['09:00', '15:00']], 5: [['09:00', '15:00']], 6: [['09:00', '15:00']] };
  assert.deepEqual(usualHours(semana, 'es'), { from: '9:00', to: '15:00', closed: 'martes' });
  assert.deepEqual(usualHours(semana, 'en', [['09:00', '14:30']]), { from: '9:00', to: '14:30', closed: 'Tuesday' });
  assert.equal(usualHours({ ...semana, 6: [['10:00', '15:00']] }, 'es'), null);
  assert.equal(usualHours({ ...semana, 1: [] }, 'es'), null);
});
