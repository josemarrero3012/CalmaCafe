# Auditoría de Aterna · estado punto por punto

Seguimiento de «Aterna - Auditoria Calma Cafe.pdf» (octubre de 2026). La auditoría se hizo sobre la demo en Netlify; la web ahora se publica en GitHub Pages (`https://josemarrero3012.github.io/CalmaCafe/`).

**Leyenda:** ✅ hecho · ⏳ depende del cliente o del dominio (no se puede cerrar desde el código) · — ya no aplica.

## 01 · Diseño y experiencia

| N.º | Punto | Estado | Qué se hizo / qué falta |
|---|---|---|---|
| 1 | Alérgenos incoherentes | ✅ | Carta importada de la oficial y completada por ingrediente (`docs/ALERGENOS.md`). Tosta Salmón, Tosta huevos revueltos y bacon, Tosta Brie y Granola Cacahuete ya marcan lo que llevan. Pendiente: que el local corrija su carta digital. |
| 2 | Horario | ✅ | Visítanos (tabla por días y cocina), pie, indicador «Abierto/Cerrado», preguntas frecuentes y JSON-LD. |
| 3 | Reseñas solo como enlace | ✅ / ⏳ | «★ 4,8 en Google» en Inicio, enlazado a la ficha (dato de la ficha, 15/10/2026; sin el total, que cambia). ⏳ Textos de reseñas: tres reales con permiso del local. |
| 4 | Pancakes con extras a precios distintos | ✅ / ⏳ | Un solo precio: en «¡Algo dulce!» los Pancakes pasan a ser una referencia «en Brunch →» (`src/lib/carta.ts`). ⏳ Confirmar con el local el precio de la nata (1,50 € en Brunch, 1,00 € en ¡Algo dulce!). |
| 5 | Aviso legal, privacidad y cookies de relleno | ⏳ | Necesita titular, NIF, dirección fiscal y correo. Mientras, los enlaces abren avisos accesibles. |
| 6 | «Triassant» sin explicar | ✅ | El texto del hero lo explica en los cuatro idiomas («mezcla de croissant y pan de cereales»). |
| 7 | «Powered by Netlify» tapa «Llamar» | — | La web ya no está en Netlify. |
| 8 | Hero móvil mal ordenado | ✅ | «Ver la carta» justo bajo el H1, polaroids y sello reducidos y «Feed your soul» entero. |
| 9 | Elementos fijos de la carta en móvil | ✅ | Menús y secciones en una sola fila deslizable con degradado; la cabecera se aparta al bajar. Al leer, la zona fija pasa de 201 px a 53 px (de 844). |
| 10 | Ilustración de la carta en móvil | ✅ | Oculta en móvil. |
| 11 | Texto pequeño | ✅ | Texto corrido a 16 px; secundario (botones, enlaces, alérgenos, pie, filtros…) a 14 px como mínimo; etiquetas en mayúsculas espaciadas de 11 a 12 px. El texto circular del sello no se toca. |
| 12 | Mayúsculas inconsistentes | ✅ | Correcciones en `scripts/prepare-carta.mjs` (sobreviven a cada importación): «estilo americano», «Rollito de canela», «Ensalada de quinoa»… y «Dulce casero del día» con la nota «Pregunta por los de hoy». |
| 13 | Filtro «Carta» ambiguo | ✅ | La pestaña se llama «Todo» (All, Alles, Alles). |
| 14 | Falta og:image y canonical | ✅ | Ver SEO 2 y 9. |
| 15 | «Cómo llegar» repetido, sin CTA de WhatsApp | ⏳ | Preguntar al local si acepta pedidos o reservas antes de añadir un botón. |
| 16 | Imágenes con poca resolución | ✅ / ⏳ | Las fotos de platos ya tienen `srcset` hasta 800 px (2× para la polaroid de 330 px). ⏳ El fondo del hero no existe a más de 1706 px: pedir el original a mayor resolución. |
| 17 | Animaciones que dejan huecos | ✅ | Los bloques entran con un 25 % de margen antes de llegar a la pantalla; la pizarra sigue escribiéndose a la vista. |
| 18 | H2 vacío | ✅ | Los títulos de los diálogos son `<p>` nombrados con `aria-labelledby`. |
| 19 | Detalles de la página Calma | ✅ / ⏳ | El pie «La otra pizarra.» ahora dice lo que pone: «A yawn is a silent scream for coffee». ⏳ Nombres o foto de la pareja, si quieren. |

## 02 · SEO

| N.º | Punto | Estado | Qué se hizo / qué falta |
|---|---|---|---|
| 1 | Sin dominio propio | ⏳ | Al tenerlo: `site` con el dominio y quitar `base` en `astro.config.mjs`, configurar el dominio en GitHub Pages, forzar HTTPS y redirigir la URL antigua. |
| 2 | Sin canonical | ✅ | Canonical absoluto y autorreferente en cada página e idioma. Pasará al dominio solo con cambiar `site`. |
| 3 | Sin robots.txt | ✅ / ⏳ | `src/pages/robots.txt.ts` con la referencia al sitemap. Los buscadores solo lo leen en la raíz del dominio: cuenta a partir del dominio propio. |
| 4 | Sin sitemap | ✅ / ⏳ | `src/pages/sitemap.xml.ts`: 16 URL con hreflang. ⏳ Enviarlo en Search Console con el dominio. |
| 5 | hreflang relativos | ✅ | Absolutos, con x-default. |
| 6 | 404 genérica | ✅ | `404.astro` propio con enlaces a inicio, carta, Visítanos y los otros idiomas. |
| 7 | Fotos de platos no rastreables | ✅ | Las 91 fotos de platos van en el sitemap de imágenes de cada página de carta. |
| 8 | Aviso de Netlify | — | Ya no aplica. |
| 9 | Faltan og:image, og:url y Twitter Card | ✅ | `og-calma.jpg` (1200×630, sin texto, vale para los cuatro idiomas), og:url, og:site_name, `summary_large_image`. |
| 10 | H2 vacíos | ✅ | Ver diseño 18. |
| 11 | H1/H2 sin espacio entre palabras | ✅ | Espacio antes de cada `<br />`: «Brunch y café en Maspalomas.». |
| 12 | /visitanos/ con poco contenido | ✅ / ⏳ | Horario, código postal y municipio, y una sección «Preguntas frecuentes» con datos confirmados (el horario sale de `negocio.json`). ⏳ Aparcamiento, guagua, terraza, perros y referencias cercanas: los tiene que dar el local. |
| 13 | Títulos sin búsquedas de brunch | ✅ | «Dónde estamos y horario · Calma Café, Avda. de Tirajana (Maspalomas)» y «Café de brunch con plantas en Maspalomas · Calma Café», en los cuatro idiomas. |
| 14 | Alt vacíos en fotos de contenido | ✅ | El hero y las tarjetas de Inicio describen la foto; solo los lotos decorativos llevan `alt=""`. |
| 15 | Precios incoherentes | ✅ / ⏳ | Ver diseño 4. |
| 16 | Horario | ✅ | Ver diseño 2. |
| 17 | Schema incompleto | ✅ | url, image, geo, openingHoursSpecification, postalCode, priceRange (10–20 €, ficha de Google), hasMenu, hasMap y la ficha en sameAs. ⏳ `acceptsReservations` cuando el local lo confirme. Validar con la Prueba de resultados enriquecidos al publicar. |
| 18 | Ficha de Google sin enlazar | ✅ | «Cómo llegar», horario y reseñas abren la ficha; está en sameAs. ⏳ Poner el dominio nuevo en la ficha. |
| 19 | Ambigüedad de marca y localidad | ✅ | Mismo NAP en toda la web; el schema añade `areaServed` con Maspalomas y San Bartolomé de Tirajana. |
| 20 | Faltan páginas por intención | ✅ / ⏳ | Menús Vegetariano y Vegano con introducción y enlace propio (`/carta/#vegano`); «Para los niños» con introducción. ⏳ «Sin gluten»: aclarar antes el alcance de «¡Toda la carta se puede hacer sin gluten!». |
| 21 | Sin prueba social | ✅ | Ver diseño 3. |
| 22 | Rendimiento sin datos de campo | ⏳ | PageSpeed Insights cuando esté en el dominio final. |
| 23 | Perfil de enlaces | ⏳ | Con el dominio: pedir a directorios, Instagram y la ficha que apunten a él. |

## Comprobaciones (16 de octubre de 2026)

`npm run build` (0 errores de tipos), `npm test` (18 de 18) y `npm run qa` contra una compilación sin `base`: 16 páginas a 390 y 1440 px, sin errores de JavaScript ni incidencias de axe. El QA compara rutas sin `base`, así que contra GitHub Pages se lanza con una compilación `npx astro build --base /`.
