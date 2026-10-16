// robots.txt con la referencia al sitemap. Los buscadores solo lo leen en la raíz del dominio:
// en GitHub Pages (con `base`) queda en /CalmaCafe/robots.txt y empieza a contar con el dominio propio.
import type { APIRoute } from 'astro';
import { url } from '../lib/base';

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('/sitemap.xml'), site).href}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
