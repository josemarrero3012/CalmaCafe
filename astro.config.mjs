import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // Español en la raíz; inglés, alemán y neerlandés en /en/, /de/ y /nl/ (rutas en src/i18n/ui.ts).
  i18n: { defaultLocale: 'es', locales: ['es', 'en', 'de', 'nl'], routing: { prefixDefaultLocale: false } },
});
