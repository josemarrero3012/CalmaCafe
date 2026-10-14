/** Devuelve el estado según el reloj de Canarias, independientemente del navegador. */
export function getOpeningStatus(date, schedule, timeZone = 'Atlantic/Canary') {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value }) => [type, value]));
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday);
  const minute = Number(parts.hour) * 60 + Number(parts.minute);
  const minutes = t => Number(t.split(':')[0]) * 60 + Number(t.split(':')[1]);
  const today = schedule[day] || [];
  for (const [start, end] of today) {
    if (minute >= minutes(start) && minute < minutes(end)) return { open: true, text: 'Abierto ahora' };
    if (minute < minutes(start)) return { open: false, text: `Cerrado · abre a las ${start}` };
  }
  const names = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    if (schedule[next]?.length) return { open: false, text: `Cerrado · abre ${offset === 1 ? 'mañana' : 'el ' + names[next]} a las ${schedule[next][0][0]}` };
  }
  return { open: false, text: 'Horario por confirmar' };
}
