// robots.txt con la referencia al sitemap. Los buscadores solo lo leen en la raíz del dominio:
// en GitHub Pages (con `base`) queda en /CalmaCafe/robots.txt y empieza a contar con el dominio propio.
// No bloquea nada aunque la web aún no se indexe: los buscadores tienen que poder leer el noindex de cada página.
import type { APIRoute } from 'astro';
import { url } from '../lib/base';

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('/sitemap.xml'), site).href}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
