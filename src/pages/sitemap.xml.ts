// Sitemap de las 16 páginas (4 idiomas), con sus alternativas hreflang y las fotos de los platos en la
// carta: en la página las fotos solo se cargan al abrir un plato, así que aquí quedan rastreables.
import type { APIRoute } from 'astro';
import carta from '../data/carta.json';
import { langs, locale, routes, type Page } from '../i18n/ui';
import { url } from '../lib/base';

interface Plato { foto: { src: string; widths: number[] } | null }
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => escape(new URL(url(path), site).href);
  const fotos = new Map<string, string>();
  const platos = carta.menus.flatMap(menu => menu.grupos.flatMap(grupo => grupo.platos as unknown as Plato[]));
  for (const plato of platos) {
    if (plato.foto && !fotos.has(plato.foto.src)) fotos.set(plato.foto.src, `${plato.foto.src}-${plato.foto.widths.at(-1)}.webp`);
  }
  const pages = Object.keys(routes.es) as Page[];
  const entries = pages.flatMap(page => langs.map(lang => [
    '  <url>',
    `    <loc>${abs(routes[lang][page])}</loc>`,
    ...langs.map(other => `    <xhtml:link rel="alternate" hreflang="${locale[other].html}" href="${abs(routes[other][page])}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(routes.es[page])}"/>`,
    ...(page === 'carta' ? [...fotos.values()].map(src => `    <image:image><image:loc>${abs(src)}</image:loc></image:image>`) : []),
    '  </url>',
  ].join('\n')));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
