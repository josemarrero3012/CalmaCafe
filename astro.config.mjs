import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages sirve el sitio en https://josemarrero3012.github.io/CalmaCafe/
// Con dominio propio: quitar `base` y poner el dominio en `site`.
export default defineConfig({
  site: 'https://josemarrero3012.github.io',
  base: '/CalmaCafe',
  output: 'static',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // React solo para el carrusel de polaroids de la página Calma (components/ui), que se carga al llegar a él.
  integrations: [react()],
  // Español en la raíz; inglés, alemán y neerlandés en /en/, /de/ y /nl/ (rutas en src/i18n/ui.ts).
  i18n: { defaultLocale: 'es', locales: ['es', 'en', 'de', 'nl'], routing: { prefixDefaultLocale: false } },
});
