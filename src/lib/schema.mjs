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
