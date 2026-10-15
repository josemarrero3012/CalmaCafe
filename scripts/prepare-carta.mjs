// Importa la carta oficial de Calma (calma.buenacarta.com) a src/data/carta.json
// (alérgenos oficiales + los de src/data/alergenos-anadidos.json, que se anotan aparte)
// y descarga y optimiza las fotos de los platos en public/media/carta/.
// Uso: npm run carta   (volver a ejecutarlo cuando el local cambie su carta)
import sharp from 'sharp';
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';

const SOURCE = 'https://calma.buenacarta.com/';
// Alérgenos seguros que la carta oficial no marca (ingrediente en el nombre o la descripción). Ver docs/ALERGENOS.md.
const anadidos = JSON.parse(await readFile('src/data/alergenos-anadidos.json', 'utf8')).platos;
// Orden de la lista de alérgenos de la UE, que es el que sigue la carta oficial.
const ordenAlergenos = ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos de cáscara', 'Apio', 'Mostaza', 'Semillas de sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'];
const originals = 'assets/originals/carta';
const output = 'public/media/carta';
const WIDTHS = [160, 480, 800];
await mkdir(originals, { recursive: true });
await mkdir(output, { recursive: true });

const page = await (await fetch(SOURCE, { headers: { 'user-agent': 'Mozilla/5.0 (Calma Café web)' } })).text();
const body = page.slice(page.indexOf('<body')).replace(/<svg[\s\S]*?<\/svg>/g, '');

const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const text = html => decode(html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')).split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
const first = (re, s) => s.match(re)?.[1];

// --- Correcciones de forma: ortografía, acentos y espacios. El contenido no cambia. ---
// Palabra completa también junto a letras acentuadas (\b de JavaScript solo entiende ASCII).
const word = (w, flags = 'g') => new RegExp(`(?<![\\p{L}\\p{N}])${w}(?![\\p{L}\\p{N}])`, `${flags}u`);
const fixes = [
  [/Triassant\s*\(\s*/g, 'Triassant ('], [word('Yoghurt Griego'), 'Yogur griego'], [word('Salmon'), 'Salmón'],
  [word('Sand?wich'), 'Sándwich'], [/aguacatey/g, 'aguacate y'], [word('aliolo'), 'alioli'], [word('Humus'), 'Hummus'],
  [word('humus'), 'hummus'], [word('platano'), 'plátano'], [word('Pumkin'), 'Pumpkin'], [word('jamon'), 'jamón'], [word('([Cc])afe'), '$1afé'],
  [word('pidelo'), 'pídelo'], [/Añadele,?\s*/g, 'Añádele '], [word('Te'), 'Té'], [word('pure'), 'puré'],
  [/hielo picada/g, 'hielo picado'], [word('maracuya'), 'maracuyá'], [word('fria'), 'fría'], [/Mozarella/g, 'Mozzarella'],
  [word('[Nn]utella'), 'Nutella'], [/Dulce de Leche/g, 'dulce de leche'],
  [/,\s*\.\.\.\s*/g, '. '], [/\s*\.\.\.\s*etc\b\.?/g, '…'], [/\.\.\./g, '…'], [/\s+([,.!…])/g, '$1'], [/\s{2,}/g, ' '],
];
const fix = s => fixes.reduce((acc, [re, to]) => acc.replace(re, to), s).trim();
const sentence = s => (s === s.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3}/.test(s) ? s.charAt(0) + s.slice(1).toLowerCase() : s);
const capital = s => s.charAt(0).toUpperCase() + s.slice(1);
const extraName = s => (/^xl$/i.test(s) ? 'Tamaño XL' : capital(fix(s).toLowerCase()).replace(word('nutella'), 'Nutella'));
const money = raw => {
  const n = Number(String(raw).replace(',', '.'));
  return `${n.toFixed(2).replace('.', ',')} €`;
};
// Nombres de grupo y de menú con la grafía de la web.
const groupNames = { 'BRUNCH': 'Brunch', 'BRUNCH TARDÍO & MÁS': 'Brunch tardío & más', 'EXTRAS': 'Extras', '¡ALGO DULCE!': '¡Algo dulce!', 'Para los niños': 'Para los niños', 'Bebida fria': 'Bebidas frías', 'Bebida caliente': 'Bebidas calientes' };
const menuNames = { CARTA: 'Carta', VEGETARIANO: 'Vegetariano', VEGANO: 'Vegano', BEBIDAS: 'Bebidas' };
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Ajustes puntuales donde la corrección automática no basta (unidades, listas).
const overrides = {
  'Agua': { descripcion: '33 cl' },
  'Refresco': { descripcion: 'Coca-Cola, Coca-Cola Zero o Fanta, en botella de 33 cl' },
  'Cerveza': { descripcion: 'Tropical, 33 cl' },
  'Cava piccolo': { descripcion: 'Botellín de 20 cl' },
  'Margarita congelada': { descripcion: 'Fruta, tequila y Cointreau' },
  'Té': { descripcion: 'Menta, té negro, té verde o manzanilla' },
  'Cafe con leche, Cortado largo': { nombre: 'Café con leche o cortado largo' },
  'Queso, jamón': { nombre: 'Queso o jamón' },
  'Pollo , bacon o Serrano': { nombre: 'Pollo, bacon o serrano' },
  'Vegetariano Mozarella, Pesto': { nombre: 'Mozzarella y pesto' },
  'Triassant Tomate, aceite y semillas': { nombre: 'Triassant con tomate, aceite y semillas' },
  'Pan con...': { nombre: 'Pan con…', notas: ['Pan integral o de molde'] },
  'Calma Especial': { descripcion: 'Triassant (mezcla de croissant y pan de cereales) con huevos revueltos, aguacate, bacon y verduras' },
  'Fajita Vegana': { descripcion: 'Hummus, guacamole y champiñones' },
  'Rollito de Canela Vegano': { notas: ['Avisa al llegar: tarda entre 10 y 15 minutos en prepararse'] },
  'Calma Vegetariano': { descripcion: 'Triassant (mezcla de croissant y pan de cereales) con lechuga, rabanitos, huevos revueltos y aguacate' },
  'Ensalada vegetariana de Quinoa, verduras & aguacate': { descripcion: 'Mezcla de ensalada, tomate, rábano, cebolla y quinoa, con pan' },
};

// Separa la descripción en texto, extras con precio, opciones y notas.
function details(shortDesc, longDesc) {
  const extras = [], opciones = [], notas = [];
  let descripcion = shortDesc ?? '';
  const inline = descripcion.match(/^(.*?)\s*Extra por (.+?)\s+([\d]+(?:[.,]\d+)?)\s*€?$/i);
  if (inline) { descripcion = inline[1]; extras.push({ nombre: extraName(inline[2]), precio: money(inline[3]) }); }
  const add = descripcion.match(/^Añade (.+?) por ([\d.,]+)\s*€$/i);
  if (add) { descripcion = ''; extras.push({ nombre: extraName(add[1]), precio: money(add[2]) }); }
  let extraBlock = false;
  for (const line of (longDesc ?? '').split('\n').map(l => l.trim()).filter(Boolean)) {
    let m;
    if (/^Extra:?$/i.test(line)) { extraBlock = true; continue; }
    if ((m = line.match(/^(?:Extra(?:\s+por)?|Añade)\s+(.+?)\s+([\d]+(?:[.,]\d+)?)\s*€?$/i)) || (m = line.match(/^(.+?)\s+extra\s+([\d.,]+)\s*€$/i)) || (extraBlock && (m = line.match(/^(.+?)\s+([\d.,]+)\s*€$/)))) {
      extras.push({ nombre: extraName(m[1]), precio: money(m[2]) });
    } else if ((m = line.match(/^\d+\.\s*(.+)$/))) {
      const parts = m[1].split(/\s*\/\s*/).map(p => fix(p).toLowerCase());
      opciones.push(capital(parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}` : parts[0]));
    } else notas.push(capital(fix(line).replace(/!$/, '')));
  }
  descripcion = capital(fix(descripcion)).replace(/\.$/, '');
  return { descripcion: descripcion || null, extras, opciones, notas };
}

const fichas = new Map();
for (const [, id, menu, html] of body.matchAll(/<template id="ficha-(\d+)" data-menu="(\d+)">([\s\S]*?)<\/template>/g)) {
  fichas.set(`${menu}/${id}`, {
    nombre: first(/class="c-ficha-nombre">([\s\S]*?)<\/h2>/, html),
    desc: first(/class="c-ficha-desc">([\s\S]*?)<\/p>/, html),
    foto: first(/class="c-ficha-foto" src="([^"]+)"/, html),
  });
}

const used = new Set();
const menus = [];
for (const [, menuId, html] of body.matchAll(/<section class="m-carta" data-vista id="menu-(\d+)" hidden>([\s\S]*?)(?=<section class="m-carta"|<dialog|<\/main>)/g)) {
  const rawName = text(first(/<h1>([\s\S]*?)<\/h1>/, html));
  const menu = { id: slug(rawName), nombre: menuNames[rawName] ?? sentence(rawName), nota: [...html.matchAll(/class="c-nota">([\s\S]*?)<\/p>/g)].map(m => capital(text(m[1]).toLowerCase()).replace(/^¡(.)/, (_, c) => `¡${c.toUpperCase()}`)), grupos: [] };
  for (const [, groupHtml] of html.matchAll(/<section class="m-grupo" id="grupo-\d+" data-grupo>([\s\S]*?)<\/section>/g)) {
    const rawGroup = text(first(/<h2>([\s\S]*?)<\/h2>/, groupHtml)).replace(/\s*\(.*\)\s*$/, '');
    const grupo = { id: `${menu.id}-${slug(groupNames[rawGroup] ?? rawGroup)}`, nombre: groupNames[rawGroup] ?? sentence(rawGroup), platos: [] };
    for (const [, li] of groupHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
      const id = first(/href="#plato-(\d+)"/, li);
      const ficha = fichas.get(`${menuId}/${id}`) ?? {};
      // El nombre de la ficha no lleva etiquetas («Vegano», «Agotado») pegadas.
      const rawName = text((ficha.nombre ?? first(/class="m-plato-nombre">([^<]*)/, li)).replace(/<span[\s\S]*?<\/span>/g, ''));
      const { descripcion, extras, opciones, notas } = details(
        li.includes('m-plato-extra') ? text(first(/class="m-plato-extra">([\s\S]*?)<\/span>/, li)) : null,
        ficha.desc ? text(ficha.desc) : null,
      );
      const plato = {
        id,
        nombre: sentence(fix(rawName)),
        descripcion, extras, opciones, notas,
        precio: money(text(first(/class="m-plato-precio c-precio">([\s\S]*?)<\/span>\s*<span role/, li) ?? '0').replace(/[^\d,]/g, '')),
        alergenos: [...li.matchAll(/alt="([^"]+)" title=/g)].map(m => m[1]),
        dieta: first(/c-dieta--(\w+)/, li) ?? null,
        foto: null,
      };
      Object.assign(plato, overrides[rawName] ?? {});
      const extra = (anadidos[id]?.anadir ?? []).filter(a => !plato.alergenos.includes(a));
      if (extra.length) {
        plato.alergenos = [...plato.alergenos, ...extra].sort((a, b) => ordenAlergenos.indexOf(a) - ordenAlergenos.indexOf(b));
        plato.alergenosAnadidos = extra;
      }
      if (ficha.foto) plato.foto = await photo(id, ficha.foto);
      grupo.platos.push(plato);
    }
    // Foto de portada del grupo: el primer plato con foto que no haya salido ya en otro grupo.
    grupo.portada = grupo.platos.find(p => p.foto && !used.has(p.foto.src))?.id ?? grupo.platos.find(p => p.foto)?.id ?? null;
    const portada = grupo.platos.find(p => p.id === grupo.portada);
    if (portada) used.add(portada.foto.src);
    menu.grupos.push(grupo);
  }
  menus.push(menu);
}

async function photo(id, url) {
  const file = `${originals}/${id}.webp`;
  try { await access(file); } catch {
    const res = await fetch(url.replace(/\?.*$/, ''));
    if (!res.ok) throw new Error(`Foto ${id}: HTTP ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  const source = await readFile(file);
  const { width, height } = await sharp(source).metadata();
  // Las fotos más pequeñas que el tamaño mayor se sirven también a su ancho original.
  const widths = [...WIDTHS.filter(w => w < width), Math.min(width, WIDTHS.at(-1))];
  for (const w of widths) {
    const target = `${output}/${id}-${w}`;
    try { await access(`${target}.avif`); } catch {
      await sharp(source).resize(w).avif({ quality: 50, effort: 5 }).toFile(`${target}.avif`);
      await sharp(source).resize(w).webp({ quality: 78 }).toFile(`${target}.webp`);
    }
  }
  return { src: `/media/carta/${id}`, width, height, widths };
}

const local = {
  direccion: text(first(/<div class="m-identidad">[\s\S]*?<p>([\s\S]*?)<\/p>/, body) ?? ''),
  telefono: first(/href="tel:(\d+)"/, body),
  whatsapp: decode(first(/href="(https:\/\/wa\.me\/\d+)"/, body) ?? ''),
};
const carta = { fuente: SOURCE, consultada: new Date().toISOString().slice(0, 10), local, menus };
await writeFile('src/data/carta.json', JSON.stringify(carta, null, 2) + '\n');
const count = menus.reduce((n, m) => n + m.grupos.reduce((k, g) => k + g.platos.length, 0), 0);
for (const id of Object.keys(anadidos)) if (!menus.some(m => m.grupos.some(g => g.platos.some(p => p.id === id)))) console.warn(`Aviso: alergenos-anadidos.json tiene el plato ${id}, que ya no está en la carta`);
console.log(`Carta importada: ${menus.length} menús, ${count} platos, ${menus.flatMap(m => m.grupos.flatMap(g => g.platos)).filter(p => p.foto).length} con foto.`);
console.log(local);
