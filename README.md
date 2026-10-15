# Calma Café · Fase 1

https://josemarrero3012.github.io/CalmaCafe/
Web en español, inglés, alemán y neerlandés con cuatro páginas independientes —Inicio, Carta, Calma y Visítanos—, realizada con Astro estático, CSS propio y JavaScript vanilla. Fotografías del local; ningún recurso de stock. El fondo del hero es una imagen aportada aparte cuyo origen está por confirmar (ver `docs/PENDIENTES.md`).

## Arrancar

Node **22.12 o superior** (validado con Node 24).

```bash
npm ci
npm run dev
```

Abre **http://localhost:4321**. `npm run build` comprueba tipos y genera `dist/`; `npm run preview` sirve esa compilación. En un entorno restringido se puede anteponer `ASTRO_TELEMETRY_DISABLED=1` para que Astro no escriba su configuración de telemetría fuera del proyecto.

## Entrega

- Cuatro páginas (`/`, `/carta/`, `/calma/`, `/visitanos/`) con cabecera, menú y pie comunes en `Layout.astro`. Al cambiar de sección no hay desplazamiento vertical: la página saliente se desvanece (View Transitions entre documentos, con la cabecera fija) y la nueva entra escalonada. Los navegadores sin View Transitions muestran solo la entrada; con movimiento reducido no hay animación.
- Inicio y Visítanos tienen una firma caligráfica que se escribe trazo a trazo («Feed your soul», el lema del logo, y «See you soon»); si al cargar queda fuera de pantalla, espera a verse. Carta y Calma ya no la llevan, para que el recurso no se repita en todas las páginas. La tipografía es **Waterfall** (Google Fonts, OFL, en `src/fonts/`). Lo que se ve es la tipografía real; `npm run caligrafia` calcula su línea central (esqueleto), la ordena como trazos de pluma y la guarda en `src/data/caligrafia.json`. Esos trazos son una máscara SVG animada solo con CSS que va destapando las letras: no requiere JavaScript ni descargar la fuente.
- Carta completa en pestañas por menú. La barra fija reúne los menús y las secciones del menú activo, así que se puede cambiar de menú a mitad de la carta. Foto en arco por sección que cambia al pasar por cada plato y foto ampliada con extras y alérgenos. Sin JavaScript se muestran los cuatro menús seguidos.
- **Hero de Inicio a sangre** con la foto del local de fondo (`hero-fondo`, AVIF/WebP de 640 a 1706 px, carga prioritaria), un degradado cálido para leer el texto y la cabecera translúcida encima. Titular en blanco, «Feed your soul» en dorado con trazo de pincel, botón verde, polaroid de los Pancakes y sello.
- **Historia en Calma** («Nuestra historia»): el sueño de Guro y la apertura el 6 de septiembre de 2019, y cómo «Alma Café» acabó llamándose «Calma», en los cuatro idiomas. Aún sin fotos: hacen de imagen un sello con la fecha y una tarjeta en la que «Alma» se convierte en «Calma» al entrar en pantalla (`site.ts` mide el ancho real de cada letra y el CSS abre y cierra las ranuras), con un botón para repetirla. Sin JavaScript o con movimiento reducido se ve «Calma» directamente.
- **Sello del hero** con la taza-loto animada (`TazaLoto.astro`): adaptación del componente `taza-loto.js` a SVG en línea y CSS, con la taza vectorial del logo, vapor que sube y una respiración suave. Con movimiento reducido queda quieta y con el vapor visible.
- Menú móvil con dirección y contacto; barra de acciones móvil («Cómo llegar» y «Llamar», que se aparta al bajar); selector café/matcha en Inicio con bebidas y precios reales de la carta; «Ver el local» abre el vídeo en una ventana y solo entonces lo descarga; mapa que se conecta a Google solo tras pulsar.
- Logo **extraído de la imagen original y vectorizado con Potrace**, en versiones clara y oscura: wordmark con subtítulo, marca completa y taza-loto independiente. SVG y PNG transparentes en `public/media/`; favicon derivado del icono original.
- Ocho fotos optimizadas a AVIF y WebP en cinco anchuras (320–1170 px); diez fotogramas completos del vídeo en tres anchuras, sin aislar obras de terceros. `Photo.astro` genera `picture`, `srcset`, tamaños, dimensiones y carga diferida.
- Bucle continuo de **10 segundos**, H.264 MP4 (604.328 bytes) y VP9 WebM (946.713 bytes), **sin pista de audio**, 432 × 768 px; con controles; no arranca solo. Las animaciones respetan `prefers-reduced-motion`.
- Fraunces, DM Sans y Caveat autoalojadas con sus licencias. Tokens de marca, patrón SVG original de azulejos y componentes reutilizables.
- Capturas de Inicio: [móvil, 390 px](docs/capturas/home-390.png) · [escritorio, 1440 px](docs/capturas/home-1440.png). Resto de páginas en `docs/capturas/{carta,calma,visitanos}-{390,1440}.png`.
- [Primer pantallazo móvil](docs/capturas/hero-390.png) · [Primer pantallazo escritorio](docs/capturas/hero-1440.png).
- [Datos pendientes del cliente](docs/PENDIENTES.md) · [Validación](docs/VALIDACION.md).

## Datos y alcance

`src/data/negocio.json` centraliza el negocio, contacto, mapa, reseñas y horario; `src/data/carta.json` es la **carta oficial** importada de [calma.buenacarta.com](https://calma.buenacarta.com/) con `npm run carta`: cuatro menús (Carta, Vegetariano, Vegano y Bebidas), 124 platos con precio, descripción, extras, alérgenos y etiquetas de dieta, y las 86 fotos de platos optimizadas en `public/media/carta/` (los originales se guardan en `assets/originals/carta/`, fuera de git). El script corrige solo la forma (acentos, espacios, unidades) y nunca precios ni ingredientes; hay que volver a ejecutarlo cuando el local cambie su carta. **Un plato sin alérgenos listados no significa que no los tenga:** la página lo advierte.

Dirección, teléfono y WhatsApp vienen de la carta digital oficial del local; el código postal (35100), las coordenadas, el horario y el enlace de la ficha vienen de su **ficha de Google** (15 de octubre de 2026). «Cómo llegar» y los enlaces de horario abren esa ficha, y «Llamar» abre `tel:+34681667917`. El horario (lunes y de miércoles a domingo de 9:00 a 15:00, martes cerrado; cocina de 9:00 a 14:30) vive en `horario.semana` y `horario.cocina` de `negocio.json` y alimenta Visítanos (tabla por días, con el día de hoy resaltado), el pie, el indicador «Abierto/Cerrado» de la cabecera (`Intl.DateTimeFormat` en **Atlantic/Canary**, con textos en los cuatro idiomas en `src/lib/hours.mjs`) y el JSON-LD. El JSON-LD (`src/lib/schema.mjs`, tipo `CafeOrCoffeeShop`) incluye dirección con código postal, `geo`, `openingHoursSpecification`, `hasMenu`, `hasMap`, y la ficha en `sameAs`. Tampoco se muestran la nota ni las reseñas de Google hasta verificarlas. Inicio, la carta y la sección de bebidas solo destacan platos que están en la carta oficial. La nota «¡Toda la carta se puede hacer sin gluten!» aparece únicamente en los menús Vegetariano y Vegano, como en la carta original.

## Idiomas

La web está en español (`/`), inglés (`/en/`), alemán (`/de/`) y neerlandés (`/nl/`), con rutas traducidas (`/en/menu/`, `/de/speisekarte/`, `/nl/menukaart/`…). Las cuatro versiones comparten las vistas de `src/views/`; las páginas en español están en `src/pages/` y las traducidas salen de `src/pages/[lang]/[...slug].astro`.

- **Interfaz:** `src/i18n/ui.ts` reúne los textos, las rutas, el formato de precios (`€8.00`, `8,00 €`, `€ 4,00`) y el teléfono con prefijo +34 fuera de la versión española. En alemán se tutea, como el «tú» del español.
- **Carta:** `src/i18n/carta.json` traduce cada texto de `carta.json` (platos, descripciones, extras, alérgenos y secciones). La carta digital del local tiene versiones EN/DE/NL, pero con restos en español, erratas e ingredientes y extras que no coinciden con la española; por eso se tradujo a partir de la española, que manda en precios, extras y alérgenos. Tras `npm run carta`, `npm test` avisa de cualquier texto nuevo sin traducir.
- **Selector:** bandera (SVG propio, porque las banderas emoji no se ven en Windows) y código del idioma en la cabecera, y lista completa en el menú móvil. Enlaza siempre a la misma página en el otro idioma. Cada página declara sus alternativas con `hreflang` (relativas hasta que haya dominio).
- Las fotos tienen texto alternativo en los cuatro idiomas (`src/data/fotos.json`). Las firmas caligráficas («Feed your soul», «See you soon») y las frases de la pizarra se dejan en inglés en todos los idiomas.

Páginas legales, SEO completo, dominio, sitemap y robots corresponden a Fase 3. Los enlaces legales abren avisos accesibles en lugar de enlaces rotos. Hay título, descripción, HTML semántico y JSON-LD básico solo con los datos conocidos. El despliegue pertenece a Fase 4.

## Recursos y comprobaciones

Los originales se localizaron en `/home/josem/Escritorio` y se **copiaron sin modificar** a `assets/originals/`. Los derivados listos para servir están incluidos en `public/`. Para regenerarlos se necesitan los originales, FFmpeg/FFprobe en PATH y `npm run assets`; no es necesario regenerar para arrancar o compilar.

```bash
npm test                         # Horario, datos estructurados, caligrafía y traducciones completas de la carta
npx playwright install chromium # Solo para QA
npm run qa                      # Servidor local activo; capturas + axe + interacción + sin marcadores visibles
```

`QA_URL=http://localhost:4322 npm run qa` permite comprobar una compilación servida en otro puerto. Los informes Lighthouse conservados en `docs/capturas/` documentan las medidas locales; los resultados reales dependerán también del alojamiento y de la red.

Referencias consultadas únicamente como concepto: [Haven Annecy](https://haven-annecy.fr/en) (utilidad) y [Tengile MalaMala](https://tengilemalamala.com/) (ritmo). No se reutilizó código, texto ni imágenes de esas webs.
