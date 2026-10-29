# Desarrollo

## Requisitos y arranque

Node.js 22.12 o superior y npm. `.nvmrc` fija la rama 22, compartida con GitHub Actions.

```bash
npm ci
npm run dev
```

URL local: http://localhost:4321/CalmaCafe/. No hacen falta variables de entorno, originales multimedia ni servicios privados para compilar. `assets/originals/` y `assets/frames/` son directorios de trabajo excluidos de Git.

## Comandos

```bash
npm test
npm run check
npm run build
npm run preview -- --port 4322
```

La compilación ejecuta `astro check` y genera `dist/`. Se mantiene `base: '/CalmaCafe'` y `site: 'https://josemarrero3012.github.io'` en `astro.config.mjs`.

## Datos e idiomas

- `src/data/negocio.json`: dirección, contacto, horarios, enlaces y control de indexación.
- `src/data/carta.json`: instantánea de la carta digital; consultar `fuente` y `consultada` para su procedencia y fecha.
- `src/data/alergenos-anadidos.json`: anotaciones complementarias; consultar [ALERGENOS.md](ALERGENOS.md).
- `src/data/media.json` y `fotos.json`: tamaños y textos alternativos de las fotografías.
- `src/i18n/ui.ts`: textos de interfaz y rutas de las cuatro versiones.
- `src/i18n/carta.json`: traducciones de la carta; las pruebas detectan textos nuevos sin traducir.

Español en la raíz del sitio; inglés, alemán y neerlandés en `/en/`, `/de/` y `/nl/`. Las rutas traducidas se generan desde `src/pages/[lang]/[...slug].astro`.

## Carta y recursos

`npm run carta` consulta la carta digital del local, actualiza el JSON y prepara sus fotografías. Requiere red y modifica archivos versionados. El importador protege contra respuestas HTTP fallidas y caídas importantes en el número de platos. Revisar siempre el diff y las traducciones antes de publicar.

`.github/workflows/carta.yml` ejecuta la importación a las 05:00 UTC; si hay cambios los registra y solicita el despliegue. Los cambios de fecha por sí solos no generan commits. Si fallan las pruebas de datos o traducciones, la importación no se registra ni se publica: hay que revisar los cambios y actualizar las anotaciones y traducciones.

`npm run assets` regenera imágenes, vídeo, logotipos y fuentes. Requiere los originales no versionados y FFmpeg/FFprobe. `npm run caligrafia` regenera la máscara de escritura desde la fuente incluida. `node scripts/prepare-og.mjs` prepara la imagen social. No son pasos necesarios para arrancar ni compilar.

## QA de navegador

```bash
npx playwright install chromium
npm run preview -- --port 4322
# En otra terminal:
QA_URL=http://localhost:4322/CalmaCafe npm run qa
```

El QA recorre los cuatro idiomas, comprueba accesibilidad automática, imágenes, navegación, carta, movimiento reducido y contenido sin JavaScript. Escribe capturas e informe en `reports/qa/`. `QA_OUTPUT_DIR` permite elegir otra carpeta. Estas comprobaciones complementan la revisión visual y humana.

## Integración y publicación

Las pull requests ejecutan pruebas y compilación en `ci.yml`. Los cambios en `main` ejecutan las mismas comprobaciones antes de subir el artefacto de Pages. El despliegue publica únicamente `dist/`, no los documentos ni los originales del proyecto.

La propuesta `/propuesta/` está fuera del menú y del sitemap, pero sigue siendo accesible mediante URL. Mientras `buscadores.indexar` sea `false`, las páginas llevan `noindex, nofollow`; esto no proporciona privacidad.
