import { groupSchedule, schemaDays } from './hours.mjs';

/** Datos estructurados (schema.org) de Calma Café a partir de negocio.json. Solo emite lo confirmado. */
export function buildSchema(negocio, { pageUrl, menuUrl } = {}) {
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
    sameAs: [negocio.instagram.url, ...(mapas.confirmado ? [mapas.ficha] : [])],
  };
  if (pageUrl) schema.url = pageUrl;
  if (menuUrl) schema.hasMenu = menuUrl;
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
