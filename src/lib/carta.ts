import carta from '../data/carta.json';
import { destacados as elegir, type Carta } from './destacados.mjs';

type Menu = (typeof carta.menus)[number];
type Ref = { grupoId: string; grupoNombre: string };

// Platos de Inicio, elegidos una vez por compilación. En GitHub Actions los avisos salen como anotaciones del run.
export const destacados = elegir(carta as unknown as Carta);
for (const aviso of destacados.avisos) console.warn(`${process.env.GITHUB_ACTIONS ? '::warning title=Inicio::' : 'Inicio: '}${aviso}`);

// Platos que la carta oficial repite en otra sección del mismo menú (los Pancakes salen en Brunch y en
// «¡Algo dulce!», con extras a precios distintos). La web solo muestra el primero; los demás pasan a ser
// una referencia a esa sección, para que haya un único precio. Devuelve id del repetido → sección original.
export function repetidos(menu: Menu) {
  const vistos = new Map<string, Ref>();
  const refs = new Map<string, Ref>();
  for (const grupo of menu.grupos) {
    for (const plato of grupo.platos) {
      const nombre = plato.nombre.toLowerCase();
      const primero = vistos.get(nombre);
      if (!primero) vistos.set(nombre, { grupoId: grupo.id, grupoNombre: grupo.nombre });
      else if (primero.grupoId !== grupo.id) refs.set(plato.id, primero);
    }
  }
  return refs;
}

// Platos de un menú sin contar las referencias.
export const contar = (menu: Menu) => {
  const refs = repetidos(menu);
  return menu.grupos.reduce((n, grupo) => n + grupo.platos.filter(p => !refs.has(p.id)).length, 0);
};
