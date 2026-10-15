// Horario: estado «Abierto/Cerrado» según el reloj de Canarias y textos del horario en los cuatro idiomas.
// Los días van de 0 (domingo) a 6 (sábado); una lista vacía significa cerrado.
const intl = { es: 'es-ES', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' };
const text = {
  es: { open: 'Abierto ahora', at: t => `Cerrado · abre a las ${t}`, tomorrow: t => `Cerrado · abre mañana a las ${t}`, day: (d, t) => `Cerrado · abre el ${d} a las ${t}`, unknown: 'Horario por confirmar', closed: 'Cerrado', kitchen: 'Cocina' },
  en: { open: 'Open now', at: t => `Closed · opens at ${t}`, tomorrow: t => `Closed · opens tomorrow at ${t}`, day: (d, t) => `Closed · opens ${d} at ${t}`, unknown: 'Hours to be confirmed', closed: 'Closed', kitchen: 'Kitchen' },
  de: { open: 'Jetzt geöffnet', at: t => `Geschlossen · öffnet um ${t} Uhr`, tomorrow: t => `Geschlossen · öffnet morgen um ${t} Uhr`, day: (d, t) => `Geschlossen · öffnet am ${d} um ${t} Uhr`, unknown: 'Öffnungszeiten folgen', closed: 'Geschlossen', kitchen: 'Küche' },
  nl: { open: 'Nu open', at: t => `Gesloten · opent om ${t}`, tomorrow: t => `Gesloten · opent morgen om ${t}`, day: (d, t) => `Gesloten · opent op ${d} om ${t}`, unknown: 'Openingstijden volgen', closed: 'Gesloten', kitchen: 'Keuken' },
};
// Lunes primero, como se lee un horario en Europa.
export const weekOrder = [1, 2, 3, 4, 5, 6, 0];
export const schemaDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Nombre del día en el idioma pedido ('long' o 'short'). El 4 de enero de 2026 fue domingo. */
export const dayName = (lang, day, width = 'long') =>
  new Intl.DateTimeFormat(intl[lang], { weekday: width, timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 4 + day)));
/** «09:00–15:00 · 17:00–20:00» → «9:00–15:00 · 17:00–20:00». */
export const formatRanges = ranges => ranges.map(([from, to]) => `${from.replace(/^0/, '')}–${to.replace(/^0/, '')}`).join(' · ');
export const closedLabel = lang => text[lang].closed;
export const kitchenLabel = lang => text[lang].kitchen;

/** Une los días consecutivos (lunes primero) con el mismo horario: [{ days: [3,4,5,6,0], ranges }]. */
export function groupSchedule(schedule) {
  const groups = [];
  for (const day of weekOrder) {
    const ranges = schedule[day] || [];
    const last = groups.at(-1);
    if (last && JSON.stringify(last.ranges) === JSON.stringify(ranges)) last.days.push(day);
    else groups.push({ days: [day], ranges });
  }
  return groups;
}

/** Líneas cortas para el pie: «Mié–Dom» · «9:00–15:00»; los días cerrados llevan «Cerrado». */
export function scheduleSummary(schedule, lang) {
  return groupSchedule(schedule).map(({ days, ranges }) => ({
    label: days.length === 1 ? dayName(lang, days[0], 'short') : `${dayName(lang, days[0], 'short')}–${dayName(lang, days.at(-1), 'short')}`,
    value: ranges.length ? formatRanges(ranges) : text[lang].closed,
  }));
}

/** Devuelve el estado según el reloj de Canarias, independientemente del navegador. */
export function getOpeningStatus(date, schedule, timeZone = 'Atlantic/Canary', lang = 'es') {
  const words = text[lang] ?? text.es;
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value }) => [type, value]));
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday);
  const minute = Number(parts.hour) * 60 + Number(parts.minute);
  const minutes = t => Number(t.split(':')[0]) * 60 + Number(t.split(':')[1]);
  const today = schedule[day] || [];
  for (const [start, end] of today) {
    if (minute >= minutes(start) && minute < minutes(end)) return { open: true, text: words.open };
    if (minute < minutes(start)) return { open: false, text: words.at(start) };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    if (schedule[next]?.length) return { open: false, text: offset === 1 ? words.tomorrow(schedule[next][0][0]) : words.day(dayName(text[lang] ? lang : 'es', next), schedule[next][0][0]) };
  }
  return { open: false, text: words.unknown };
}
