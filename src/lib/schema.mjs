import { groupSchedule, schemaDays } from './hours.mjs';

/** Datos estructurados (schema.org) de Calma Café a partir de negocio.json. Solo emite lo confirmado. */
export function buildSchema(negocio, { pageUrl, menuUrl, imageUrl } = {}) {
  const { direccion, geo, mapas, horario } = negocio;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: negocio.nombre,
    slogan: negocio.lema,
    servesCuisine: ['Brunch', 'Coffee'],
    telephone: negocio.telefono.enlace.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${direccion.calle}, ${direccion.edificio}`,
      postalCode: direccion.codigoPostal,
      addressLocality: negocio.localidad,
      addressRegion: negocio.isla,
      addressCountry: 'ES',
    },
    // Mismo NAP en todas partes: Maspalomas, dentro del municipio de San Bartolomé de Tirajana.
    areaServed: [negocio.localidad, negocio.municipio],
    ...(negocio.precio ? { priceRange: negocio.precio.rango } : {}),
    sameAs: [negocio.instagram.url, ...(mapas.confirmado ? [mapas.ficha] : [])],
  };
  if (pageUrl) schema.url = pageUrl;
  if (menuUrl) schema.hasMenu = menuUrl;
  if (imageUrl) schema.image = imageUrl;
  if (geo) schema.geo = { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng };
  if (mapas.confirmado) schema.hasMap = mapas.ficha;
  if (horario.confirmado) {
    schema.openingHoursSpecification = groupSchedule(horario.semana)
      .filter(({ ranges }) => ranges.length)
      .flatMap(({ days, ranges }) => ranges.map(([opens, closes]) => ({
        '@type': 'OpeningHoursSpecification', dayOfWeek: days.map(day => schemaDays[day]), opens, closes,
      })));
  }
  return schema;
}

/** Preguntas frecuentes de Visítanos como FAQPage, con las mismas respuestas que se ven en la página. */
export function buildFaqSchema(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
}

const diets = { vegetariano: 'https://schema.org/VegetarianDiet', vegano: 'https://schema.org/VeganDiet' };

/**
 * La carta como Menu: una sección por menú (Carta, Vegetariano…) y dentro sus grupos con los platos.
 * `tr` traduce nombres y descripciones; `skip` dice qué platos son repeticiones de otra sección (lib/carta).
 */
/** @param {{ name: string, url?: string, lang: string, tr?: (es: string) => string, skip?: (menu: any) => Set<string> }} options */
export function buildMenuSchema(carta, { name, url, lang, tr = es => es, skip }) {
  const item = plato => ({
    '@type': 'MenuItem',
    name: tr(plato.nombre),
    ...(plato.descripcion ? { description: tr(plato.descripcion) } : {}),
    offers: { '@type': 'Offer', price: plato.precio.replace(/[^\d,]/g, '').replace(',', '.'), priceCurrency: 'EUR' },
    ...(diets[plato.dieta] ? { suitableForDiet: diets[plato.dieta] } : {}),
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name,
    inLanguage: lang,
    ...(url ? { url } : {}),
    hasMenuSection: carta.menus.map(menu => {
      const repes = skip ? skip(menu) : new Set();
      return {
        '@type': 'MenuSection',
        name: tr(menu.nombre),
        hasMenuSection: menu.grupos.map(grupo => ({
          '@type': 'MenuSection',
          name: tr(grupo.nombre),
          hasMenuItem: grupo.platos.filter(plato => !repes.has(plato.id)).map(item),
        })),
      };
    }),
  };
}
