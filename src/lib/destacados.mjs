// Platos que destaca Inicio. La carta oficial cambia cada pocos días (en octubre de 2026 quitó el Calma Ice Latte
// y los Pancakes), y un plato que desaparece no puede dejar la web sin publicar. Por eso cada hueco tiene sus
// preferidos por orden y, si no queda ninguno con foto, usa el primero con foto de su sección. Todo sale de
// carta.json, con el precio oficial: nunca se destaca un plato que ya no está en la carta.

/** @typedef {{ src: string, width: number, height: number, widths: number[] }} Foto */
/** @typedef {{ id: string, nombre: string, precio: string, descripcion: string | null, foto: Foto | null }} Plato */
/** @typedef {{ menus: { grupos: { id: string, platos: Plato[] }[] }[] }} Carta */

// Huecos con foto: ids preferidos, por orden, y sección de respaldo.
export const huecos = {
  dulce: { ids: ['422600', '721406', '721403', '721405'], grupo: 'carta-algo-dulce' }, // Polaroid del hero: Pancakes, Rollito de canela, Cookies
  salado: { ids: ['89630', '89632', '93764'], grupo: 'carta-brunch' }, // Polaroid del hero y puerta de la carta: Calma Especial
  cafe: { ids: ['93803', '551544', '93800'], grupo: 'bebidas-bebidas-calientes' }, // Tarjeta «Team café»: Latte congelado
  matcha: { ids: ['492936', '492937', '701627'], grupo: 'bebidas-bebidas-frias' }, // Tarjeta «Team matcha»: Matcha Latte
};
// Listas del selector café/matcha: las tres primeras bebidas que sigan en la carta (aquí no hace falta foto).
export const listas = {
  coffee: ['723815', '93803', '93800', '551544', '93799'],
  matcha: ['492937', '492936', '701627', '701629'],
};
const LARGO = 3;

/**
 * Elige los platos de Inicio y anota en `avisos` cada preferido que falta, para verlo en el log de la compilación.
 * @param {Carta} carta
 * @returns {{ fotos: Record<keyof typeof huecos, Plato & { foto: Foto }>, bebidas: Record<keyof typeof listas, Plato[]>, avisos: string[] }}
 */
export function destacados(carta) {
  const grupos = carta.menus.flatMap(menu => menu.grupos);
  const platos = grupos.flatMap(grupo => grupo.platos);
  const porId = new Map(platos.map(p => [p.id, p]));
  const conFoto = p => Boolean(p?.foto);
  const avisos = [];

  const fotos = {};
  for (const [hueco, { ids, grupo }] of Object.entries(huecos)) {
    const plato = ids.map(id => porId.get(id)).find(conFoto)
      ?? grupos.find(g => g.id === grupo)?.platos.find(conFoto)
      ?? platos.find(conFoto);
    if (!plato) throw new Error('carta.json no tiene ningún plato con foto: revisa la importación (npm run carta).');
    if (plato.id !== ids[0]) avisos.push(`el plato ${ids[0]} ya no está en la carta o no tiene foto; en «${hueco}» sale ${plato.id} (${plato.nombre}).`);
    fotos[hueco] = plato;
  }

  const bebidas = {};
  for (const [team, ids] of Object.entries(listas)) {
    const faltan = ids.slice(0, LARGO).filter(id => !porId.has(id));
    if (faltan.length) avisos.push(`faltan en la carta ${faltan.join(', ')}; la lista «${team}» se completa con las siguientes.`);
    bebidas[team] = ids.flatMap(id => porId.get(id) ?? []).slice(0, LARGO);
  }
  return { fotos, bebidas, avisos };
}
